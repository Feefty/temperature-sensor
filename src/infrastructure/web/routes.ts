import { Elysia } from "elysia";
import { minValue, number, object, pipe, safeParse } from "valibot";
import type { TemperatureReading } from "@domain/TemperatureReading.ts";
import type { Thresholds } from "@domain/Thresholds.ts";

export interface TemperatureServiceGateway {
  readCurrentTemperature(): Promise<TemperatureReading>;
  getHistory(): Promise<TemperatureReading[]>;
  updateThresholds(
    coldThreshold: number,
    hotThreshold: number,
  ): Promise<Thresholds>;
  getThresholds(): Promise<Thresholds>;
}

const updateThresholdsBodySchema = object({
  coldThreshold: pipe(number(), minValue(-273.15)),
  hotThreshold: pipe(number(), minValue(-273.15)),
});

export function createSensorRoutes(
  temperatureService: TemperatureServiceGateway,
) {
  return new Elysia({ prefix: "/api/sensor" })
    .get("/temperature", async () => {
      const reading = await temperatureService.readCurrentTemperature();
      return { data: reading };
    })
    .get("/history", async () => {
      const history = await temperatureService.getHistory();
      return { data: history };
    })
    .put("/thresholds", async ({ body, set }) => {
      const parsed = safeParse(updateThresholdsBodySchema, body);
      if (!parsed.success) {
        set.status = 400;
        return {
          error:
            "coldThreshold and hotThreshold are required and must be numbers >= -273.15.",
        };
      }
      try {
        const thresholds = await temperatureService.updateThresholds(
          parsed.output.coldThreshold,
          parsed.output.hotThreshold,
        );
        return { data: thresholds.toObject() };
      } catch (err) {
        set.status = 400;
        return {
          error: err instanceof Error ? err.message : "Invalid thresholds.",
        };
      }
    })
    .get("/thresholds", async () => {
      const thresholds = await temperatureService.getThresholds();
      return { data: thresholds.toObject() };
    });
}
