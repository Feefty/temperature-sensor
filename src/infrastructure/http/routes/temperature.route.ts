import { Router } from "express";
import { TemperatureController } from "../controllers/TemperatureController";

export function temperatureRouteBuilder(controller: TemperatureController): Router {
    const temperatureRouter = Router();

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
    temperatureRouter.get("/", controller.getTemperatureState);

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
    temperatureRouter.get("/sensor", controller.getSensorConfig);

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
    temperatureRouter.post("/sensor", controller.updateSensorConfig);

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
    temperatureRouter.get("/history", controller.getHistory);

    return temperatureRouter;
}
