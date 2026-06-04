# Build context is the monorepo root (see docker-compose.yml).

FROM node:20-alpine AS build
WORKDIR /repo
COPY package.json package-lock.json ./
COPY web/package.json ./web/
RUN npm ci
COPY web ./web
# No VITE_API_URL: the app defaults to the same-origin /api/v1, which nginx proxies to the api.
RUN npm run build --workspace=@temperature-sensor/web

# Unprivileged variant: runs as the non-root `nginx` user and listens on 8080, matching the
# api image's hardened posture.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/web/dist /usr/share/nginx/html
EXPOSE 8080
# Probe 127.0.0.1, not localhost: localhost resolves to ::1 in the container but nginx listens on
# IPv4 (0.0.0.0:8080), so the IPv6 attempt is refused and the container reads as unhealthy.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null 2>&1 || exit 1
