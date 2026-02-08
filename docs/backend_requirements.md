# Backend Requirements — Patient Registration API

## Tech Stack

| Layer              | Technology                        | Rationale                                                                 |
|--------------------|-----------------------------------|---------------------------------------------------------------------------|
| Runtime            | Node.js + TypeScript              | Primary expertise; type safety across the entire stack                    |
| Framework          | Express.js                        | Lightweight, well-understood; lets architecture decisions speak for themselves |
| ORM                | Prisma                            | Type-safe queries, declarative migrations, excellent PostgreSQL support   |
| Database           | PostgreSQL                        | As required by the challenge                                              |
| Queue              | BullMQ + Redis                    | Async email processing; mirrors Laravel's queue system                   |
| Email              | Nodemailer + Mailpit              | Local email testing via Docker; no external accounts needed              |
| Validation         | Zod                               | Schema-based validation composable across layers (API + service)         |
| File Storage       | Local disk (`/uploads`)           | Simple for the challenge scope; abstracted behind a storage service for future S3 swap |
| Containerization   | Docker + Docker Compose           | PostgreSQL, Redis, API server, and queue worker in a single `docker-compose up` |

---

## Architecture Overview

```
┌──────────────┐     ┌──────────────────┐     ┌────────────────┐
│   Express     │────▶│  PatientService   │────▶│  Prisma (PG)   │
│   Router      │     └──────────────────┘     └────────────────┘
│   + Multer    │              │
└──────────────┘              │ dispatch
                              ▼
                     ┌──────────────────┐     ┌────────────────┐
                     │   BullMQ Queue    │────▶│  Queue Worker   │
                     │  (Redis-backed)   │     │  (email job)    │
                     └──────────────────┘     └────────────────┘
                                                      │
                                                      ▼
                                              ┌────────────────┐
                                              │   Nodemailer    │
                                              │   (Mailpit)     │
                                              └────────────────┘
```

**Pattern:** Controller → Service → Repository (Prisma). The service layer owns business logic and dispatches side effects (email, future SMS) to the queue. This keeps the controller thin and the async work decoupled.

---

## Data Model

### `Patient` table

| Column        | Type          | Constraints                          |
|---------------|---------------|--------------------------------------|
| `id`          | UUID          | PK, default `gen_random_uuid()`      |
| `fullName`    | VARCHAR(255)  | NOT NULL                             |
| `email`       | VARCHAR(255)  | NOT NULL, UNIQUE                     |
| `phoneCode`   | VARCHAR(10)   | NOT NULL (e.g. `+598`)              |
| `phoneNumber` | VARCHAR(20)   | NOT NULL                             |
| `documentUrl` | VARCHAR(500)  | NOT NULL (relative path to uploaded file) |
| `createdAt`   | TIMESTAMP     | Default `now()`                      |
| `updatedAt`   | TIMESTAMP     | Auto-updated                         |

### Prisma Schema (draft)

```prisma
model Patient {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  fullName     String   @db.VarChar(255)
  email        String   @unique @db.VarChar(255)
  phoneCode    String   @db.VarChar(10)
  phoneNumber  String   @db.VarChar(20)
  documentUrl  String   @db.VarChar(500)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## API Endpoints

### `GET /api/patients`

Returns all registered patients.

**Response `200`:**
```json
{
  "data": [
    {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@gmail.com",
      "phoneCode": "+598",
      "phoneNumber": "99123456",
      "documentUrl": "/uploads/abc123.jpg",
      "createdAt": "2025-02-08T12:00:00Z"
    }
  ]
}
```

### `POST /api/patients`

Registers a new patient. Accepts `multipart/form-data`.

**Request body (form-data):**

| Field         | Type   | Required | Notes                          |
|---------------|--------|----------|--------------------------------|
| `fullName`    | string | ✅       | Letters and spaces only        |
| `email`       | string | ✅       | Must be `@gmail.com`, unique   |
| `phoneCode`   | string | ✅       | Format: `+` followed by 1-4 digits |
| `phoneNumber` | string | ✅       | Digits only, 6-15 characters  |
| `document`    | file   | ✅       | `.jpg` only, max 5MB          |

**Response `201`:**
```json
{
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@gmail.com",
    "phoneCode": "+598",
    "phoneNumber": "99123456",
    "documentUrl": "/uploads/abc123.jpg",
    "createdAt": "2025-02-08T12:00:00Z"
  }
}
```

**Response `400` (validation error):**
```json
{
  "errors": {
    "fullName": "Full name must only contain letters and spaces",
    "email": "A patient with this email already exists"
  }
}
```

**Response `500`:**
```json
{
  "error": "Internal server error"
}
```

### `GET /uploads/:filename`

Serves uploaded document photos as static files.

---

## Validation Rules

Implemented via **Zod schemas** at the service layer, with Multer handling file filtering at the middleware level.

| Field         | Rule                                                        |
|---------------|-------------------------------------------------------------|
| `fullName`    | Required. Letters and spaces only (`/^[a-zA-ZÀ-ÿ\s]+$/`). Max 255 chars. |
| `email`       | Required. Valid email format. Must end with `@gmail.com`. Unique in DB. |
| `phoneCode`   | Required. Matches `/^\+\d{1,4}$/`.                         |
| `phoneNumber` | Required. Digits only. Between 6 and 15 characters.        |
| `document`    | Required. MIME type `image/jpeg`. Max file size 5MB.        |

**Uniqueness check:** The email uniqueness constraint is enforced at two levels:
1. **Service layer** — query DB before insert, return a friendly error.
2. **Database layer** — unique index as a safety net; catch Prisma's unique constraint error and map to a `400`.

---

## Async Email Processing

### Flow

1. `PatientService.register()` persists the patient.
2. On success, it enqueues a `SEND_CONFIRMATION_EMAIL` job to BullMQ.
3. The **queue worker** (separate process) picks up the job and sends the email via Nodemailer.
4. If the email fails, BullMQ retries with exponential backoff (3 attempts).

### Job Payload

```typescript
interface ConfirmationEmailJob {
  type: 'SEND_CONFIRMATION_EMAIL';
  payload: {
    patientId: string;
    email: string;
    fullName: string;
  };
}
```

### Email Content

Simple HTML email:
- Subject: `Registration Confirmed`
- Body: "Hi {fullName}, your registration has been received successfully."

No design required — plain and functional.

### Mailpit Configuration

Mailpit runs as a Docker container alongside the other services. No external accounts required.

```env
SMTP_HOST=mailpit
SMTP_PORT=1025
EMAIL_FROM=noreply@patientapp.dev
```

The Mailpit web UI is accessible at `http://localhost:8025` to view captured emails.

