import { Router } from "express";
import { prisma } from "../../database/PrismaClient";
import { SensorSchema } from "../../../domain/entities/Sensor";
import { PrismaSensorRepository } from "../../repositories/PrismaSensor.repository";
import { PrismaHistoryRepository } from "../../repositories/PrismaHistory.repository";
import { SimulatedTemperatureSensor } from "../../adapters/SimulatedTemperatureSensor";
import { GetTemperatureStateUseCaseImpl } from "../../../application/usecases/getTemperatureState.use-case";
import { UpdateThresholdUseCaseImpl } from "../../../application/usecases/updateThreshold.use-case";

export const temperatureRouter = Router();

/**
 * @swagger
 * /api/temperature/:
 *   get:
 *     summary: Get current temperature state against thresholds
 *     tags: [Temperature Sensor]
 *     responses:
 *       200:
 *         description: Current temperature reading and threshold evaluation
 *       500:
 *         description: Internal Server Error
 */
temperatureRouter.get("/", async (req, res, next) => {
    try {
        const sensorRepository = new PrismaSensorRepository(prisma);
        const temperatureSensorRepository = new SimulatedTemperatureSensor();
        const historyRepository = new PrismaHistoryRepository(prisma);
        const getStateUseCase = new GetTemperatureStateUseCaseImpl(sensorRepository, temperatureSensorRepository, historyRepository);
        const state = await getStateUseCase.execute();
        res.send(state);
    } catch (error) {
        next(error);
    }
})


/**
 * @swagger
 * /api/temperature/sensor:
 *   get:
 *     summary: Get current sensor thresholds
 *     tags: [Temperature Sensor]
 *     responses:
 *       200:
 *         description: Current sensor thresholds
 *       500:
 *         description: Internal Server Error
 */
temperatureRouter.get("/sensor", async (req, res, next) => {
    try {
        const sensorRepository = new PrismaSensorRepository(prisma);
        const sensorConfig = await sensorRepository.get();
        res.send(sensorConfig);
    } catch (error) {
        next(error);
    }
})

/**
 * @swagger
 * /api/temperature/sensor:
 *   post:
 *     summary: Update sensor thresholds
 *     tags: [Temperature Sensor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maxTemperature:
 *                 type: number
 *                 description: The maximum temperature threshold
 *                 example: 30
 *               minTemperature:
 *                 type: number
 *                 description: The minimum temperature threshold
 *                 example: 10
 *             required:
 *               - maxTemperature
 *               - minTemperature
 *     responses:
 *       200:
 *         description: Sensor updated successfully
 *       400:
 *         description: Validation Error
 *       422:
 *         description: Semantic Business Logic Error
 *       500:
 *         description: Internal Server Error
 */
temperatureRouter.post("/sensor", async (req, res, next) => {
    try {
        const { maxTemperature, minTemperature } = req.body;
        const sensor = SensorSchema.parse({ maxTemperature, minTemperature });
        const sensorRepository = new PrismaSensorRepository(prisma);
        const updateThresholdUseCase = new UpdateThresholdUseCaseImpl(sensorRepository);
        await updateThresholdUseCase.execute(sensor.maxTemperature, sensor.minTemperature);
        res.send("Sensor updated successfully");
    } catch (error) {
        next(error);
    }
})

/**
 * @swagger
 * /api/temperature/history:
 *   get:
 *     summary: Get temperature reading history
 *     tags: [Temperature Sensor]
 *     responses:
 *       200:
 *         description: List of history records
 *       500:
 *         description: Internal Server Error
 */
temperatureRouter.get("/history", async (req, res, next) => {
    try {
        const historyRepository = new PrismaHistoryRepository(prisma);
        const history = await historyRepository.getMany(15, "desc")
        res.send(history);
    } catch (error) {
        next(error);
    }
})
