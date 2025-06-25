# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Development dependencies stage
FROM base AS development-dependencies-env
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Production dependencies stage
FROM base AS production-dependencies-env
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Build stage
FROM base AS build-env
COPY package.json pnpm-lock.yaml ./
COPY --from=development-dependencies-env /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN pnpm run generate:prisma

# Build the application
RUN pnpm run build

# Production stage
FROM base AS production

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Copy production dependencies
COPY --from=production-dependencies-env /app/node_modules ./node_modules

# Copy built application and necessary files
COPY --from=build-env /app/build ./build
COPY --from=build-env /app/prisma ./prisma
COPY --from=build-env /app/generated ./generated
COPY --from=build-env /app/public ./public

ENV PORT=3000
# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]