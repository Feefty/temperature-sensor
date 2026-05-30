# Build context is the monorepo root (see docker-compose.yml).

FROM node:20-alpine AS build
WORKDIR /repo
COPY package.json package-lock.json ./
COPY api/package.json ./api/
RUN npm ci
COPY api ./api
RUN npm run build --workspace=@temperature-sensor/api

FROM node:20-alpine AS runtime
WORKDIR /repo
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY api/package.json ./api/
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /repo/api/dist ./api/dist
USER node
EXPOSE 3000
# Health probe hits the read-only history endpoint, so it never records a stub reading.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node -e "fetch('http://localhost:3000/api/v1/temperature/history').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "api/dist/main.js"]
