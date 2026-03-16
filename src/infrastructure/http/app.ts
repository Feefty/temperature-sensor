import express, { type Express } from 'express';
import { registerRoutes, type RoutesDeps } from './routes';

export function createApp(deps: RoutesDeps): Express {
  const app = express();

  app.use(express.json());
  registerRoutes(app, deps);

  return app;
}
