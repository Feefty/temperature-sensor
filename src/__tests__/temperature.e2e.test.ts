import request from "supertest";
import { Router } from "express";
import { createApp } from "../infrastructure/http/app";
import { TemperatureController } from "../infrastructure/http/controllers/TemperatureController";
import { temperatureRouteBuilder } from "../infrastructure/http/routes/temperature.route";
import { GetTemperatureStateUseCase } from "../application/usecases/getTemperatureState.use-case";
import { UpdateThresholdUseCase } from "../application/usecases/updateThreshold.use-case";
import { GetHistoryUseCase } from "../application/usecases/getHistory.use-case";
import { SensorRepository } from "../domain/ports/Sensor.repository";
import { HistoryRepository } from "../domain/ports/History.repository";
import { AppError } from "../domain/entities/Error";
import { StateSchema } from "../domain/entities/Sensor";

// ─── Mock dependencies ────────────────────────────────────────────────────────

const mockGetTemperatureStateUseCase: jest.Mocked<GetTemperatureStateUseCase> = {
    execute: jest.fn(),
};

const mockUpdateThresholdUseCase: jest.Mocked<UpdateThresholdUseCase> = {
    execute: jest.fn(),
};

const mockGetHistoryUseCase: jest.Mocked<GetHistoryUseCase> = {
    execute: jest.fn(),
};

const mockSensorRepository: jest.Mocked<SensorRepository> = {
    get: jest.fn(),
    save: jest.fn(),
};

const mockHistoryRepository: jest.Mocked<HistoryRepository> = {
    getMany: jest.fn(),
    save: jest.fn(),
};

// ─── Test app setup ───────────────────────────────────────────────────────────

function buildTestApp() {
    const controller = new TemperatureController(
        mockGetTemperatureStateUseCase,
        mockUpdateThresholdUseCase,
        mockGetHistoryUseCase,
        mockSensorRepository,
        mockHistoryRepository,
    );

    const router = Router();
    router.use("/temperature", temperatureRouteBuilder(controller));

    return createApp(router);
}

const app = buildTestApp();

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
    jest.clearAllMocks();
});

// GET /api/temperature/
describe("GET /api/temperature/", () => {
    it("returns 200 with the temperature state", async () => {
        const mockResult = { temperature: 28.5, state: StateSchema.enum.WARM, timestamp: new Date("2024-01-01T10:00:00Z") };
        mockGetTemperatureStateUseCase.execute.mockResolvedValue(mockResult);

        const res = await request(app).get("/api/temperature/");

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ temperature: 28.5, state: "WARM" });
        expect(mockGetTemperatureStateUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("returns 404 when sensor config is not found", async () => {
        mockGetTemperatureStateUseCase.execute.mockRejectedValue(new AppError("Sensor not found", 404));

        const res = await request(app).get("/api/temperature/");

        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({ message: "Sensor not found" });
    });

    it("returns 500 on unexpected errors", async () => {
        mockGetTemperatureStateUseCase.execute.mockRejectedValue(new Error("DB connection failed"));

        const res = await request(app).get("/api/temperature/");

        expect(res.status).toBe(500);
        expect(res.body).toMatchObject({ error: "Internal Server Error" });
    });
});

// GET /api/temperature/sensor
describe("GET /api/temperature/sensor", () => {
    it("returns 200 with the sensor thresholds", async () => {
        mockSensorRepository.get.mockResolvedValue({ maxTemperature: 35, minTemperature: 22 });

        const res = await request(app).get("/api/temperature/sensor");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ maxTemperature: 35, minTemperature: 22 });
    });

    it("returns 500 when repository throws", async () => {
        mockSensorRepository.get.mockRejectedValue(new Error("DB error"));

        const res = await request(app).get("/api/temperature/sensor");

        expect(res.status).toBe(500);
    });
});

// POST /api/temperature/sensor
describe("POST /api/temperature/sensor", () => {
    it("returns 200 when thresholds are valid", async () => {
        mockUpdateThresholdUseCase.execute.mockResolvedValue(undefined);

        const res = await request(app)
            .post("/api/temperature/sensor")
            .send({ maxTemperature: 35, minTemperature: 22 });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ message: "Sensor updated successfully" });
        expect(mockUpdateThresholdUseCase.execute).toHaveBeenCalledWith(35, 22);
    });

    it("returns 400 when body is missing required fields", async () => {
        const res = await request(app)
            .post("/api/temperature/sensor")
            .send({ maxTemperature: 35 }); // missing minTemperature

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({ error: "Validation Error" });
        expect(mockUpdateThresholdUseCase.execute).not.toHaveBeenCalled();
    });

    it("returns 400 when fields are not numbers", async () => {
        const res = await request(app)
            .post("/api/temperature/sensor")
            .send({ maxTemperature: "hot", minTemperature: "cold" });

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({ error: "Validation Error" });
    });

    it("returns 422 when minTemperature >= maxTemperature", async () => {
        mockUpdateThresholdUseCase.execute.mockRejectedValue(
            new AppError("minTemperature must be less than maxTemperature", 422)
        );

        const res = await request(app)
            .post("/api/temperature/sensor")
            .send({ maxTemperature: 20, minTemperature: 30 });

        expect(res.status).toBe(422);
        expect(res.body).toMatchObject({ message: "minTemperature must be less than maxTemperature" });
    });

    it("returns 500 on unexpected repository error", async () => {
        mockUpdateThresholdUseCase.execute.mockRejectedValue(new Error("DB error"));

        const res = await request(app)
            .post("/api/temperature/sensor")
            .send({ maxTemperature: 35, minTemperature: 22 });

        expect(res.status).toBe(500);
    });
});

// GET /api/temperature/history
describe("GET /api/temperature/history", () => {
    it("returns 200 with last 15 history entries", async () => {
        const mockHistory = [
            { temperature: 28, state: StateSchema.enum.WARM, timestamp: new Date("2024-01-01T10:00:00Z") },
            { temperature: 36, state: StateSchema.enum.HOT, timestamp: new Date("2024-01-01T09:00:00Z") },
        ];
        mockGetHistoryUseCase.execute.mockResolvedValue(mockHistory);

        const res = await request(app).get("/api/temperature/history");

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toMatchObject({ temperature: 28, state: "WARM" });
        expect(mockGetHistoryUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("returns 200 with an empty array when no history exists", async () => {
        mockGetHistoryUseCase.execute.mockResolvedValue([]);

        const res = await request(app).get("/api/temperature/history");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("returns 500 on unexpected errors", async () => {
        mockGetHistoryUseCase.execute.mockRejectedValue(new Error("DB error"));

        const res = await request(app).get("/api/temperature/history");

        expect(res.status).toBe(500);
    });
});
