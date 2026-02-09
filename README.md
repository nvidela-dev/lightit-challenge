<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="frontend/src/assets/doctor-stock.jpg" alt="Logo" width="120" height="120" style="border-radius: 50%;">

  <h3 align="center">Patient Registration App</h3>

  <p align="center">
    A full-stack patient registration system with React frontend and Express backend
    <br />
    <a href="#getting-started"><strong>Get Started »</strong></a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#architecture">Architecture</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#api-reference">API Reference</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#e2e-testing">E2E Testing</a></li>
    <li><a href="#docker">Docker</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

A modern patient registration application that allows healthcare providers to:

* Register new patients with photo ID upload
* View all registered patients in a responsive card grid
* Receive email confirmations via an async job queue
* Validate all inputs with real-time feedback

The application features a glass-morphism UI design, drag-and-drop file uploads, and a collapsible hero section for optimal screen real estate.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

**Frontend**

[![React][React.js]][React-url] [![TypeScript][TypeScript]][TypeScript-url] [![TailwindCSS][TailwindCSS]][TailwindCSS-url] [![Vite][Vite]][Vite-url] [![TanStack Query][TanStack]][TanStack-url]

**Backend**

[![Node.js][Node.js]][Node-url] [![Express][Express]][Express-url] [![Prisma][Prisma]][Prisma-url] [![BullMQ][BullMQ]][BullMQ-url] [![PostgreSQL][PostgreSQL]][PostgreSQL-url] [![Redis][Redis]][Redis-url]

**Testing**

[![Vitest][Vitest]][Vitest-url] [![Playwright][Playwright]][Playwright-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Docker Compose                          │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│    React    │   Express   │   Worker    │  PostgreSQL │  Redis  │
│   Frontend  │     API     │  (BullMQ)   │             │         │
│   :5173     │   :3001     │             │   :5432     │  :6379  │
├─────────────┴─────────────┴──────┬──────┴─────────────┴─────────┤
│                                  │                               │
│                             ┌────▼────┐                          │
│                             │ Mailpit │                          │
│                             │  :8025  │                          │
│                             └─────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

| Service   | Port  | Purpose                          |
|-----------|-------|----------------------------------|
| Frontend  | 5173  | React development server         |
| API       | 3001  | Express REST API + static files  |
| Worker    | —     | BullMQ email processor           |
| PostgreSQL| 5432  | Database                         |
| Redis     | 6379  | Job queue backend                |
| Mailpit   | 8025  | Email testing UI                 |

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* Node.js 20+
* Docker & Docker Compose
* npm or yarn

### Installation

1. Clone the repo
   ```sh
   git clone <repository-url>
   cd lightit-challenge
   ```

2. Install dependencies
   ```sh
   make install
   ```

3. Start development environment
   ```sh
   make dev
   ```

   This starts:
   - PostgreSQL, Redis, and Mailpit via Docker
   - Backend API on http://localhost:3001
   - Frontend on http://localhost:5173
   - Mailpit UI on http://localhost:8025

4. (Optional) Seed the database with sample patients
   ```sh
   make seed
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### Makefile Commands

| Command           | Description                                    |
|-------------------|------------------------------------------------|
| `make help`       | Show all available commands                    |
| `make install`    | Install dependencies for backend and frontend  |
| `make dev`        | Start full development environment             |
| `make up`         | Start all Docker services                      |
| `make down`       | Stop all Docker services                       |
| `make logs`       | Tail logs from all containers                  |
| `make build`      | Build Docker images                            |
| `make clean`      | Remove containers, volumes, and build artifacts|
| `make migrate`    | Run database migrations                        |
| `make seed`       | Seed database with sample data                 |
| `make db-reset`   | Reset database (drop, migrate, seed)           |
| `make mail`       | Open Mailpit UI in browser                     |
| `make test`       | Run all tests (backend + frontend)             |
| `make coverage`   | Run tests with coverage reports                |
| `make worker`     | Start notification worker                      |

### Quick API Test

```sh
# Check API health
make api-health

# List all patients
make api-patients

# Create a test patient
make api-create-patient
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- API REFERENCE -->
## API Reference

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### List Patients
```
GET /api/patients?page=1&limit=18
```
Returns paginated list of patients.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@gmail.com",
      "phoneCode": "+1",
      "phoneNumber": "5551234567",
      "documentUrl": "/uploads/uuid.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 18,
    "total": 100
  }
}
```

### Create Patient
```
POST /api/patients
Content-Type: multipart/form-data
```

**Fields:**
| Field       | Type   | Required | Description                |
|-------------|--------|----------|----------------------------|
| fullName    | string | Yes      | Patient's full name        |
| email       | string | Yes      | Valid Gmail address        |
| phoneCode   | string | Yes      | Country code (e.g., +1)    |
| phoneNumber | string | Yes      | 10-digit phone number      |
| document    | file   | Yes      | JPEG image (max 5MB)       |

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- TESTING -->
## Testing

The project maintains high test coverage across both frontend and backend.

```sh
# Run all tests
make test

