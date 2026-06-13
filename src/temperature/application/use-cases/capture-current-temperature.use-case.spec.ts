import { TemperatureReading } from "../models/temperature-reading";
import { ClockPort } from "../ports/clock.port";
import { IdGeneratorPort } from "../ports/id-generator.port";
import { TemperatureHistoryRepository } from "../ports/temperature-history.repository";
import { TemperatureSensorPort } from "../ports/temperature-sensor.port";
import { ThresholdsRepository } from "../ports/thresholds.repository";
import { captureCurrentTemperature } from "./capture-current-temperature.use-case";
import { createThresholds, Thresholds } from "../../domain/thresholds";

describe("captureCurrentTemperature", () => {
  it("captures, classifies, stores, and returns the current temperature", async (): Promise<void> => {
    const thresholds: Thresholds = createThresholds(22, 35);
    const capturedAt: Date = new Date("2026-06-13T10:30:00.000Z");

    const save: jest.Mock<Promise<void>, [TemperatureReading]> = jest.fn<Promise<void>, [TemperatureReading]>().mockResolvedValue(undefined);
    const sensor: TemperatureSensorPort = {
      readTemperature: jest.fn<Promise<number>, []>().mockResolvedValue(36.2),
    };
    const thresholdsRepository: ThresholdsRepository = {
      get: jest.fn<Promise<Thresholds>, []>().mockResolvedValue(thresholds),
      save: jest.fn<Promise<void>, [Thresholds]>().mockResolvedValue(undefined),
    };
    const historyRepository: TemperatureHistoryRepository = {
      save,
      findRecent: jest.fn<Promise<TemperatureReading[]>, [number]>().mockResolvedValue([]),
    };
    const clock: ClockPort = { now: (): Date => capturedAt };
    const idGenerator: IdGeneratorPort = {
      generate: (): string => "temp_req_01",
    };

    const result: TemperatureReading = await captureCurrentTemperature({ sensor, thresholdsRepository, historyRepository, clock, idGenerator });

    expect(sensor.readTemperature).toHaveBeenCalledTimes(1);
    expect(thresholdsRepository.get).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(result);
    expect(result).toEqual({
      id: "temp_req_01",
      temperature: 36.2,
      state: "HOT",
      thresholds: { coldThreshold: 22, hotThreshold: 35 },
      capturedAt,
    });
  });

});
