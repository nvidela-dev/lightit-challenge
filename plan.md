# Patient Registration App — Implementation Plan

## Overview

A full-stack patient registration system with React frontend and Express backend, served from a single Docker Compose stack.

## Project Structure

```
/
├── docs/                    # Requirements and specs
├── frontend/                # React + Vite + TypeScript
├── backend/                 # Express + Prisma + BullMQ
├── docker-compose.yml
├── Makefile
└── plan.md
```

## Implementation Phases

### Phase 1: Project Scaffolding
- [ ] Initialize `backend/` with Express + TypeScript
- [ ] Initialize `frontend/` with Vite + React + TypeScript
- [ ] Create `docker-compose.yml` with postgres, redis, mailpit
- [ ] Create `Makefile` with dev commands

### Phase 2: Backend Core
- [ ] Set up Prisma with Patient model
- [ ] Create migrations + seed data
- [ ] Implement `POST /api/patients` with Multer + Zod validation
- [ ] Implement `GET /api/patients`
- [ ] Serve static files from `/uploads`

### Phase 3: Email Queue
- [ ] Set up BullMQ with Redis
- [ ] Create notification worker
- [ ] Implement email channel with Nodemailer + Mailpit
- [ ] Wire registration to queue confirmation email

### Phase 4: Frontend Core
- [ ] Build reusable components (Modal, Button, FormField, etc.)
- [ ] Create PatientForm with Zod validation
- [ ] Create FileDropzone (drag-and-drop)
- [ ] Create PhoneInput (compound input)

### Phase 5: Frontend Integration
- [ ] Set up TanStack Query
- [ ] Implement usePatients + useCreatePatient hooks
- [ ] Build PatientPage with card grid
- [ ] Build RegistrationModal with state transitions

### Phase 6: Production Build
- [ ] Configure Vite to build into `backend/public`
- [ ] Update Express to serve SPA
- [ ] Create multi-stage Dockerfile
- [ ] Test full docker-compose up flow

## Makefile Targets

| Command           | Description                              |
|-------------------|------------------------------------------|
| `make dev`        | Start all services in dev mode           |
| `make up`         | Start Docker Compose stack               |
| `make down`       | Stop Docker Compose stack                |
| `make migrate`    | Run Prisma migrations                    |
| `make seed`       | Seed database with sample data           |
| `make logs`       | Tail all container logs                  |
| `make mail`       | Open Mailpit UI (localhost:8025)         |

## Docker Services

| Service   | Port(s)         | Purpose                        |
|-----------|-----------------|--------------------------------|
| api       | 3001            | Express server + static files  |
| worker    | —               | BullMQ email processor         |
| postgres  | 5432            | Database                       |
| redis     | 6379            | Queue backend                  |
| mailpit   | 8025, 1025      | Email testing UI + SMTP        |
