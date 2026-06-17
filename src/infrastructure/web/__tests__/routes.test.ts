import { createServer } from "@infrastructure/web/server.ts";
import { Thresholds } from "@domain/Thresholds.ts";
import type { TemperatureServiceGateway } from "@infrastructure/web/routes.ts";
import type { TemperatureReading } from "@domain/TemperatureReading.ts";

function createMockService(): jest.Mocked<TemperatureServiceGateway> {
  const readings: TemperatureReading[] = [];
  let currentThresholds = Thresholds.default();

  return {
    readCurrentTemperature: jest.fn(() => {
      const reading: TemperatureReading = {
        id: crypto.randomUUID(),
        temperatureCelsius: 25,
        state: "WARM",
        timestamp: new Date().toISOString(),
      };
      readings.push(reading);
      return Promise.resolve(reading);
    }),
    getHistory: jest.fn(() =>
      Promise.resolve([...readings].reverse().slice(0, 15)),
    ),
    updateThresholds: jest.fn((cold: number, hot: number) => {
      currentThresholds = Thresholds.create(cold, hot);
      return Promise.resolve(currentThresholds);
    }),
    getThresholds: jest.fn(() => Promise.resolve(currentThresholds)),
  };
}

describe("sensor routes", () => {
  it("GET /api/sensor/temperature returns a reading", async () => {
    const mockService = createMockService();
    const app = createServer(mockService);

    const response = await app.handle(
      new Request("http://localhost/api/sensor/temperature"),
    );
    const body = (await response.json()) as { data: TemperatureReading };

    expect(response.status).toBe(200);
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("temperatureCelsius", 25);
    expect(body.data).toHaveProperty("state");
    expect(body.data).toHaveProperty("timestamp");
  });

  it("GET /api/sensor/history returns readings array", async () => {
    const mockService = createMockService();
    const app = createServer(mockService);

    await app.handle(new Request("http://localhost/api/sensor/temperature"));
    await app.handle(new Request("http://localhost/api/sensor/temperature"));

    const response = await app.handle(
      new Request("http://localhost/api/sensor/history"),
    );
    const body = (await response.json()) as { data: TemperatureReading[] };

    expect(response.status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data).toHaveLength(2);
  });

  it("GET /api/sensor/thresholds returns current thresholds", async () => {
    const mockService = createMockService();
    const app = createServer(mockService);

    const response = await app.handle(
      new Request("http://localhost/api/sensor/thresholds"),
    );
    const body = (await response.json()) as {
      data: { coldThreshold: number; hotThreshold: number };
    };

    expect(response.status).toBe(200);
    expect(body.data).toEqual({
      coldThreshold: 22,
      hotThreshold: 35,
    });
  });

  it("PUT /api/sensor/thresholds updates and returns thresholds", async () => {
    const mockService = createMockService();
    const app = createServer(mockService);

    const response = await app.handle(
      new Request("http://localhost/api/sensor/thresholds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coldThreshold: 10, hotThreshold: 40 }),
      }),
    );
    const body = (await response.json()) as {
      data: { coldThreshold: number; hotThreshold: number };
    };

    expect(response.status).toBe(200);
    expect(body.data).toEqual({
      coldThreshold: 10,
      hotThreshold: 40,
    });
  });

  it("PUT /api/sensor/thresholds returns 400 when cold >= hot", async () => {
    const mockService = createMockService();
    const app = createServer(mockService);

    const response = await app.handle(
      new Request("http://localhost/api/sensor/thresholds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coldThreshold: 40, hotThreshold: 10 }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("PUT /api/sensor/thresholds returns 400 for missing fields", async () => {
    const mockService = createMockService();
    const app = createServer(mockService);

    const response = await app.handle(
      new Request("http://localhost/api/sensor/thresholds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coldThreshold: 10 }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("returns 404 for unknown routes", async () => {
    const mockService = createMockService();
    const app = createServer(mockService);

    const response = await app.handle(
      new Request("http://localhost/api/sensor/unknown"),
    );

    expect(response.status).toBe(404);
  });
});
