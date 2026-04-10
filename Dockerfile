# -- Stage 1: Build & Compile --
FROM node:20-alpine AS builder

WORKDIR /app

# Copy configuration files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including dev tools like typescript)
RUN npm install

# Copy application code and schema
COPY db/ ./db/
COPY src/ ./src/

# Generate Prisma client locally for the build
RUN npx prisma generate --schema=db/prisma.schema

# Build the TypeScript files to JS (outputs to /app/dist)
RUN npm run build


# -- Stage 2: Production Environment --
FROM node:20-alpine AS production

WORKDIR /app

# Define production environment
ENV NODE_ENV=production
ENV PORT=5000

# Add a non-root user for security best practice
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package config and only install production dependencies
COPY --chown=appuser:appgroup package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the generated Prisma client logic from the builder, isolated from migrations
COPY --chown=appuser:appgroup --from=builder /app/db/generated ./db/generated

# Copy the built JS files from the builder stage
COPY --chown=appuser:appgroup --from=builder /app/dist ./dist

# Switch to the non-root user
USER appuser

EXPOSE 5000

# Start compiled JS instead of using ts-node
CMD ["npm", "start"]
