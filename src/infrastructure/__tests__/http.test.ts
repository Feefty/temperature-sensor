import request from "supertest";
import { createApp } from "../http/app";
import { createTemperatureRouter } from "../adapters/inbound/temperature.routes";
import { TemperatureController } from "../adapters/inbound/temperature.controller";
import { CaptureTemperatureUseCase } from "../../application/use-cases/get-temperature.use-case";
import { GetHistoryUseCase } from "../../application/use-cases/get-history.use-case";
import { UpdateThresholdsUseCase } from "../../application/use-cases/update-thresholds.use-case";
import { ThresholdsService } from "../../application/services/thresholds.service";
import { InMemoryReadingRepository } from "../adapters/outbound/in-memory-reading.repository";
import { ITemperatureSensor } from "../../domain/ports/outbound/i-temperature-sensor";

function createTestApp(sensorTemp: number = 30) {
  const sensor: ITemperatureSensor = {
    getTemperature: jest.fn().mockResolvedValue(sensorTemp),
  };
  const repository = new InMemoryReadingRepository();
  const thresholdsService = new ThresholdsService();

  const captureUseCase = new CaptureTemperatureUseCase(sensor, repository, thresholdsService);
  const historyUseCase = new GetHistoryUseCase(repository);
  const updateThresholdsUseCase = new UpdateThresholdsUseCase(thresholdsService);

  const controller = new TemperatureController(captureUseCase, historyUseCase, updateThresholdsUseCase);
  const router = createTemperatureRouter(controller);
  return createApp(router);
}

describe("Temperature API — Integration", () => {
  describe("POST /temperature/capture", () => {
    it("should return 200 with a temperature reading", async () => {
      const app = createTestApp(30);

      const res = await request(app).post("/temperature/capture");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("temperature", 30);
      expect(res.body).toHaveProperty("state", "WARM");
    });

    it("should return HOT state for temperature >= 35", async () => {
      const app = createTestApp(42);

      const res = await request(app).post("/temperature/capture");

      expect(res.status).toBe(200);
      expect(res.body.state).toBe("HOT");
    });

    it("should return COLD state for temperature < 22", async () => {
      const app = createTestApp(5);

      const res = await request(app).post("/temperature/capture");

      expect(res.status).toBe(200);
      expect(res.body.state).toBe("COLD");
    });
  });

  describe("GET /temperature/history", () => {
    it("should return 200 with an empty array initially", async () => {
      const app = createTestApp();

      const res = await request(app).get("/temperature/history");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return captured readings", async () => {
      const app = createTestApp(28);

      await request(app).post("/temperature/capture");
      await request(app).post("/temperature/capture");
      const res = await request(app).get("/temperature/history");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty("temperature", 28);
    });

    it("should return at most 15 readings", async () => {
      const app = createTestApp(25);

      for (let i = 0; i < 20; i++) {
        await request(app).post("/temperature/capture");
      }

      const res = await request(app).get("/temperature/history");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(15);
    });
  });

  describe("PATCH /temperature/thresholds", () => {
    it("should return 200 with updated thresholds for valid values", async () => {
      const app = createTestApp();

      const res = await request(app)
        .patch("/temperature/thresholds")
        .send({ hot: 40, cold: 18 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ hotThreshold: 40, coldThreshold: 18 });
    });

    it("should return 400 when cold >= hot", async () => {
      const app = createTestApp();

      const res = await request(app)
        .patch("/temperature/thresholds")
        .send({ hot: 10, cold: 40 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("Invalid thresholds");
    });

    it("should return 400 when cold === hot", async () => {
      const app = createTestApp();

      const res = await request(app)
        .patch("/temperature/thresholds")
        .send({ hot: 25, cold: 25 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should affect subsequent captures after updating thresholds", async () => {
      const app = createTestApp(30);

      const res1 = await request(app).post("/temperature/capture");
      expect(res1.body.state).toBe("WARM");

      await request(app)
        .patch("/temperature/thresholds")
        .send({ hot: 25, cold: 10 });

      const res2 = await request(app).post("/temperature/capture");
      expect(res2.body.state).toBe("HOT");
    });
  });
});
