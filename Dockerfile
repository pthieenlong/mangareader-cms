# ==================== Build Stage ====================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Accept build argument for VITE_API_URL
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# ==================== Production Stage ====================
FROM node:20-alpine

# Install serve to run the static files
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 5173
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]

