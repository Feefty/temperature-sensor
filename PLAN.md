# NestJS Temperature Sensor API Implementation Plan

## Summary

Build a NestJS API from the current brief using hexagonal architecture and a test-first workflow. The implementation should be split into small, reviewable commits. Each commit should introduce one architectural layer or one vertical behavior slice, with tests added before or alongside the production code.

The API will expose:

- `POST /temperature-requests`: capture current temperature, classify it, store immutable history entry, return captured result.
- `GET /temperature-requests`: return the last 15 captured temperature requests, newest first.
- `PATCH /thresholds`: partially update threshold config, merge with current config, validate final config.
- `GET /thresholds`: return active threshold config.

Default thresholds:

```ts
{
  coldThreshold: 22,
  hotThreshold: 35
}
```

Validation rule:

```ts
hotThreshold - coldThreshold >= 2;
```

History entries keep the thresholds used at capture time, so later threshold updates do not rewrite or reinterpret old records.

Commit messages should use the conventional `type: subject` format, for example `feat: add temperature classification domain`. This keeps the history familiar and easy to scan while still following the linked Initial Commit guide's core principles: concise subjects, imperative mood, small commits, and optional bodies only when the motivation is not obvious. The only intentional difference from the guide is casing, because the lowercase conventional style is widely used in TypeScript/NestJS projects.

## Hexagonal Architecture Structure

Mental model:

```txt
Controller = how the outside world talks to us
Use case = what the app does
Domain = business rules at the core of the project
Infrastructure = external details: sensor, storage, clock, IDs
```

Use this project structure:

```txt
src/
  main.ts
  app.module.ts

  temperature/
    domain/
      temperature-state.ts
      thresholds.ts
      temperature-classifier.ts

    application/
      models/
        temperature-reading.ts
      ports/
        temperature-sensor.port.ts
        temperature-history.repository.ts
        thresholds.repository.ts
        clock.port.ts
        id-generator.port.ts
      use-cases/
        capture-current-temperature.use-case.ts
        get-temperature-history.use-case.ts
        get-thresholds.use-case.ts
        update-thresholds.use-case.ts

    infrastructure/
      sensors/
        configurable-temperature-sensor.adapter.ts
      persistence/
        in-memory-temperature-history.repository.ts
        in-memory-thresholds.repository.ts
      system/
        system-clock.adapter.ts
        uuid-id-generator.adapter.ts

    interface/
      http/
        temperature.controller.ts
        thresholds.controller.ts
        dto/
          update-thresholds.dto.ts
          temperature-response.dto.ts
          thresholds-response.dto.ts

    temperature-application.service.ts
    temperature.tokens.ts
    temperature.module.ts
```

How this maps to hexagonal architecture:

- `domain/` is the center of the hexagon. It knows nothing about NestJS, HTTP, databases, environment variables, or sensors. It contains pure business rules: thresholds, states, and classification.
- `application/` contains use cases. These coordinate work: read from the sensor, classify the value, save history, update thresholds. They depend only on ports, not concrete implementations.
- `application/ports/` defines interfaces the use cases need, such as `TemperatureSensorPort` and `TemperatureHistoryRepository`. These are the edges of the core.
- `infrastructure/` contains adapters that satisfy those ports. For this exercise, they will be in-memory repositories plus a configurable fake sensor.
- `interface/http/` contains NestJS controllers and DTOs. This layer translates HTTP requests into use case calls and use case results into API responses.
- `temperature-application.service.ts` is a thin Nest facade that binds outbound ports and delegates to pure use-case functions. It contains no business rules.
- `temperature.tokens.ts` contains runtime identifiers only for outbound TypeScript interfaces, which Nest cannot inject by type.
- `temperature.module.ts` wires ports to adapters using Nest providers. This is where NestJS dependency injection belongs.

Port organization reminder:

```txt
application/
  use-cases/       # inbound ports and their functional implementations together
  ports/outbound/  # contracts required from external systems
```

For this small project, `application/ports/` is kept one level flatter than `application/ports/outbound/`. All ports in that folder are outbound ports. The use-case function signatures are the inbound contracts, so separate inbound port interfaces would add structure without adding useful separation here.

Dependency direction must always point inward:

