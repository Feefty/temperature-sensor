import { CaptureTemperatureUseCase } from "../use-cases/get-temperature.use-case";
import { GetHistoryUseCase } from "../use-cases/get-history.use-case";
import { UpdateThresholdsUseCase } from "../use-cases/update-thresholds.use-case";
import { ThresholdsService } from "../services/thresholds.service";
import { SensorState } from "../../domain/value-objects/sensor-state";
import { TemperatureReading } from "../../domain/entities/temperature-reading";
import { Thresholds } from "../../domain/entities/thresholds";
import { InvalidThresholdError } from "../../shared/errors/invalid-threshold.error";
import { ITemperatureSensor } from "../../domain/ports/outbound/i-temperature-sensor";
import { IReadingRepository } from "../../domain/ports/outbound/i-reading-repository";

function createMockSensor(temperature: number): ITemperatureSensor {
  return { getTemperature: jest.fn().mockResolvedValue(temperature) };
}

function createMockRepository(): jest.Mocked<IReadingRepository> {
  return {
    save: jest.fn().mockResolvedValue(undefined),
    getLastFifteen: jest.fn().mockResolvedValue([]),
  };
}

describe("CaptureTemperatureUseCase", () => {
  it("should capture a HOT reading when sensor returns 40°C", async () => {
    const sensor = createMockSensor(40);
    const repo = createMockRepository();
    const thresholdsService = new ThresholdsService();
    const useCase = new CaptureTemperatureUseCase(sensor, repo, thresholdsService);

    const reading = await useCase.execute();

    expect(sensor.getTemperature).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(reading.temperature).toBe(40);
    expect(reading.state).toBe(SensorState.HOT);
  });

  it("should capture a COLD reading when sensor returns 10°C", async () => {
    const sensor = createMockSensor(10);
    const repo = createMockRepository();
    const thresholdsService = new ThresholdsService();
    const useCase = new CaptureTemperatureUseCase(sensor, repo, thresholdsService);

    const reading = await useCase.execute();

    expect(reading.temperature).toBe(10);
    expect(reading.state).toBe(SensorState.COLD);
  });

  it("should capture a WARM reading when sensor returns 28°C", async () => {
    const sensor = createMockSensor(28);
    const repo = createMockRepository();
    const thresholdsService = new ThresholdsService();
    const useCase = new CaptureTemperatureUseCase(sensor, repo, thresholdsService);

    const reading = await useCase.execute();

    expect(reading.temperature).toBe(28);
    expect(reading.state).toBe(SensorState.WARM);
  });

  it("should save the reading to the repository", async () => {
    const sensor = createMockSensor(25);
    const repo = createMockRepository();
    const thresholdsService = new ThresholdsService();
    const useCase = new CaptureTemperatureUseCase(sensor, repo, thresholdsService);

    const reading = await useCase.execute();

    expect(repo.save).toHaveBeenCalledWith(reading);
  });

  it("should use updated thresholds after they are changed", async () => {
    const sensor = createMockSensor(42);
    const repo = createMockRepository();
    const thresholdsService = new ThresholdsService();
    thresholdsService.update(50, 40);
    const useCase = new CaptureTemperatureUseCase(sensor, repo, thresholdsService);

    const reading = await useCase.execute();

    expect(reading.state).toBe(SensorState.WARM);
  });
});

describe("GetHistoryUseCase", () => {
  it("should return the readings from the repository", async () => {
    const thresholds = new Thresholds();
    const mockReadings = [
      TemperatureReading.create(40, thresholds),
      TemperatureReading.create(20, thresholds),
    ];

    const repo = createMockRepository();
    repo.getLastFifteen.mockResolvedValue(mockReadings);
    const useCase = new GetHistoryUseCase(repo);

    const result = await useCase.execute();

    expect(repo.getLastFifteen).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockReadings);
    expect(result).toHaveLength(2);
  });

  it("should return an empty array when no readings exist", async () => {
    const repo = createMockRepository();
    repo.getLastFifteen.mockResolvedValue([]);
    const useCase = new GetHistoryUseCase(repo);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});

describe("UpdateThresholdsUseCase", () => {
  it("should update thresholds with valid values", async () => {
    const thresholdsService = new ThresholdsService();
    const useCase = new UpdateThresholdsUseCase(thresholdsService);

    const result = await useCase.execute(40, 10);

    expect(result.hotThreshold).toBe(40);
    expect(result.coldThreshold).toBe(10);
  });

  it("should persist updated thresholds in the service", async () => {
    const thresholdsService = new ThresholdsService();
    const useCase = new UpdateThresholdsUseCase(thresholdsService);

    await useCase.execute(45, 15);

    const current = thresholdsService.get();
    expect(current.hotThreshold).toBe(45);
    expect(current.coldThreshold).toBe(15);
  });

  it("should throw InvalidThresholdError when cold >= hot", async () => {
    const thresholdsService = new ThresholdsService();
    const useCase = new UpdateThresholdsUseCase(thresholdsService);

    await expect(useCase.execute(10, 40)).rejects.toThrow(InvalidThresholdError);
  });

  it("should throw InvalidThresholdError when cold === hot", async () => {
    const thresholdsService = new ThresholdsService();
    const useCase = new UpdateThresholdsUseCase(thresholdsService);

    await expect(useCase.execute(25, 25)).rejects.toThrow(InvalidThresholdError);
  });
});
