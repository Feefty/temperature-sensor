const { Router } = require('express');
const TemperatureSensor = require('../../../infrastructure/sensors/TemperatureSensor');
const InMemoryTemperatureRepository = require('../../../infrastructure/repositories/InMemoryTemperatureRepository');
const TemperatureController = require('../controllers/TemperatureController');

const router = Router();
const controller = new TemperatureController(
  new TemperatureSensor(),
  new InMemoryTemperatureRepository()
);

router.get('/temperature', (req, res) => controller.getTemperature(req, res));
router.get('/temperature/history', (req, res) => controller.getHistory(req, res));
router.patch('/temperature/thresholds', (req, res) => controller.updateThresholds(req, res));

module.exports = router;