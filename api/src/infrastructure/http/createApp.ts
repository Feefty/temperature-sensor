import express, { type Express } from 'express';
import type { TemperatureSensor } from '../../domain/ports/TemperatureSensor';
import type { ReadingRepository } from '../../domain/ports/ReadingRepository';
import { CaptureReading } from '../../application/use-cases/CaptureReading';
import { GetHistory } from '../../application/use-cases/GetHistory';
import { RedefineThresholds } from '../../application/use-cases/RedefineThresholds';
import { TemperatureController } from './controllers/TemperatureController';
import { ThresholdsController } from './controllers/ThresholdsController';
import { buildRouter } from './routes';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';

export interface AppDependencies {
  sensor: TemperatureSensor;
  repository: ReadingRepository;
}

// Pure factory (no side effects): tests drive it with supertest, main.ts adds listen().
export function createApp({ sensor, repository }: AppDependencies): Express {
  const temperatureController = new TemperatureController(
    new CaptureReading(sensor, repository),
    new GetHistory(repository),
  );
  const thresholdsController = new ThresholdsController(new RedefineThresholds(repository));

  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '4kb' }));
  app.use('/api/v1', buildRouter(temperatureController, thresholdsController));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
