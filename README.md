# Temperature Sensor API

A REST API for reading and managing a temperature sensor, built with **Node.js** and a **Hexagonal (Ports & Adapters) architecture**.

---

## Architecture

This project follows Hexagonal Architecture, which means the business logic is completely isolated from frameworks, databases, and external tools.
```
src/
  domain/          # Pure business logic — no dependencies
    entities/      # TemperatureReading, SensorState
    ports/         # ITemperatureSensor, ITemperatureRepository (contracts)
    usecases/      # GetTemperature, GetHistory, UpdateThresholds
  infrastructure/  # Implements the ports
    sensors/       # TemperatureSensor (simulates a real sensor)
    repositories/  # InMemoryTemperatureRepository
  adapters/        # Translates HTTP into use case calls
    http/
      controllers/ # TemperatureController
      routes/      # temperature.routes.js
      swagger.js   # OpenAPI spec
  app.js           # Express app factory
  server.js        # Entry point
tests/
  unit/            # Domain and infrastructure tests
  integration/     # HTTP endpoint tests
```

---

## Prerequisites

- Node.js v20+
- Docker (optional)

---

## Getting Started

### Local
```bash
npm install
npm run dev
```

> Once running, open **http://localhost:3000/api-docs** to access the interactive Swagger UI where you can explore and test all endpoints directly in your browser.

### Docker
```bash
docker-compose up
```

Then visit **http://localhost:3000/api-docs**.

---

## Running Tests
```bash
npm test
```

Runs all unit and integration tests with coverage report.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/temperature` | Get current temperature reading |
| GET | `/api/temperature/history` | Get last 15 temperature readings |
| PATCH | `/api/temperature/thresholds` | Update HOT/COLD thresholds |

### Interactive Docs
Visit **http://localhost:3000/api-docs** for the full Swagger UI.

---

## Example Requests

### Get current temperature
```bash
curl http://localhost:3000/api/temperature
```
```json
{
  "temperature": 27.43,
  "state": "WARM",
  "timestamp": "2024-03-08T14:32:00.000Z"
}
```

### Get history
```bash
curl http://localhost:3000/api/temperature/history
```

### Update thresholds
```bash
curl -X PATCH http://localhost:3000/api/temperature/thresholds \
  -H "Content-Type: application/json" \
  -d '{"hot": 40, "cold": 18}'
```
```json
{
  "hot": 40,
  "cold": 18
}
```

---

## Temperature States

| State | Condition |
|-------|-----------|
| 🔴 HOT | temperature ≥ 35°C (default) |
| 🟠 WARM | 22°C ≤ temperature < 35°C (default) |
| 🔵 COLD | temperature < 22°C (default) |

Thresholds are configurable at runtime via `PATCH /api/temperature/thresholds`.

> Note: threshold changes are stored in memory and reset on server restart.