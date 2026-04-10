import { prisma } from "../database/PrismaClient";
import { PrismaSensorRepository } from "../repositories/PrismaSensor.repository";
import { PrismaHistoryRepository } from "../repositories/PrismaHistory.repository";
import { SimulatedTemperatureSensor } from "../adapters/SimulatedTemperatureSensor";
import { GetTemperatureStateUseCaseImpl } from "../../application/usecases/getTemperatureState.use-case";
import { UpdateThresholdUseCaseImpl } from "../../application/usecases/updateThreshold.use-case";
import { TemperatureController } from "../http/controllers/TemperatureController";
import { GetHistoryUseCaseImpl } from "../../application/usecases/getHistory.use-case";


export const TemperatureControllerFactory = (): TemperatureController => {
    const sensorRepository = new PrismaSensorRepository(prisma);
    const historyRepository = new PrismaHistoryRepository(prisma);
    const temperatureSensor = new SimulatedTemperatureSensor();
    return new TemperatureController(
        new GetTemperatureStateUseCaseImpl(sensorRepository, temperatureSensor, historyRepository),
        new UpdateThresholdUseCaseImpl(sensorRepository),
        new GetHistoryUseCaseImpl(historyRepository),
        sensorRepository,
        historyRepository,
    );
} 
