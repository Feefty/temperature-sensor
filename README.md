# Temperature Sensor API

NestJS API for capturing Celsius temperature readings, classifying them with configurable thresholds, and retaining the 15 most recent captures.

See [SPEC.md](SPEC.md) for the product brief and design assumptions.

## Development Approach

I first reviewed the original brief and expanded it into [SPEC.md](SPEC.md), making the expected behavior, initial implementation direction, assumptions, and points requiring attention explicit. I then used that specification to create [PLAN.md](PLAN.md), a detailed commit-by-commit implementation plan.

Codex was used to accelerate the implementation work one plan step at a time. After each step, I reviewed the code and tests, questioned design choices, and requested adjustments before committing. In this workflow, AI handled much of the mechanical coding, while I owned the specification, architecture decisions, orchestration, and final validation. This kept AI assistance fast but controlled and reviewable.

## Run and Validate

### Requirements

- Node.js 22
- Yarn 1.22.22
- Docker with Compose, for the containerized workflow

### Local Development

```bash
nvm use
corepack enable
yarn install --frozen-lockfile
```

Start the API in development mode:

```bash
yarn start:dev
```

The API listens on `http://localhost:3000` by default. Set the `PORT` environment variable when starting it to use a different port:

```bash
PORT=3001 yarn start:dev
```

The API will then listen on `http://localhost:3001`.

### Sensor Configuration

No physical sensor integration is provided by the exercise. The included `TemperatureSensor` component simulates the external dependency, while its adapter exposes it through the application port:

- Set `TEMPERATURE_SENSOR_FIXED_VALUE` to return a deterministic Celsius value.
- Leave it unset to generate a value between `-10` and `45` degrees Celsius.
- Invalid configured values cause an explicit runtime error.

Example:

```bash
TEMPERATURE_SENSOR_FIXED_VALUE=30 yarn start:dev
```

The sensor is behind an application port, so a real hardware or service adapter can replace it without changing the domain or use cases.

### Tests

```bash
yarn test
yarn test:e2e
```

The test suite covers domain rules, functional use cases, infrastructure adapters, HTTP validation, and complete API workflows.

### Build

Compile the TypeScript application and generate the production-ready output in `dist`:

```bash
yarn build
```

### Production Build with Docker

Build and run the production container:

```bash
docker compose up --build
```

Compose exposes port `3000` and uses a deterministic sensor value of `21.5` by default. Both settings are configurable:

```bash
HOST_PORT=3001 TEMPERATURE_SENSOR_FIXED_VALUE=30 docker compose up --build
```

Stop the service with:

```bash
docker compose down
```

### CI

GitHub Actions runs on pull requests and pushes to `develop`. It installs from the committed lockfile, builds first, then runs the regular and end-to-end test suites.

## API Usage

Default thresholds are `22` for COLD and `35` for HOT. WARM is the range from the cold threshold, inclusive, to the hot threshold, exclusive. Thresholds must remain at least two degrees apart.

### Capture a Temperature

Capture and store the current temperature:

```bash
curl -X POST http://localhost:3000/temperature-requests
```

Example response:

```json
{
  "id": "2c378362-bbd3-4cb2-99d0-733e05fce617",
  "temperature": 30,
  "state": "WARM",
  "thresholds": {
    "coldThreshold": 22,
    "hotThreshold": 35
  },
  "capturedAt": "2026-06-13T10:00:00.000Z"
}
```

### Read Temperature History

Read the latest 15 captures, newest first:

```bash
curl http://localhost:3000/temperature-requests
```

Example response:

```json
{
  "items": [
    {
      "id": "2c378362-bbd3-4cb2-99d0-733e05fce617",
      "temperature": 30,
      "state": "WARM",
      "thresholds": {
        "coldThreshold": 22,
        "hotThreshold": 35
      },
      "capturedAt": "2026-06-13T10:00:00.000Z"
    }
  ],
  "count": 1,
  "maxSize": 15
}
```

### Read Thresholds

Read the active thresholds:

```bash
curl http://localhost:3000/thresholds
```

Example response:

```json
{
  "coldThreshold": 22,
  "hotThreshold": 35
}
```

### Update Thresholds

Partially update the thresholds:

```bash
curl -X PATCH http://localhost:3000/thresholds \
  -H 'Content-Type: application/json' \
  -d '{"hotThreshold":32}'
```

Example response:

```json
{
  "coldThreshold": 22,
  "hotThreshold": 32
}
```

Each history entry stores the thresholds used when it was captured. Updating the active configuration does not rewrite previous classifications.

## Design

### Architecture

The project follows a small hexagonal architecture:

```text
HTTP controllers -> application facade -> functional use cases -> domain
                                              |
                                              v
                                      outbound port interfaces
                                              ^
                                              |
                                  infrastructure adapters
```

- `domain/` contains threshold validation and temperature classification.
- `application/use-cases/` contains pure orchestration functions.
- `application/ports/` defines required sensor, persistence, clock, and ID contracts.
- `infrastructure/` implements those outbound ports.
- `interface/http/` translates HTTP requests and responses.
- `temperature.module.ts` is the NestJS composition root.

Persistence is intentionally in memory. Restarting the process resets both history and active thresholds.

### Possible Improvements

Given the roughly three hours I dedicated to this exercise, I kept the implementation focused on the core requirements. With more time, I would consider the following improvements:

- Add a small web interface for capturing readings, viewing history, and updating thresholds without calling the API directly.
- Add durable database persistence so history and threshold configuration survive restarts and can support multiple application instances.
- Publish an OpenAPI/Swagger specification with interactive endpoint documentation.
- Make the service easier to operate by adding logs, basic performance monitoring, and early checks for invalid configuration.
