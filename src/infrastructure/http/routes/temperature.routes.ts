import { Router } from "express";
import { TemperatureController } from "../controllers/TemperatureController";
import { validateRequest } from "../middlewares/validateRequest";
import { updateThresholdSchema } from "../validation/threshold.schema";

/**
 * @openapi
 * /temperature:
 *   get:
 *     summary: Read current temperature
 *     description: Reads a temperature value from the sensor, classifies it (HOT/COLD/WARM), saves it to history, and returns the result.
 *     tags: [Temperature]
 *     responses:
 *       200:
 *         description: Temperature reading with classification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 value:
 *                   type: number
 *                   example: 28.5
 *                 state:
 *                   type: string
 *                   enum: [HOT, COLD, WARM]
 *                 recordedAt:
 *                   type: string
 *                   format: date-time
 */

/**
 * @openapi
 * /temperature/history:
 *   get:
 *     summary: Get temperature history
 *     description: Returns the last 15 temperature readings ordered by most recent first.
 *     tags: [Temperature]
 *     responses:
 *       200:
 *         description: List of temperature readings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   value:
 *                     type: number
 *                   state:
 *                     type: string
 *                     enum: [HOT, COLD, WARM]
 *                   recordedAt:
 *                     type: string
 *                     format: date-time
 */

/**
 * @openapi
 * /temperature/thresholds:
 *   get:
 *     summary: Get current thresholds
 *     description: Returns the current threshold configuration for HOT/COLD/WARM classification.
 *     tags: [Thresholds]
 *     responses:
 *       200:
 *         description: Current threshold configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coldMax:
 *                   type: number
 *                   example: 22
 *                   description: Temperature below this value is COLD
 *                 hotMin:
 *                   type: number
 *                   example: 35
 *                   description: Temperature at or above this value is HOT
 *   put:
 *     summary: Update thresholds
 *     description: Updates the threshold configuration. coldMax must be strictly less than hotMin.
 *     tags: [Thresholds]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [coldMax, hotMin]
 *             properties:
 *               coldMax:
 *                 type: number
 *                 example: 15
 *               hotMin:
 *                 type: number
 *                 example: 40
 *     responses:
 *       200:
 *         description: Updated threshold configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coldMax:
 *                   type: number
 *                 hotMin:
 *                   type: number
 *       400:
 *         description: Validation error
 */

export function temperatureRoutes(controller: TemperatureController): Router {
  const router = Router();

  router.get("/temperature", (req, res, next) =>
    controller.readTemperature(req, res, next)
  );

  router.get("/temperature/history", (req, res, next) =>
    controller.readHistory(req, res, next)
  );

  router.get("/temperature/thresholds", (req, res, next) =>
    controller.readThresholds(req, res, next)
  );

  router.put(
    "/temperature/thresholds",
    validateRequest(updateThresholdSchema),
    (req, res, next) => controller.writeThresholds(req, res, next)
  );

  return router;
}
