# Development Dockerfile for API Gateway
FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Create logs directory and public directory
RUN mkdir -p logs public

# Copy source code
COPY . .

# Set permissions for all files and directories
RUN chown -R node:node /app
RUN chmod -R 755 /app

# Keep root user for development to avoid permission issues
# USER node

# Expose port
EXPOSE 8000

# Set environment variables
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=development

# Run development server
CMD ["npm", "run", "dev"]