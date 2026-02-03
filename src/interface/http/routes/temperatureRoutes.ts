import { Router } from 'express';
import { TemperatureController } from '../controllers/index.js';

const router = Router();

router.get('/', TemperatureController.getCurrent);
router.get('/history', TemperatureController.getHistory);

export { router as temperatureRoutes };
