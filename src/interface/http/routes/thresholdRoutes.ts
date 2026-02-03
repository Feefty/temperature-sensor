import { Router } from 'express';
import { ThresholdController } from '../controllers/index.js';
import { validateRequest } from '../middlewares/index.js';
import { updateThresholdsSchema } from '../validators/index.js';

const router = Router();

router.get('/', ThresholdController.get);
router.put('/', validateRequest(updateThresholdsSchema), ThresholdController.update);

export { router as thresholdRoutes };
