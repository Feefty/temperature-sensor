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

A full-stack TypeScript app in an npm-workspaces monorepo: a hexagonal (ports and adapters)
REST API (`api/`) and a React dashboard (`web/`) that consumes it. They are independent
workspaces; the dashboard talks to the API over same-origin `/api/v1` (proxied by Vite in dev,
by nginx in production), so there is no CORS to configure.

## Quick start

```bash
npm install            # installs both workspaces
npm test               # api + web suites
npm run typecheck
npm run lint

# Run the whole stack (dashboard on :8080, api on :3000) and smoke-test it
docker compose up --build -d
npm run smoke
docker compose down

# Or run a workspace in dev
npm run dev                                       # api on http://localhost:3000 (ts-node)
npm run dev --workspace=@temperature-sensor/web   # dashboard on http://localhost:5173
```

## API

Base path: `/api/v1`.

```bash
# Read the current temperature and its state (also records it in the history)
curl http://localhost:3000/api/v1/temperature
# -> { "temperature": 24.3, "state": "WARM", "capturedAt": "2026-05-30T10:00:00.000Z" }

# Last 15 readings, newest first
curl http://localhost:3000/api/v1/temperature/history

# Read the current thresholds
curl http://localhost:3000/api/v1/thresholds
# -> { "coldMax": 22, "hotMin": 35 }

# Redefine the thresholds (coldMax exclusive, hotMin inclusive)
curl -X PUT http://localhost:3000/api/v1/thresholds \
  -H 'Content-Type: application/json' \
  -d '{ "coldMax": 22, "hotMin": 35 }'
```

| Status | When                                                                        |
| ------ | --------------------------------------------------------------------------- |
| `200`  | success                                                                     |
| `400`  | malformed body (invalid JSON, wrong type, missing field, non-finite number) |
| `413`  | request body larger than the 4kb limit                                      |
| `422`  | thresholds violate the `coldMax < hotMin` invariant                         |
| `404`  | unknown route                                                               |
| `500`  | unexpected failure (e.g. the sensor is unavailable)                         |

## Frontend

`web/` is a React 18 + TypeScript dashboard (Vite, CSS Modules) that shows the live reading on a
gauge, lists the recent history, and edits the cooling thresholds. nginx serves it as static
files and reverse-proxies `/api/v1` to the API, so the browser only ever talks to its own origin.

- The gauge zones come from the API's current thresholds (`GET /thresholds`), so the dial reflects
  the server rather than a client-side guess.
- The layout adapts by breakpoint, not just by restyling: the wide side-by-side grid collapses to a
  tabbed (segmented) view on narrow screens, rendered from one tree so resizing never remounts a
  widget or restarts polling.
- Accessibility: WAI-ARIA tabs with keyboard support, live regions for the overheating alert and
  failed refreshes, and a `jest-axe` check on every widget; both themes meet WCAG contrast.

Tests are `vitest` + Testing Library + `jest-axe` with MSW mocking the API, under the same coverage
gate as the API. `npm run smoke` (`scripts/smoke.mjs`) is an end-to-end check against the running
stack: it hits the web origin, so it covers the static serving and the API proxy together.

## Architecture

```
api/src/
  domain/          no external imports: pure rules and contracts
    value-objects/ Temperature (finite), Thresholds (coldMax < hotMin invariant)
    entities/      SensorState, TemperatureReading
    services/      resolveState (boundary classification)
    ports/         TemperatureSensor, ReadingRepository (driven ports)
    errors/        DomainError, ThresholdsInvariantError
  application/     use-cases: CaptureReading, GetHistory, GetThresholds, RedefineThresholds
  infrastructure/
    repositories/  InMemoryReadingRepository
    sensor/        RandomTemperatureSensor
    http/          controllers, routes, middleware, schemas
  main.ts          composition root

web/src/
  api/             typed client + data hooks (useLiveReading, useHistory, useThresholds, ...)
  components/      brand library (Button, Gauge, Segmented, StatusBadge, Card, ...)
  widgets/         LiveReading, HistoryTable, ThresholdSettings
  dashboard/       composes the widgets into the responsive layout
```

Dependency rule: `http -> application -> domain`; adapters implement `domain/ports`.
The domain has zero external imports. On the web side, widgets compose components and call the
API only through the `api/` client, so the data layer stays in one place.

## Key design decisions

A few choices worth calling out.

The state boundaries are the easy thing to get wrong: `HOT` is `temp >= hotMin`, `COLD` is
`temp < coldMax`, and everything between is `WARM`, so 22.0 reads WARM and 35.0 reads HOT. Both
edges have tests. Only the two boundary numbers are stored; WARM is derived. The `coldMax < hotMin`
invariant lives in `createThresholds`, so you can't build an invalid `Thresholds`, and redefining
the thresholds only changes future readings, never the history that was already recorded.

- `Temperature` is a branded type validated once at the edge, so `NaN`/`Infinity` never reach the
  domain.
- The repository port is a single async interface: history and thresholds always travel together,
  so splitting them would be false SRP, and `Promise` returns mean the in-memory store can later
  become a real one without touching the domain. That store is a plain array capped at 15 (a ring
  buffer would be overkill here).
- Validation is split between `zod` at the HTTP edge (`400`) and the domain invariant (`422`).
- The model assumes one sensor and one set of thresholds, as the brief describes. Supporting several
  sensors would add a `sensorId` to the reading and the repository keys, not rework the domain.

Dependencies are kept to two at runtime (`express`, `zod`): no `helmet`, `cors`, ORM or DI
container for an internal API. The dashboard is served same-origin (nginx proxies `/api`), so even
with a frontend there is still no CORS to configure.

## Testing

`jest` + `ts-jest` + `supertest`, with a coverage gate (branches 90, functions 95, lines 90).
Unit tests cover the domain and use-cases; integration tests drive the real HTTP app through
`supertest`, including the boundary values, the rolling 15-item window, the `422`/`400` split,
and the reclassification semantics.
