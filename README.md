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
4. Sets the state of the Sensor to “WARM” when the captured temperature is greather than or equal to 22°C and less than 35°C.
5. Retrieves the history of the last fifteen temperature requests.
6. Allows redefining the thresholds for “HOT”, “COLD”, and “WARM”.


## **Minimal Stack**

- Node.js
- Docker
- Jest

## Reference
- [Git Commit Messages: Best Practices & Guidelines](https://initialcommit.com/blog/git-commit-messages-best-practices)

---

# Solution

A TypeScript REST API built with a hexagonal (ports and adapters) architecture, in an
npm-workspaces monorepo so a frontend can be added later without touching the API.

## Quick start

```bash
npm install          # installs the api workspace
npm test             # run the test suite
npm run test:coverage
npm run dev          # start the API on http://localhost:3000 (ts-node)

# or with Docker
docker compose up --build
```

## API

Base path: `/api/v1`.

```bash
# Read the current temperature and its state (also records it in the history)
curl http://localhost:3000/api/v1/temperature
# -> { "temperature": 24.3, "state": "WARM", "capturedAt": "2026-05-30T10:00:00.000Z" }

# Last 15 readings, newest first
curl http://localhost:3000/api/v1/temperature/history

# Redefine the thresholds (coldMax exclusive, hotMin inclusive)
curl -X PUT http://localhost:3000/api/v1/thresholds \
  -H 'Content-Type: application/json' \
  -d '{ "coldMax": 22, "hotMin": 35 }'
```

| Status | When |
|--------|------|
| `200` | success |
| `400` | malformed body (wrong type, missing field, non-finite number) |
| `422` | thresholds violate the `coldMax < hotMin` invariant |
| `404` | unknown route |
| `500` | unexpected failure (e.g. the sensor is unavailable) |

## Architecture

```
api/src/
  domain/          no external imports: pure rules and contracts
    value-objects/ Temperature (finite), Thresholds (coldMax < hotMin invariant)
    entities/      SensorState, TemperatureReading
    services/      resolveState (boundary classification)
    ports/         TemperatureSensor, ReadingRepository (driven ports)
    errors/        DomainError, ThresholdsInvariantError
  application/     use-cases: CaptureReading, GetHistory, RedefineThresholds
  infrastructure/  adapters: InMemoryReadingRepository, RandomTemperatureSensor, http/
  main.ts          composition root
```

Dependency rule: `http -> application -> domain`; adapters implement `domain/ports`.
The domain has zero external imports.

## Key design decisions

- **Boundaries: HOT inclusive, COLD exclusive.** `temp >= hotMin` is HOT, `temp < coldMax` is
  COLD, the rest is WARM, so 22.0 is WARM and 35.0 is HOT. Tested at the boundaries.
- **WARM is computed, not stored.** Only `coldMax` and `hotMin` are kept; the `coldMax < hotMin`
  invariant lives in `createThresholds`, so an invalid Thresholds cannot exist.
- **Redefining thresholds affects future readings only.** State is fixed at capture time, history
  is never rewritten (there is a test for that).
- **`Temperature` is a branded type**, so the finite-number check at the boundary keeps `NaN` and
  `Infinity` out of the domain.
- **One async `ReadingRepository` port.** History and thresholds are always used together, so two
  ports would be false SRP. Async keeps the contract intact when the in-memory adapter is later
  swapped for a real store.
- **History uses `push`/`shift` capped at 15**, not a ring buffer, which would be premature
  optimisation for 15 items.
- **Validation is split:** `zod` checks the request shape (400), the domain enforces the business
  invariant (422).
- **Two runtime dependencies** (`express`, `zod`). No `helmet`, `cors`, ORM or DI container for an
  internal API on a minimal stack; `cors` will arrive with the frontend.

## Testing

`jest` + `ts-jest` + `supertest`, with a coverage gate (branches 90, functions 95, lines 90).
Unit tests cover the domain and use-cases; integration tests drive the real HTTP app through
`supertest`, including the boundary values, the rolling 15-item window, the `422`/`400` split,
and the reclassification semantics.

