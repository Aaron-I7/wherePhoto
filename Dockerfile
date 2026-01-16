# Multi-stage build

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup Backend & Final Image
FROM node:18-alpine
WORKDIR /app

# Setup Server
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

# Copy Server Code
COPY server/ ./

# Copy Built Frontend to Server Public Directory
COPY --from=frontend-builder /app/client/dist ./public

# Create uploads directory
RUN mkdir -p uploads

# Expose Port
EXPOSE 3000

# Start Command
CMD ["node", "index.js"]
