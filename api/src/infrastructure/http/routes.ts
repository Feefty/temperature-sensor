import { Router } from 'express';
import type { TemperatureController } from './controllers/TemperatureController';
import type { ThresholdsController } from './controllers/ThresholdsController';

export function buildRouter(
  temperature: TemperatureController,
  thresholds: ThresholdsController,
): Router {
  const router = Router();
  // GET captures the reading it returns: each read is a "temperature request" the brief counts in
  // history. Kept as GET to match that wording (see the design note in the README).
  router.get('/temperature', temperature.capture);
  router.get('/temperature/history', temperature.history);
  router.get('/thresholds', thresholds.current);
  router.put('/thresholds', thresholds.redefine);
  return router;
}
