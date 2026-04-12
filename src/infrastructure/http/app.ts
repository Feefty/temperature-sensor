import express, { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { InvalidThresholdError } from "../../shared/errors/invalid-threshold.error";

export function createApp(router: Router): express.Application {
  const app = express();

  app.use(express.json());
  app.use(router);

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof InvalidThresholdError) {
      res.status(400).json({ error: err.message });
      return;
    }

    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
