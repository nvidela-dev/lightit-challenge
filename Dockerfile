# Stage 1: Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine
WORKDIR /app

# Copy backend build and dependencies
COPY --from=backend /app/dist ./dist
COPY --from=backend /app/node_modules ./node_modules
COPY --from=backend /app/package.json ./

# Copy Prisma schema for migrations
COPY backend/prisma ./prisma

# Copy frontend build to public folder
COPY --from=frontend /app/frontend/dist ./public

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "dist/index.js"]
