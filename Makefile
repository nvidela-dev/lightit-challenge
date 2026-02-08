.PHONY: help install dev up down logs build clean migrate seed mail db-reset test worker

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
	@echo "  make test       - Run backend tests"
	@echo "  make worker     - Start notification worker"
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

# Start notification worker
worker:
	cd backend && npm run worker:dev
