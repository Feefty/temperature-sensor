import { Router } from 'express';
import { TemperatureController } from '../controllers/TemperatureController';

export const temperatureRoutes = (controller: TemperatureController) => {
  const router = Router();

  router.get('/history', controller.history);
  router.put('/thresholds', controller.updateThresholds);

  return router;
};