```txt
HTTP controller -> use-case function -> domain function
                     |
                     -> port interface
                          ^
                          |
                    infrastructure adapter
```

The domain must never import from `@nestjs/*`.

## Commit Plan

### Commit 1: Bootstrap NestJS project skeleton

Suggested commit message:

```txt
chore: bootstrap nestjs project
```

Goal:

- Create the runnable NestJS baseline before adding business behavior.
- Keep this commit mostly framework and tooling setup.

Implementation:

- Add `.nvmrc` with Node.js `22`, the active LTS line to use for this project.
- Add `package.json`, `yarn.lock`, `tsconfig.json`, `tsconfig.build.json`, `nest-cli.json`, Jest config, and basic Yarn scripts. Add necessary entries to `.gitignore`.
- Add `src/main.ts` and `src/app.module.ts`.
- Enable global `ValidationPipe` in `main.ts` using Nest default validation error behavior.
- Add a basic health-neutral app setup only if needed by Nest defaults; do not add temperature behavior yet.

Tests:

- Add a minimal app smoke test if the generated Nest setup includes one.
- Verify:
  - `yarn test`
  - `yarn build`

Stop point:

- The project installs, builds, and runs as an empty NestJS API.

### Commit 2: Add domain model and classifier tests first

Suggested commit message:

```txt
feat: add temperature classification domain
```

Goal:

- Implement the core business rules without involving NestJS, HTTP, repositories, or sensors.

Test-first steps:

- Add tests for the `classifyTemperature` and `createThresholds` functions before implementing them.
- Cover:
  - below `coldThreshold` => `COLD`
  - equal to `coldThreshold` => `WARM`
  - between thresholds => `WARM`
  - equal to `hotThreshold` => `HOT`
  - above `hotThreshold` => `HOT`
  - invalid non-finite thresholds are rejected
  - `coldThreshold >= hotThreshold` is rejected
  - `hotThreshold - coldThreshold < 2` is rejected

Implementation:

- Add `src/temperature/domain/temperature-state.ts`.
- Add `src/temperature/domain/thresholds.ts`.
- Add `src/temperature/domain/temperature-classifier.ts`.
- Keep these files framework-free: no Nest decorators, no `@nestjs/*` imports.
- Implement domain behavior as pure functions because it has no state or external dependencies.

Stop point:

- Domain tests pass independently.
- The business rules can be understood without reading any HTTP or infrastructure code.

### Commit 3: Add application ports and use case tests

Suggested commit message:

```txt
feat: define temperature use cases
```

Goal:

- Define the application workflows around the domain.
- Introduce ports for external dependencies before writing adapters.

Test-first steps:

- Add use case tests with hand-written fakes or Jest mocks for ports.
- Test `captureCurrentTemperature`:
  - reads the sensor through `TemperatureSensorPort`
  - reads thresholds through `ThresholdsRepository`
  - classifies using current thresholds
  - stores a history entry
  - returns `id`, `temperature`, `state`, `thresholds`, and ISO-compatible `capturedAt`
  - stores threshold snapshots so old entries remain explainable after thresholds change
- Test `getTemperatureHistory`:
  - returns newest entries first
  - returns only the latest 15
  - returns `{ items, count, maxSize: 15 }`
- Test `updateThresholds`:
  - accepts only `hotThreshold`
  - accepts only `coldThreshold`
  - accepts both thresholds
  - rejects empty update input
  - rejects merged thresholds with range below `2`
  - does not mutate history
- Test `getThresholds`:
  - returns default/current thresholds from the repository

Implementation:

- Add `src/temperature/application/models/temperature-reading.ts` once the use-case tests establish its required shape.
  - Include `id`, `temperature`, `state`, `thresholds`, and `capturedAt`.
  - Keep the model immutable and preserve the thresholds used at capture time.
- Add application ports:
  - `TemperatureSensorPort`
  - `TemperatureHistoryRepository`
  - `ThresholdsRepository`
  - `ClockPort`
  - `IdGeneratorPort`
- Add use cases:
  - `captureCurrentTemperature`
  - `getTemperatureHistory`
  - `updateThresholds`
  - `getThresholds`
- Implement each use case as a function that receives an explicitly typed dependency object and its input.
- Keep dependency objects immutable and pass only the ports each function needs.
- Do not import NestJS in use case files.

Stop point:

