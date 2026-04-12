import { Router } from "express";
import { TemperatureController } from "./temperature.controller";

export function createTemperatureRouter(controller: TemperatureController): Router {
  const router = Router();

  router.post("/temperature/capture", (req, res, next) => controller.capture(req, res, next));
  router.get("/temperature/history", (req, res, next) => controller.history(req, res, next));
  router.patch("/temperature/thresholds", (req, res, next) => controller.updateThresholds(req, res, next));

  return router;
}
