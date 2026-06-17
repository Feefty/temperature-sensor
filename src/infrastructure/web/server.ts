import { Elysia } from "elysia";
import type { TemperatureServiceGateway } from "./routes.ts";
import { createSensorRoutes } from "./routes.ts";

export function createServer(temperatureService: TemperatureServiceGateway) {
  return new Elysia().use(createSensorRoutes(temperatureService));
}
