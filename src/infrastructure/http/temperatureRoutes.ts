import { Router } from 'express';
import { GetTemperatureHistory } from '../../application/GetTemperatureHistory';
import { ReadTemperature } from '../../application/ReadTemperature';
import { TemperatureReading } from '../../domain/history/TemperatureReading';
import { asyncHandler } from './asyncHandler';

export interface TemperatureRoutesDependencies {
  readTemperature: ReadTemperature;
  getTemperatureHistory: GetTemperatureHistory;
}

/** Serialises a reading into a JSON-safe shape (Date -> ISO 8601 string). */
const presentReading = (reading: TemperatureReading) => ({
  celsius: reading.celsius,
  state: reading.state,
  recordedAt: reading.recordedAt.toISOString(),
});

export function temperatureRoutes(deps: TemperatureRoutesDependencies): Router {
  const router = Router();

  router.get(
    '/temperature',
    asyncHandler(async (_req, res) => {
      const reading = await deps.readTemperature.execute();
      res.status(200).json(presentReading(reading));
    }),
  );

  router.get(
    '/temperature/history',
    asyncHandler(async (_req, res) => {
      const readings = await deps.getTemperatureHistory.execute();
      res.status(200).json({ readings: readings.map(presentReading) });
    }),
  );

  return router;
}
