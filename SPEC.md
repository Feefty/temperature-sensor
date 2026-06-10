## Exercise prerequisites and points of attention

- Hexagonal or Clean Architecture
- The API must include tests
- Production-quality: clean naming, clear boundaries, predictable errors, maintainable structure, and not over-hacky code
- Project must be runnable in Docker

## Exercise notes

- History is just about temperature retrieval calls, not all API calls. It could be kept in memory, for now.
- Thresholds for temperature states should be configurable. Remember to add checks on the range: min value should be less than max value, maybe require a minimal range of temperatures for the warm range (not possible to have COLD at 15 and HOT at 16, for example).
- The sensor is an external dependency: do not hardcode values in the controller. Mock dependency in tests.
- Add focused tests on the core logic and the use cases (capture current temperature, get recent history, and update thresholds.)
- What happens to history when thresholds are updated? It should stay unchanged, and should contain the temperature at the time, the status at the time, and the threshold values used at the time. Since thresholds can change, storing this snapshot makes past classifications explainable. Without storing the thresholds, we can end up with confusing records like “21.5 was WARM” when today’s thresholds would classify it as COLD.

## Hexagonal Architecture

- At the center, the temperature classification logic.
- The TemperatureSensor would be treated as an external dependency behind a port (right side, implements the sensor interface required by the core)
- The application use cases like “capture current temperature,” “get recent history,” and “update thresholds” are on the left side (they use the core logic to do something)

## API Endpoints

### `POST /temperature-requests`

This means: “make a new temperature request.” It retrieves from the sensor, classifies the result, stores it in history, and returns the current captured result. We use POST instead of GET because calling it has a side effect: it creates a history entry. Using GET for something that mutates history seems less clean to me.

Assumption: I will consider the measurement unit as implicit, because the brief explicitly tells us that the sensor returns temperatures in Celsius.

Example response:

```ts
{
    "id": "temp_req_01",
    "temperature": 36.2,
    "state": "HOT",
    "thresholds": {
      "coldThreshold": 22,
      "hotThreshold": 35
    },
    "capturedAt": "2026-06-10T19:42:00.000Z"
}
```

Response type:

```ts
type TemperatureState = "COLD" | "WARM" | "HOT";

type TemperatureRequestResponse = {
  id: string;
  temperature: number;
  state: TemperatureState;
  thresholds: {
    coldThreshold: number;
    hotThreshold: number;
  };
  capturedAt: string; // ISO datetime
};
```

### `GET /temperature-requests`

This means: “show me the last 15 temperature requests.” It does not capture a new temperature. Returns the most recent first. The history should contain temperature requests, not threshold updates.

Assumption: I choose to avoid adding pagination or custom limits because the brief says “last fifteen.”

Example response:

```ts
{
  "items": [
    {
      "id": "temp_req_16",
      "temperature": 36.2,
      "state": "HOT",
      "thresholds": {
        "coldThreshold": 22,
        "hotThreshold": 35
      },
      "capturedAt": "2026-06-10T19:42:00.000Z"
    },
    {
      "id": "temp_req_15",
      "temperature": 21.5,
      "state": "COLD",
      "thresholds": {
        "coldThreshold": 22,
        "hotThreshold": 35
      },
      "capturedAt": "2026-06-10T19:40:00.000Z"
    }
  ],
  "count": 2,
  "maxSize": 15
}
```

Response type:

```ts
type TemperatureHistoryResponse = {
  items: TemperatureRequestResponse[];
  count: number;
  maxSize: 15;
};
```

### `PATCH /thresholds`

This means: “partially update the classification thresholds.” I use PATCH because clients may want to update only one threshold without resending the whole current configuration.

The server should merge the provided values with the current threshold configuration, then validate the resulting full configuration. For example, if only `hotThreshold` is provided, the current `coldThreshold` remains unchanged.

Minimal constraints (violation produces a 400 error):

- at least one threshold must be provided
- provided thresholds must be numbers
- after merging with the current configuration, coldThreshold must be lower than hotThreshold

Example request body:

```ts
{
  "hotThreshold": 32
}
```

Request type:

```ts
type UpdateThresholdsRequest = {
  coldThreshold?: number;
  hotThreshold?: number;
};
```

Example response body:

```ts
{
  "coldThreshold": 22,
  "hotThreshold": 32
}
```

Response type:

```ts
type ThresholdsResponse = {
  coldThreshold: number;
  hotThreshold: number;
};
```

### GET /thresholds

Optional, but useful so the user can inspect the current configuration. This endpoint is not strictly required, but it makes the threshold update feature inspectable and testable from the outside: since the API allows redefining thresholds, clients need a way to know the current active configuration.

I choose not to expose a separate `warmThreshold`, because WARM is a derived value:  
WARM = temperature >= coldThreshold AND temperature < hotThreshold

Example response:

```ts
{
  "coldThreshold": 22,
  "hotThreshold": 35,
}
```

Response type

```ts
type ThresholdsResponse = {
  coldThreshold: number;
  hotThreshold: number;
};
```
