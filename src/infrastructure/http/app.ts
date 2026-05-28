import express from 'express';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = (temperatureRoutes?: any) => {
  const app = express();

  app.use(express.json());

  if (temperatureRoutes) {
    app.use('/temperature', temperatureRoutes);
  }

  app.use(errorHandler);

  return app;
};