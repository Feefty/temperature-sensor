import express, { Application } from 'express';
import helmet from 'helmet';
import { apiRoutes } from './routes/index.js';
import { errorHandler } from './middlewares/index.js';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(express.json());

  app.use('/api', apiRoutes);

  app.use(errorHandler);

  return app;
}