- Application tests pass with fake dependencies.
- No HTTP controller is needed yet to prove the workflows.

### Commit 4: Add in-memory infrastructure adapters

Suggested commit message:

```txt
feat: add in-memory temperature adapters
```

Goal:

- Provide concrete implementations for the application ports.
- Keep adapters replaceable, so the core does not care whether persistence is memory, database, or another system.

Implementation:

- Add `InMemoryThresholdsRepository`.
  - Initial state is `{ coldThreshold: 22, hotThreshold: 35 }`.
  - Stores and returns the active threshold config.
- Add `InMemoryTemperatureHistoryRepository`.
  - Saves captured entries.
  - Returns latest 15 entries newest first.
- Add `ConfigurableTemperatureSensorAdapter`.
  - If `TEMPERATURE_SENSOR_FIXED_VALUE` is set, return that numeric value.
  - Otherwise return a random Celsius value in a reasonable range, for example `-10` to `45`.
  - Throw a clear startup/runtime error if the fixed value env var exists but is not numeric.
- Add `SystemClockAdapter`.
  - Returns `new Date()`.
- Add `UuidIdGeneratorAdapter`.
  - Uses `crypto.randomUUID()`.

Tests:

- Add focused adapter tests where behavior is not trivial:
  - in-memory history returns latest 15 newest first
  - thresholds repository starts with defaults and saves updates
  - configurable sensor respects fixed env value
  - configurable sensor rejects invalid fixed env value

Stop point:

- Ports now have concrete adapters, but the HTTP API still does not exist.

### Commit 5: Wire Nest module and HTTP controllers

Suggested commit message:

```txt
feat: expose temperature http api
```

Goal:

- Add the HTTP interface as an adapter on top of existing use cases.
- Keep controllers thin.

Implementation:

- Add `src/temperature/temperature.module.ts`.
- Add an injectable application facade that binds outbound ports and delegates to the functional use cases.
- Inject the facade directly into controllers; reserve provider tokens for outbound port interfaces that do not exist at runtime.
- Register adapter implementations for each application port.
- Add provider tokens for interfaces, because TypeScript interfaces do not exist at runtime.
- Import `TemperatureModule` from `AppModule`.
- Add `TemperatureController`:
  - `POST /temperature-requests`
  - `GET /temperature-requests`
- Add `ThresholdsController`:
  - `GET /thresholds`
  - `PATCH /thresholds`
- Add DTOs:
  - `UpdateThresholdsDto`
  - response DTO/type files if useful for clarity
- Use `class-validator` for simple DTO validation:
  - optional numeric fields for `coldThreshold` and `hotThreshold`
  - empty-body and cross-field validation remain in the use case/domain layer
- Convert dates to ISO strings at the interface boundary if the application returns `Date`.

Tests:

- Add controller or HTTP integration tests with Nest testing utilities.
- Cover:
  - `POST /temperature-requests` returns `201` and the expected response shape
  - `GET /temperature-requests` returns `{ items, count, maxSize }`
  - `GET /thresholds` returns active thresholds
  - `PATCH /thresholds` accepts partial body and returns merged config
  - `PATCH /thresholds` returns `400` for empty body
  - `PATCH /thresholds` returns `400` for invalid numeric input
  - `PATCH /thresholds` returns `400` for invalid merged threshold range

Stop point:

- The API works locally through HTTP.
- Controllers are only translation code; orchestration remains in use cases.

### Commit 6: Add end-to-end behavior coverage

Suggested commit message:

```txt
test: cover temperature api end to end
```

Goal:

- Prove that the wired Nest app behaves correctly across HTTP, use cases, domain, and in-memory adapters.

Implementation:

- Add e2e tests with `supertest`.
- Override the sensor adapter in the test module to return deterministic temperatures.
- Use the real in-memory repositories unless test isolation requires fresh module instances per test.

Tests:

- Start with default thresholds.
- Capture a deterministic temperature and verify classification.
- Patch thresholds.
- Capture another deterministic temperature and verify the new classification uses updated thresholds.
- Confirm old history entry still contains the old threshold snapshot.
- Confirm history excludes threshold update events.
- Confirm history response is newest first and limited to 15.

Stop point:

- The full user-facing behavior from the brief is covered by e2e tests.

### Commit 7: Add Docker runtime

