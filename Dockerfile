# Stage 1: Build stage
FROM oven/bun:1 AS builder

ARG BUN_PUBLIC_API_BASE_URL
WORKDIR /app

# Copy package files
COPY package.json bun.lock bunfig.toml ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
ENV BUN_PUBLIC_API_BASE_URL=${BUN_PUBLIC_API_BASE_URL}
RUN bun run build

# Stage 2: Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

