import { Router } from "express";
import { prisma } from "../../database/PrismaClient";
import { SensorSchema } from "../../../domain/entities/Sensor";
import { PrismaSensorRepository } from "../../persistences/PrismaSensor.repository";
import { PrismaHistoryRepository } from "../../persistences/PrismaHistory.repository";
import { FakeTemperatureSensor } from "../../adapters/FakeTemperatureSensor";
import { GetTemperatureStateUseCaseImpl } from "../../../application/usecases/getTemperatureState.use-case";

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
temperatureRouter.get("/", async (req, res) => {
    const sensorRepository = new PrismaSensorRepository(prisma);
    const temperatureSensorRepository = new FakeTemperatureSensor();
    const historyRepository = new PrismaHistoryRepository(prisma);
    const getStateUseCase = new GetTemperatureStateUseCaseImpl(sensorRepository, temperatureSensorRepository, historyRepository);
    const state = await getStateUseCase.execute();
    res.send(state);
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
temperatureRouter.get("/sensor", async (req, res) => {
    const sensorRepository = new PrismaSensorRepository(prisma);
    const sensorConfig = await sensorRepository.get();
    res.send(sensorConfig);
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
temperatureRouter.post("/sensor", async (req, res) => {
    const { maxTemperature, minTemperature } = req.body;
    const sensor = SensorSchema.parse({ maxTemperature, minTemperature });
    const sensorRepository = new PrismaSensorRepository(prisma);
    await sensorRepository.save(sensor);
    res.send("Sensor updated successfully");
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
temperatureRouter.get("/history", async (req, res) => {
    const historyRepository = new PrismaHistoryRepository(prisma);
    const history = await historyRepository.getMany(15, "desc")
    res.send(history);
})
