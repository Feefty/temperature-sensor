const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Temperature Sensor API',
      version: '1.0.0',
      description: 'API for reading and managing a temperature sensor',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/adapters/http/swagger.js'],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * @swagger
 * /api/temperature:
 *   get:
 *     summary: Get current temperature reading
 *     responses:
 *       200:
 *         description: Current temperature and state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 temperature:
 *                   type: number
 *                   example: 27.43
 *                 state:
 *                   type: string
 *                   enum: [HOT, WARM, COLD]
 *                   example: WARM
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/temperature/history:
 *   get:
 *     summary: Get last 15 temperature readings
 *     responses:
 *       200:
 *         description: Array of recent readings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   temperature:
 *                     type: number
 *                   state:
 *                     type: string
 *                     enum: [HOT, WARM, COLD]
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 */

/**
 * @swagger
 * /api/temperature/thresholds:
 *   patch:
 *     summary: Update HOT and COLD thresholds
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [hot, cold]
 *             properties:
 *               hot:
 *                 type: number
 *                 description: Minimum temperature for HOT state
 *                 example: 35
 *               cold:
 *                 type: number
 *                 description: Maximum temperature for COLD state
 *                 example: 22
 *     responses:
 *       200:
 *         description: Updated thresholds
 *       400:
 *         description: Invalid input
 */

module.exports = swaggerSpec;