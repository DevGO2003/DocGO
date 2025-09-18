# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build ứng dụng Vite
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port 3000
EXPOSE 3000

# Thiết lập biến môi trường
ENV NODE_ENV=production
ENV PORT=3000

# Command khởi chạy service
CMD ["serve", "-s", "dist", "-l", "3000"]
