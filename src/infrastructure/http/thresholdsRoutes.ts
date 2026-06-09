import { Router } from 'express';
import { UpdateThresholds } from '../../application/UpdateThresholds';
import { Thresholds } from '../../domain/temperature/Thresholds';
import { asyncHandler } from './asyncHandler';

export interface ThresholdsRoutesDependencies {
  updateThresholds: UpdateThresholds;
}

const presentThresholds = (thresholds: Thresholds) => ({
  cold: thresholds.cold,
  hot: thresholds.hot,
});

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export function thresholdsRoutes(deps: ThresholdsRoutesDependencies): Router {
  const router = Router();

  router.put(
    '/thresholds',
    asyncHandler(async (req, res) => {
      // Transport-level validation: reject a malformed payload before the
      // domain ever sees it. The business rule (cold < hot) stays in the value
      // object and surfaces as a 400 through the error handler.
      const { cold, hot } = (req.body ?? {}) as Record<string, unknown>;
      if (!isFiniteNumber(cold) || !isFiniteNumber(hot)) {
        res.status(400).json({ error: 'Both "cold" and "hot" are required and must be numbers.' });
        return;
      }

      const thresholds = await deps.updateThresholds.execute({ cold, hot });
      res.status(200).json(presentThresholds(thresholds));
    }),
  );

  return router;
}
