FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production && npm cache clean --force

FROM node:22-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p logs public storages

# Expose port (sesuaikan dengan APP_PORT di environment variable)
# Default 9565 untuk production, bisa diubah via environment variable
EXPOSE 9566

# Start application
CMD ["node", "--require", "./src/instrumentation.js", "src/server.js"]