Suggested commit message:

```txt
chore: add docker runtime
```

Goal:

- Make the project runnable in Docker as requested by the brief.

Implementation:

- Add `Dockerfile`.
- Add `.dockerignore`.
- Add `docker-compose.yml` exposing port `3000`.
- Ensure container command runs the compiled Nest app, for example `yarn start:prod`.
- Support `TEMPERATURE_SENSOR_FIXED_VALUE` in Docker Compose for easy manual testing.

Tests/checks:

- Verify local build still passes:
  - `yarn test`
  - `yarn build`
- Verify Docker build:
  - `docker compose build`
- Verify Docker run:
  - `docker compose up`
  - call `GET /thresholds`
  - call `POST /temperature-requests`

Stop point:

- A reviewer can run the service without local Node setup.

### Commit 8: Add pull request CI

Suggested commit message:

```txt
ci: run checks on pull requests
```

Goal:

- Add a minimal CI pipeline so every opened or updated PR runs the project checks automatically.
- Keep the pipeline small and aligned with the local verification commands.

Implementation:

- Add `.github/workflows/ci.yml`.
- Trigger the workflow on:
  - `pull_request`
  - optionally `push` to the main development branch if the repo uses one, for example `develop`
- Use Node.js `22`, matching `.nvmrc`.
- Enable Yarn through Corepack if using modern Yarn, or install dependencies with the project's committed Yarn lockfile.
- Cache Yarn dependencies using the standard GitHub Actions Node cache.
- Run:
  - `yarn install --frozen-lockfile`
  - `yarn test`
  - `yarn build`
  - `yarn test:e2e` if e2e tests are stable in CI without Docker

Stop point:

- Opening a PR runs the same checks reviewers would otherwise run manually.

### Commit 9: Polish documentation and final verification

Suggested commit message:

```txt
docs: document api usage and architecture
```

Goal:

- Make the project easy to review and operate.

Implementation:

- Update `README.md` with:
  - install commands
  - test commands
  - local run commands
  - Docker run commands
  - CI behavior
  - endpoint examples
  - a short explanation of the architecture
- Mention that persistence is in memory.
- Mention that the production sensor adapter is configurable/fake until a real sensor exists.
- Keep `SPEC.md` as the product brief; do not overload it with run instructions.

Final verification:

- `yarn test`
- `yarn build`
- `yarn test:e2e`
- `docker compose build`
- CI workflow passes on a PR

Stop point:

- The repo is ready for PR review.

## Public API Contract

`POST /temperature-requests` response:

```ts
{
  id: string;
  temperature: number;
  state: "COLD" | "WARM" | "HOT";
  thresholds: {
    coldThreshold: number;
    hotThreshold: number;
  }
  capturedAt: string;
}
```

`GET /temperature-requests` response:

```ts
{
  items: TemperatureRequestResponse[];
  count: number;
  maxSize: 15;
}
```

`PATCH /thresholds` request:

```ts
{
  coldThreshold?: number;
  hotThreshold?: number;
}
```

`PATCH /thresholds` response:

```ts
{
  coldThreshold: number;
  hotThreshold: number;
}
```

`GET /thresholds` response:

```ts
{
  coldThreshold: number;
  hotThreshold: number;
}
```

## Test Strategy

Test pyramid for this project:

- Domain unit tests should be the fastest and most exhaustive because they cover classification and threshold validity.
- Use case tests should prove the application workflows with mocked/fake ports.
- Adapter tests should cover in-memory storage and configurable sensor behavior.
- HTTP/controller tests should verify request validation and response shape.
- E2E tests should cover a few critical flows through the whole Nest app.

Do not rely only on e2e tests. In this architecture, most meaningful behavior should be testable without starting Nest.

## Assumptions

- NestJS is used as the HTTP and dependency injection framework only; business logic stays outside Nest-specific classes where possible.
- Domain rules and application use cases are functions. Classes are reserved for NestJS framework types, stateful repositories, and adapters to external systems.
- Persistence is in memory, as allowed by the brief.
- The fake production sensor is acceptable until a real sensor integration exists.
- API validation uses Nest default error responses.
- Minimum WARM range is `2°C`.
- `GET /thresholds` will be implemented even though the brief marks it optional, because it makes the configurable state inspectable and testable.