# Run tests with coverage reports
make coverage
```

### Coverage Thresholds

| Project  | Lines | Functions | Branches | Statements |
|----------|-------|-----------|----------|------------|
| Backend  | 100%  | 100%      | 100%     | 100%       |
| Frontend | 95%   | 95%       | 95%      | 95%        |

Coverage reports are generated in `backend/coverage/` and `frontend/coverage/`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- E2E TESTING -->
## E2E Testing

End-to-end tests are built with [Playwright](https://playwright.dev/) and cover all user-facing flows.

### Setup

```sh
# Install Playwright and dependencies (first time only)
make e2e-install
```

### Running Tests

| Command           | Description                              |
|-------------------|------------------------------------------|
| `make e2e`        | Run all E2E tests                        |
| `make e2e-ui`     | Run tests with interactive UI mode       |
| `make e2e-headed` | Run tests with visible browser           |
| `make e2e-debug`  | Run tests in debug mode                  |
| `make e2e-report` | Open HTML test report                    |

### Test Coverage

| Suite                | Tests | Description                                      |
|----------------------|-------|--------------------------------------------------|
| Patient Registration | 7     | Form validation, submission, duplicate handling  |
| Patient Listing      | 4     | Empty state, pagination, hero collapse           |
| Email Notifications  | 2     | Confirmation email via Mailpit                   |
| Error Handling       | 3     | API errors, invalid file types                   |

Tests verify the complete flow from UI interaction through API to database and email delivery.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- DOCKER -->
## Docker

### Production Build

Build and run the complete stack:

```sh
docker compose up --build
```

This builds a multi-stage Docker image that:
1. Compiles TypeScript backend
2. Builds React frontend
3. Serves everything from a single Express server

### Environment Variables

| Variable      | Default                  | Description           |
|---------------|--------------------------|-----------------------|
| DATABASE_URL  | (set in docker-compose)  | PostgreSQL connection |
| REDIS_URL     | redis://redis:6379       | Redis connection      |
| SMTP_HOST     | mailpit                  | SMTP server host      |
| SMTP_PORT     | 1025                     | SMTP server port      |
| EMAIL_FROM    | noreply@patientapp.dev   | Sender email address  |
| PORT          | 3001                     | API server port       |

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[TanStack]: https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white
[TanStack-url]: https://tanstack.com/query
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express]: https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Prisma]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[BullMQ]: https://img.shields.io/badge/BullMQ-E34F26?style=for-the-badge&logo=bull&logoColor=white
[BullMQ-url]: https://bullmq.io/
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Redis]: https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white
[Redis-url]: https://redis.io/
[Vitest]: https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white
[Vitest-url]: https://vitest.dev/
[Playwright]: https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white
[Playwright-url]: https://playwright.dev/
