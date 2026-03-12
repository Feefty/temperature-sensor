import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { RandomTemperatureSensorAdapter } from "../adapters/sensor/RandomTemperatureSensorAdapter";
import { PrismaTemperatureRepository } from "../adapters/repositories/PrismaTemperatureRepository";
import { PrismaThresholdRepository } from "../adapters/repositories/PrismaThresholdRepository";
import { GetTemperatureUseCase } from "../../application/use-cases/GetTemperatureUseCase";
import { GetHistoryUseCase } from "../../application/use-cases/GetHistoryUseCase";
import { GetThresholdsUseCase } from "../../application/use-cases/GetThresholdsUseCase";
import { UpdateThresholdsUseCase } from "../../application/use-cases/UpdateThresholdsUseCase";
import { TemperatureController } from "./controllers/TemperatureController";
import { temperatureRoutes } from "./routes/temperature.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { setupSwagger } from "./swagger/swagger.config";

export function createApp(prismaClient?: PrismaClient) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const prisma = prismaClient ?? new PrismaClient();

  // Adapters
  const sensor = new RandomTemperatureSensorAdapter();
  const tempRepo = new PrismaTemperatureRepository(prisma);
  const thresholdRepo = new PrismaThresholdRepository(prisma);

  // Use cases
  const getTemperature = new GetTemperatureUseCase(
    sensor,
    tempRepo,
    thresholdRepo
  );
  const getHistory = new GetHistoryUseCase(tempRepo);
  const getThresholds = new GetThresholdsUseCase(thresholdRepo);
  const updateThresholds = new UpdateThresholdsUseCase(thresholdRepo);

  // Controller
  const controller = new TemperatureController(
    getTemperature,
    getHistory,
    getThresholds,
    updateThresholds
  );

  // Swagger
  setupSwagger(app);

  // Routes
  app.use(temperatureRoutes(controller));

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
