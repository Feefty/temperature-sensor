# Kata

## **Objectives**

- Demonstrate what you can do within a reasonable time and show how you code in real-life situations.
- This project should soon go into production regarding the quality of the code.
- The API must adhere to a Hexagonal or Clean Code architecture and must include tests.

## **Delivery**

- Fork this repo and create a PR on the `develop` branch so that we can provide feedback.

## **Application**

For this project, we need an API that:

1. Retrieves the temperature from a `TemperatureSensor` component (returns the temperature in degrees Celsius).
2. Sets the state of the Sensor to “HOT” when the captured temperature is greater than or equal to 35°C.
3. Sets the state of the Sensor to “COLD” when the captured temperature is less than 22°C.
4. Sets the state of the Sensor to “WARM” when the captured temperature is greater than or equal to 22°C and less than 35°C.
5. Retrieves the history of the last fifteen temperature requests.
6. Allows redefining the thresholds for “HOT”, “COLD”, and “WARM”.

## **Minimal Stack**

- Node.js
- Docker
- Jest

## How the API behaves (the “happy path”)

When you call the API, it reads a temperature from a `TemperatureSensor` (simulated in this repo), then:

- **classifies** it into `COLD | WARM | HOT` using the active thresholds
- **persists** one row in `temperature_history` (including a snapshot of the thresholds used)
- **returns** the value + state + timestamp

Default thresholds (seeded by the migration):

- **COLD** when `celsius < 22`
- **HOT** when `celsius >= 35`
- **WARM** otherwise

History:

- `GET /api/v1/temperature/history` returns **the last 15 requests** (oldest first).

## **How to start the project**

1. **Prerequisites**
  - Node.js **20+**  
  - **Docker** (for MySQL, or use your own MySQL 8 instance)
2. **Install dependencies**
  ```bash
   npm install
  ```
3. **Database**
  - Start MySQL (example with Docker Compose from the repo root):
  - Copy env templates if needed: the app loads `.env` then, for local development (`NODE_ENV=development`), `.env.docker` (values aligned with Docker Compose MySQL). Other modes load `.env.${NODE_ENV}` (e.g. `.env.test`). Adjust `DATABASE_`* as needed.
  - **E2E** uses MySQL database `test` and the credentials from `.env.test` (see `.env.test` and `docker/mysql/init/`). The init SQL runs on the **first** MySQL volume only — recreate with `docker compose down -v` then `docker compose up -d mysql` if needed.
4. **Run migrations** (creates tables and seeds default thresholds)
  ```bash
   npm run migration:run
  ```
5. **Run the API (development)**
  - With `NODE_ENV=development` (loads `.env` then `.env.docker`):
  - **Production build** (after `npm run build`):
    ```bash
    npm run start:prod
    ```
6. **Full stack in Docker** (MySQL + API)
  ```bash
   docker compose up --build
  ```

Docker notes:

- The `api` service loads `./.env.docker` via `env_file`, then Compose overrides `DATABASE_HOST=mysql` so the API can reach the `mysql` service on the Docker network.
- The API waits for MySQL to become **healthy** before starting (`depends_on: condition: service_healthy`).

7. **Useful URLs** (defaults depend on `SERVICE_`* in your env)
  - REST base path: `/api/v1` (e.g. `/api/v1/temperature/current`)  
  - Swagger UI: `/docs` (not under the global API prefix)

## Environment variables: priority & profiles

### Running with Docker Compose

Compose injects variables into the `api` container using:

- `env_file: ./.env.docker` (base values)
- `environment:` (overrides; currently `DATABASE_HOST=mysql`)

Priority inside the container:

- **compose `environment` overrides `env_file`**

### Running the Node project directly (no Docker)

Nest loads env files through `ConfigModule.forRoot({ envFilePath: getEnvFilePaths() })`.
The file resolution is based on `NODE_ENV`:

- `NODE_ENV=docker` or `NODE_ENV=development` → `.env.docker` then `.env`
- `NODE_ENV=test` → `.env.test` then `.env`
- `NODE_ENV=production` → `.env.production` then `.env`

If a required variable is missing, configuration validation fails fast at startup.

## Production configuration

For real production deployments, prefer injecting env vars via your runtime (Kubernetes/Docker/CI/secret manager).

If you want a local “production-like” run from the Node project, create a `.env.production` file (same keys as `.env.example`) and run:

```bash
set NODE_ENV=production&& npm run start:prod
```

## Migrations (TypeORM)

- **Local/dev (TypeScript datasource)**: `npm run migration:run`

## API endpoints (with payloads)

Base path is usually `/api/v1`. Examples below assume the API runs on `http://localhost:3000`.

### 1) Read current temperature

`GET /api/v1/temperature/current`

Example:

```bash
curl http://localhost:3000/api/v1/temperature/current
```

Response:

```json
{
  "celsius": 23.4,
  "state": "WARM",
  "capturedAt": "2026-04-23T19:18:19.525Z"
}
```

### 2) Get last 15 readings (history)

`GET /api/v1/temperature/history`

Example:

```bash
curl http://localhost:3000/api/v1/temperature/history
```

Response (array, oldest first):

```json
[
  {
    "celsius": 21.8,
    "state": "COLD",
    "capturedAt": "2026-04-23T19:15:01.120Z",
    "snapshotColdBelow": 22,
    "snapshotHotFrom": 35
  }
]
```

### 3) Read current thresholds

`GET /api/v1/temperature/thresholds`

Example:

```bash
curl http://localhost:3000/api/v1/temperature/thresholds
```

Response:

```json
{
  "coldBelowCelsius": 22,
  "hotFromCelsius": 35
}
```

### 4) Update thresholds

`PUT /api/v1/temperature/thresholds`

Body:

```json
{
  "coldBelowCelsius": 20,
  "hotFromCelsius": 32
}
```

Example:

```bash
curl -X PUT http://localhost:3000/api/v1/temperature/thresholds \
  -H "Content-Type: application/json" \
  -d "{\"coldBelowCelsius\":20,\"hotFromCelsius\":32}"
```

Response (the persisted thresholds):

```json
{
  "coldBelowCelsius": 20,
  "hotFromCelsius": 32
}
```

Validation rules:

- `coldBelowCelsius` must be **strictly less** than `hotFromCelsius`
- unknown properties are rejected (strict DTO validation)

## Notes for local development

Optional env vars for the simulated sensor range (defaults shown):

- `SENSOR_SIMULATED_MIN_CELSIUS=15`
- `SENSOR_SIMULATED_MAX_CELSIUS=40`

## Reference

- [Git Commit Messages: Best Practices & Guidelines](https://initialcommit.com/blog/git-commit-messages-best-practices)
