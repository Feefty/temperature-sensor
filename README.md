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
  infrastructure/  adapters: InMemoryReadingRepository, StubTemperatureSensor, http/
  main.ts          composition root
```

Dependency rule: `http -> application -> domain`; adapters implement `domain/ports`.
The domain has zero external imports.

## Key design decisions

- **Boundary inclusivity.** `HOT` is `temp >= hotMin`, `COLD` is `temp < coldMax`, `WARM`
  is the rest. So `22.0` is WARM and `35.0` is HOT. This is the spec's subtlest point and
  is verified in both unit and integration tests.
- **`WARM` is derived.** Only `coldMax` and `hotMin` are stored; `WARM` is the band between
  them. Redefining thresholds is therefore two numbers plus one invariant (`coldMax < hotMin`),
  enforced in a single factory (`createThresholds`) so an invalid state cannot be constructed.
- **Reclassification applies to the future only.** A reading is classified with the thresholds
  active at capture time; redefining thresholds never rewrites past history. This is covered by
  a dedicated test.
- **`Temperature` is a branded type.** A finite-number check happens once, at the boundary, so
  `NaN`/`Infinity` cannot reach the rest of the domain.
- **One `ReadingRepository` port.** History and thresholds are read together, so splitting them
  into two ports would be false SRP. The port is async because the spec asks for hexagonal and
  "soon to production": swapping the in-memory adapter for a real datastore must not change the
  domain.
- **History is a bounded list.** `push` + `shift` capped at 15. For a fixed 15-item window a
  ring buffer would be premature optimisation, so simplicity wins.
- **Validation split.** `zod` validates request shape at the HTTP boundary (`400`); the business
  invariant lives in the domain (`422`).
- **Two runtime dependencies** (`express`, `zod`). `helmet`, `cors`, `rate-limit`, a DI
  container, an ORM, and metrics were deliberately left out: this is an internal API with a
  minimal stack. `cors` will be added when the frontend lands.

## Testing

`jest` + `ts-jest` + `supertest`, with a coverage gate (branches 90, functions 95, lines 90).
Unit tests cover the domain and use-cases; integration tests drive the real HTTP app through
`supertest`, including the boundary values, the rolling 15-item window, the `422`/`400` split,
and the reclassification semantics.

