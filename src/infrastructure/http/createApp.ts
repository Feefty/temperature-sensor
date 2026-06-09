import express, { Express } from 'express';
import { errorHandler } from './errorHandler';
import { temperatureRoutes, TemperatureRoutesDependencies } from './temperatureRoutes';
import { thresholdsRoutes, ThresholdsRoutesDependencies } from './thresholdsRoutes';

export type AppDependencies = TemperatureRoutesDependencies & ThresholdsRoutesDependencies;

/**
 * Composes the Express application from its use cases. The driving adapter only
 * knows the application layer; it never reaches into the domain or the concrete
 * infrastructure directly. Routes are registered first, the error handler last.
 */
export function createApp(deps: AppDependencies): Express {
  const app = express();
  app.use(express.json());

  app.use(temperatureRoutes(deps));
  app.use(thresholdsRoutes(deps));

  app.use(errorHandler);
  return app;
}