---

## Forward-Looking: SMS Notification Support

The challenge states the client will want SMS within two months. The architecture anticipates this without implementing it:

### Notification Service Abstraction

```typescript
// src/services/notification/notification.service.ts
interface NotificationChannel {
  send(recipient: string, message: string): Promise<void>;
}

// src/services/notification/channels/email.channel.ts
class EmailChannel implements NotificationChannel { ... }

// FUTURE: src/services/notification/channels/sms.channel.ts
// class SmsChannel implements NotificationChannel { ... }
```

### Queue Job Types

The BullMQ queue already supports typed jobs. Adding SMS is a new job type + a new channel implementation:

```typescript
type NotificationJob =
  | { type: 'SEND_CONFIRMATION_EMAIL'; payload: { ... } }
  // FUTURE:
  // | { type: 'SEND_CONFIRMATION_SMS'; payload: { phoneCode: string; phoneNumber: string; fullName: string } }
```

### Data Model Readiness

Phone is stored as `phoneCode` + `phoneNumber` (split fields), which is exactly what an SMS provider (Twilio, SNS) needs. No schema migration required when SMS ships.

---

## Docker Compose Services

| Service        | Image / Build       | Ports          | Notes                              |
|----------------|---------------------|----------------|------------------------------------|
| `api`          | Build from Dockerfile | `3001:3001`   | Express server                     |
| `worker`       | Same image, different entrypoint | —  | BullMQ processor; no exposed ports |
| `postgres`     | `postgres:16-alpine` | `5432:5432`   | Volume for data persistence        |
| `redis`        | `redis:7-alpine`     | `6379:6379`   | Queue backend                      |
| `mailpit`      | `axllent/mailpit`    | `8025:8025`, `1025:1025` | Email testing UI + SMTP server |

### Startup Order

`postgres` + `redis` + `mailpit` → `api` (runs Prisma migrations on boot) → `worker`

### Target Developer Experience

```bash
git clone <repo>
cp .env.example .env
docker-compose up --build
# API available at http://localhost:3001
# Mailpit inbox at http://localhost:8025 shows confirmation emails
```

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── index.ts                         # Express app bootstrap
│   ├── config/
│   │   ├── env.ts                       # Validated env vars (Zod)
│   │   ├── database.ts                  # Prisma client singleton
│   │   └── queue.ts                     # BullMQ connection
│   ├── modules/
│   │   └── patient/
│   │       ├── patient.controller.ts    # Route handlers (thin)
│   │       ├── patient.service.ts       # Business logic
│   │       ├── patient.schema.ts        # Zod validation schemas
│   │       └── patient.routes.ts        # Express router
│   ├── services/
│   │   └── notification/
│   │       ├── notification.service.ts  # Dispatcher
│   │       └── channels/
│   │           └── email.channel.ts     # Nodemailer implementation
│   ├── workers/
│   │   └── notification.worker.ts       # BullMQ processor
│   ├── middleware/
│   │   ├── upload.ts                    # Multer config (.jpg only)
│   │   ├── validate.ts                  # Generic Zod validation middleware
│   │   └── errorHandler.ts             # Global error handler
│   └── shared/
│       ├── types.ts                     # Shared TypeScript types
│       └── errors.ts                    # Custom error classes
├── uploads/                             # Uploaded document photos
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── tsconfig.json
├── package.json
└── ARCHITECTURE.md                      # Maps decisions to Laravel equivalents
```

---

## Checklist Before Submission

- [ ] `docker-compose up --build` works from a clean clone
- [ ] Patient creation with valid data returns `201`
- [ ] Duplicate email returns `400` with clear message
- [ ] Invalid fields return per-field error messages
- [ ] Confirmation email appears in Mailpit inbox (http://localhost:8025)
- [ ] `GET /api/patients` returns all patients with document URLs
- [ ] Uploaded photos are accessible via URL
- [ ] No personal name in source code (anonymous review)
- [ ] `ARCHITECTURE.md` maps Node patterns to Laravel equivalents
