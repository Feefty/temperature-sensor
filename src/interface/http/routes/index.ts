import { Router, Request, Response } from 'express';
import { temperatureRoutes } from './temperatureRoutes.js';
import { thresholdRoutes } from './thresholdRoutes.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

router.use('/temperature', temperatureRoutes);
router.use('/thresholds', thresholdRoutes);

export { router as apiRoutes };
