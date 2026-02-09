.PHONY: help install dev up down logs build clean migrate seed mail db-reset test coverage worker \
        api-health api-patients api-create-patient \
        e2e-install e2e e2e-ui e2e-headed e2e-debug e2e-report

# Default target
help:
	@echo "Patient Registration App - Available Commands:"
	@echo ""
	@echo "  make install    - Install dependencies for backend and frontend"
	@echo "  make dev        - Start development environment (docker services + local dev servers)"
	@echo "  make up         - Start all Docker services"
	@echo "  make down       - Stop all Docker services"
	@echo "  make logs       - Tail logs from all containers"
	@echo "  make build      - Build Docker images"
	@echo "  make clean      - Remove containers, volumes, and build artifacts"
	@echo ""
	@echo "  make migrate    - Run database migrations"
	@echo "  make seed       - Seed database with sample data"
	@echo "  make db-reset   - Reset database (drop, migrate, seed)"
	@echo ""
	@echo "  make mail       - Open Mailpit UI in browser"
	@echo "  make test       - Run all tests (backend + frontend)"
	@echo "  make coverage   - Run tests with coverage reports"
	@echo "  make worker     - Start notification worker"
	@echo ""
	@echo "E2E Testing:"
	@echo "  make e2e-install - Install E2E dependencies and Playwright"
	@echo "  make e2e         - Run E2E tests"
	@echo "  make e2e-ui      - Run E2E tests with UI mode"
	@echo "  make e2e-headed  - Run E2E tests with visible browser"
	@echo "  make e2e-debug   - Run E2E tests in debug mode"
	@echo "  make e2e-report  - Show E2E test report"
	@echo ""
	@echo "API Testing:"
	@echo "  make api-health         - Check API health endpoint"
	@echo "  make api-patients       - List all patients"
	@echo "  make api-create-patient - Create a test patient"
	@echo ""

# Install dependencies
install:
	cd backend && npm install
	cd frontend && npm install

# Development mode - start docker services and run dev servers
dev: up-services
	@echo "Starting development servers..."
	@echo "Backend: http://localhost:3001"
	@echo "Frontend: http://localhost:5173"
	@echo "Mailpit: http://localhost:8025"
	@trap 'make down-services' EXIT; \
	(cd backend && npm run dev) & \
	(cd backend && npm run worker:dev) & \
	(cd frontend && npm run dev) & \
	wait

# Start only infrastructure services (postgres, redis, mailpit)
up-services:
	docker compose up -d postgres redis mailpit
	@echo "Waiting for services to be healthy..."
	@sleep 3

# Stop infrastructure services
down-services:
	docker compose down

# Start all Docker services (full stack)
up:
	docker compose up -d
	@echo ""
	@echo "Services started:"
	@echo "  API:     http://localhost:3001"
	@echo "  Mailpit: http://localhost:8025"

# Stop all Docker services
down:
	docker compose down

# Tail logs
logs:
	docker compose logs -f

# Build Docker images
build:
	docker compose build

# Clean everything
clean:
	docker compose down -v --remove-orphans
	rm -rf backend/dist backend/node_modules
	rm -rf frontend/dist frontend/node_modules
	rm -rf backend/public

# Run migrations
migrate:
	cd backend && npm run db:migrate

# Seed database
seed:
	cd backend && npm run db:seed

# Reset database
db-reset:
	cd backend && npx prisma migrate reset --force

# Open Mailpit UI
mail:
	@echo "Opening Mailpit at http://localhost:8025"
	@open http://localhost:8025 2>/dev/null || xdg-open http://localhost:8025 2>/dev/null || echo "Please open http://localhost:8025 in your browser"

# Run tests
test:
	cd backend && npm test
	cd frontend && npm test

# Run tests with coverage
coverage:
	cd backend && npm run test:coverage
	cd frontend && npm run test:coverage

# Start notification worker
worker:
	cd backend && npm run worker:dev

# =============================================================================
# API Testing
# =============================================================================

# Check API health
api-health:
	@curl -s http://localhost:3001/api/health | jq .

# List all patients
api-patients:
	@curl -s http://localhost:3001/api/patients | jq .

# Create a test patient (requires a test.jpg in backend/uploads/)
api-create-patient:
	@echo "Creating test patient..."
	@curl -s -X POST http://localhost:3001/api/patients \
		-F "fullName=Test Patient" \
		-F "email=test.$(shell date +%s)@gmail.com" \
		-F "phoneCode=+1" \
		-F "phoneNumber=5551234567" \
		-F "document=@backend/uploads/test-image.jpg" | jq .

# =============================================================================
# E2E Testing
# =============================================================================

# Install E2E dependencies
e2e-install:
	cd e2e && npm install
	cd e2e && npx playwright install chromium

# Run E2E tests (starts dev environment automatically)
e2e:
	cd e2e && npm test

# Run E2E tests with UI mode
e2e-ui:
	cd e2e && npm run test:ui

# Run E2E tests in headed mode (visible browser)
e2e-headed:
	cd e2e && npm run test:headed

# Run E2E tests in debug mode
e2e-debug:
	cd e2e && npm run test:debug

# Show E2E test report
e2e-report:
	cd e2e && npm run report
