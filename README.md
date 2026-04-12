# Temperature Sensor API

A REST API that captures temperature readings from a sensor.

---
## HowTo

### Run with Docker

```bash
docker-compose up --build
```

### Run tests

```bash
npm test
```

---

## API Endpoints with Examples for testing

All endpoints are under the base URL `http://localhost:3000`.

### `POST /temperature/capture`

Captures a temperature reading from the sensor, classifies it, and stores it in history.

**Request body:** none

**Response** `200 OK`:
```json
{
  "temperature": 28.4,
  "state": "WARM",
}
```

---

### `GET /temperature/history`

Returns the last 15 captured temperature readings.

**Request body:** none

**Response** `200 OK`:
```json
[
  {
    "temperature": 28.4,
    "state": "WARM",
  }
]
```

---

### `PATCH /temperature/thresholds`

Updates the HOT and COLD thresholds used to classify temperatures.

**Request body:**
```json
{
  "hot": 40,
  "cold": 18
}
```

**Response** `200 OK`:
```json
{
  "hotThreshold": 40,
  "coldThreshold": 18
}
```

**Error** `400 Bad Request` (when `cold >= hot`):
```json
{
  "error": "Invalid thresholds: coldThreshold 40 must be strictly less than hotThreshold 10"
}
```
