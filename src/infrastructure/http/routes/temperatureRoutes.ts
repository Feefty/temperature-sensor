import { Router } from 'express';
import { TemperatureController } from '../controllers/TemperatureController';

export const createTemperatureRoutes = (controller: TemperatureController) => {
  const router = Router();

  router.get('/capture', controller.capture);

  return router;
};