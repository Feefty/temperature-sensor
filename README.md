# Temperature Sensor API

A small HTTP API that reads a temperature sensor, classifies the reading as
`HOT` / `WARM` / `COLD`, keeps a rolling history of the last requests, and lets
the classification thresholds be redefined at runtime.

Built with TypeScript and Express following a strict hexagonal (ports &
adapters) architecture.

## Requirements covered

| #   | Requirement                                          | Where                                                      |
| --- | ---------------------------------------------------- | ---------------------------------------------------------- |
| 1   | Read the temperature (°C) from a `TemperatureSensor` | `TemperatureSensor` port + `RandomTemperatureSensor`       |
| 2   | `HOT` when temperature ≥ 35                          | `classifyTemperature`                                      |
| 3   | `COLD` when temperature < 22                         | `classifyTemperature`                                      |
| 4   | `WARM` when 22 ≤ temperature < 35                    | `classifyTemperature`                                      |
| 5   | History of the last 15 requests                      | `TemperatureHistoryRepository` (sliding window, capped 15) |
| 6   | Redefine the thresholds at runtime                   | `PUT /thresholds` → `UpdateThresholds`                     |

## Architecture

The dependency rule points inward: `domain` depends on nothing, `application`
depends only on `domain`, and `infrastructure` depends on both. Concrete
adapters are bound to ports in a single composition root (`src/main.ts`).

```
src/
  domain/                     # pure business logic, no framework/infra imports
    temperature/              # Celsius, TemperatureState, Thresholds (VO), classifyTemperature
    history/                  # TemperatureReading
    ports/                    # TemperatureSensor, TemperatureHistoryRepository, ThresholdsRepository
    time/                     # Clock
    errors/                   # DomainError, InvalidThresholdsError
  application/                # use cases: ReadTemperature, GetTemperatureHistory, UpdateThresholds
  infrastructure/
    sensor/                   # RandomTemperatureSensor (concrete sensor)
    persistence/              # in-memory repositories
    http/                     # Express adapter: app factory, routes, error handler
  main.ts                     # composition root: wires adapters to ports, starts the server
tests/                        # mirrors src/, plus tests/fakes for test doubles
```

Key decisions:

- **Classification is a pure function** taking `Thresholds` as a parameter — no
  globals, no magic numbers. The `22` / `35` defaults live only in
  `Thresholds.default()`; the `15` history cap lives only in the composition root.
- **`Thresholds` is a validated value object** (`cold < hot`, finite), so an
  instance is always valid by existence.
- **Runtime thresholds are modeled as a port** (`ThresholdsRepository`), keeping
  the mutable configuration out of the domain and symmetric with history storage.
- **The clock is injected** (`Clock = () => Date`) so use cases are deterministic
  under test.
- **The sensor is a port** with a fake for tests; the real adapter simulates
  hardware with a uniform random reading.

## API

| Method | Path                   | Body            | Success               | Errors                          |
| ------ | ---------------------- | --------------- | --------------------- | ------------------------------- |
| GET    | `/temperature`         | —               | `200` reading         | `500` on sensor failure         |
| GET    | `/temperature/history` | —               | `200` `{ readings }`  | —                               |
| PUT    | `/thresholds`          | `{ cold, hot }` | `200` `{ cold, hot }` | `400` malformed or `cold ≥ hot` |

A reading is `{ "celsius": number, "state": "HOT" | "WARM" | "COLD", "recordedAt": ISO8601 }`.

```bash
curl localhost:3000/temperature
curl localhost:3000/temperature/history
curl -X PUT localhost:3000/thresholds -H 'Content-Type: application/json' -d '{"cold":10,"hot":40}'
```

## Running locally

Requires Node.js 20+.

```bash
npm install
npm run dev          # start with ts-node (http://localhost:3000)
# or run the compiled build:
npm run build && npm start
```

The port is configurable via `PORT` (defaults to `3000`).

## Testing & formatting

```bash
npm test             # unit + HTTP integration tests (Jest)
npm run format       # apply Prettier
```

The domain and application layers are tested in isolation through fakes and the
in-memory adapters; a few supertest integration tests cover the HTTP endpoints,
including the 15-item sliding window and runtime threshold reconfiguration.

## Docker

```bash
docker build -t temperature-sensor .
docker run --rm -p 3000:3000 temperature-sensor
```

The image is multi-stage: TypeScript is compiled in a build stage, and only the
compiled output plus production dependencies ship in the runtime stage, which
runs as a non-root user.

## Notes & trade-offs

- Persistence is in-memory by design (the kata scope); history and thresholds
  reset on restart. The repository ports make swapping in a real store a
  matter of adding an adapter, with no change to the domain or use cases.
- The sensor reading is simulated with a uniform random value in a configured
  range, since no physical sensor is available.
