FROM oven/bun:alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM oven/bun:alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/node_modules ./node_modules
COPY tsconfig.json ./tsconfig.json
COPY src/ ./src/

USER appuser
EXPOSE 3000

CMD ["bun", "src/index.ts"]
