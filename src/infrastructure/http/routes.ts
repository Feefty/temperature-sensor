import type { Express, Request, Response, NextFunction } from 'express';
import { getTemperature, type GetTemperatureDeps } from '../../application/get-temperature';
import { getHistory, type GetHistoryDeps } from '../../application/get-history';
import { getThresholds, type GetThresholdsDeps } from '../../application/get-thresholds';
import {
  setThresholds,
  type SetThresholdsDeps,
  InvalidThresholdsError,
} from '../../application/set-thresholds';
import type { Thresholds } from '../../domain/temperature-state';

export interface RoutesDeps {
  getTemperatureDeps: GetTemperatureDeps;
  getHistoryDeps: GetHistoryDeps;
  getThresholdsDeps: GetThresholdsDeps;
  setThresholdsDeps: SetThresholdsDeps;
}

export function registerRoutes(app: Express, deps: RoutesDeps): void {
  app.get('/temperature', (req: Request, res: Response) => {
    const reading = getTemperature(deps.getTemperatureDeps);
    res.json(reading);
  });

  app.get('/temperature/history', (req: Request, res: Response) => {
    const history = getHistory(deps.getHistoryDeps);
    res.json({ items: history });
  });

  app.get('/temperature/thresholds', (req: Request, res: Response) => {
    const thresholds = getThresholds(deps.getThresholdsDeps);
    res.json(thresholds);
  });

  app.put('/temperature/thresholds', (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as Partial<Thresholds>;
    const thresholds: Thresholds = {
      coldMaxExclusive: Number(body.coldMaxExclusive),
      hotMinInclusive: Number(body.hotMinInclusive),
    };

    try {
      setThresholds(deps.setThresholdsDeps, thresholds);
      const updated = getThresholds(deps.getThresholdsDeps);
      res.json(updated);
    } catch (error) {
      if (error instanceof InvalidThresholdsError) {
        res.status(400).json({ error: error.message });
        return;
      }
      next(error);
    }
  });
}
