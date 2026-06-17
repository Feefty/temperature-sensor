import { TemperatureService } from "@application/TemperatureService.ts";
import { Thresholds } from "@domain/Thresholds.ts";
import { Temperature } from "@domain/Temperature.ts";
import type { TemperatureSensorPort } from "@domain/ports/TemperatureSensorPort.ts";
import type { TemperatureRepositoryPort } from "@domain/ports/TemperatureRepositoryPort.ts";
import type { ThresholdsRepositoryPort } from "@domain/ports/ThresholdsRepositoryPort.ts";
import type { TemperatureReading } from "@domain/TemperatureReading.ts";

function createMockPorts() {
  const mockSensor: TemperatureSensorPort = {
    read: jest.fn().mockResolvedValue(Temperature.fromCelsius(25)),
  };
  const savedReadings: TemperatureReading[] = [];
  const mockRepository: TemperatureRepositoryPort = {
    save: jest.fn((reading: TemperatureReading) => {
      savedReadings.push(reading);
      return Promise.resolve();
    }),
    findLast: jest.fn((count: number) =>
      Promise.resolve(savedReadings.slice(-count).reverse()),
    ),
  };
  let currentThresholds = Thresholds.default();
  const mockThresholds: ThresholdsRepositoryPort = {
    get: jest.fn().mockImplementation(() => Promise.resolve(currentThresholds)),
    update: jest.fn((t: Thresholds) => {
      currentThresholds = t;
      return Promise.resolve();
    }),
  };

  return { mockSensor, mockRepository, mockThresholds, savedReadings };
}

describe("TemperatureService", () => {
  describe("readCurrentTemperature", () => {
    it("returns a temperature reading with correct state", async () => {
      const { mockSensor, mockRepository, mockThresholds } = createMockPorts();
      const service = new TemperatureService(
        mockSensor,
        mockRepository,
        mockThresholds,
      );

      const reading = await service.readCurrentTemperature();

      expect(reading).toHaveProperty("id");
      expect(reading).toHaveProperty("temperatureCelsius", 25);
      expect(reading).toHaveProperty("state", "WARM");
      expect(reading).toHaveProperty("timestamp");
      expect(mockSensor.read).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(reading);
    });

    it("returns HOT when sensor reads above hot threshold", async () => {
      const sensor: TemperatureSensorPort = {
        read: jest.fn().mockResolvedValue(Temperature.fromCelsius(40)),
      };
      const repository: TemperatureRepositoryPort = {
        save: jest.fn().mockResolvedValue(undefined),
        findLast: jest.fn().mockResolvedValue([]),
      };
      const thresholds: ThresholdsRepositoryPort = {
        get: jest.fn().mockResolvedValue(Thresholds.default()),
        update: jest.fn().mockResolvedValue(undefined),
      };
      const service = new TemperatureService(sensor, repository, thresholds);

      const reading = await service.readCurrentTemperature();

      expect(reading.state).toBe("HOT");
    });

    it("returns COLD when sensor reads below cold threshold", async () => {
      const sensor: TemperatureSensorPort = {
        read: jest.fn().mockResolvedValue(Temperature.fromCelsius(15)),
      };
      const repository: TemperatureRepositoryPort = {
        save: jest.fn().mockResolvedValue(undefined),
        findLast: jest.fn().mockResolvedValue([]),
      };
      const thresholds: ThresholdsRepositoryPort = {
        get: jest.fn().mockResolvedValue(Thresholds.default()),
        update: jest.fn().mockResolvedValue(undefined),
      };
      const service = new TemperatureService(sensor, repository, thresholds);

      const reading = await service.readCurrentTemperature();

      expect(reading.state).toBe("COLD");
    });
  });

  describe("getHistory", () => {
    it("returns the last readings", async () => {
      const { mockSensor, mockRepository, mockThresholds } = createMockPorts();
      const service = new TemperatureService(
        mockSensor,
        mockRepository,
        mockThresholds,
      );

      await service.readCurrentTemperature();
      await service.readCurrentTemperature();
      await service.readCurrentTemperature();

      const history = await service.getHistory();

      expect(history).toHaveLength(3);
    });

    it("queries repository with count of 15", async () => {
      const sensor: TemperatureSensorPort = {
        read: jest.fn().mockResolvedValue(Temperature.fromCelsius(22)),
      };
      const repository: TemperatureRepositoryPort = {
        save: jest.fn().mockResolvedValue(undefined),
        findLast: jest.fn((count: number) => {
          expect(count).toBe(15);
          return Promise.resolve([]);
        }),
      };
      const thresholds: ThresholdsRepositoryPort = {
        get: jest.fn().mockResolvedValue(Thresholds.default()),
        update: jest.fn().mockResolvedValue(undefined),
      };
      const service = new TemperatureService(sensor, repository, thresholds);

      await service.getHistory();

      expect(repository.findLast).toHaveBeenCalledWith(15);
    });
  });

  describe("updateThresholds", () => {
    it("updates thresholds and returns them", async () => {
      const { mockSensor, mockRepository, mockThresholds } = createMockPorts();
      const service = new TemperatureService(
        mockSensor,
        mockRepository,
        mockThresholds,
      );

      const thresholds = await service.updateThresholds(10, 40);

      expect(thresholds.coldThreshold).toBe(10);
      expect(thresholds.hotThreshold).toBe(40);
      expect(mockThresholds.update).toHaveBeenCalled();
    });

    it("throws for invalid thresholds", async () => {
      const { mockSensor, mockRepository, mockThresholds } = createMockPorts();
      const service = new TemperatureService(
        mockSensor,
        mockRepository,
        mockThresholds,
      );

      await expect(service.updateThresholds(30, 20)).rejects.toThrow();
    });
  });

  describe("getThresholds", () => {
    it("returns current thresholds from repository", async () => {
      const { mockSensor, mockRepository, mockThresholds } = createMockPorts();
      const service = new TemperatureService(
        mockSensor,
        mockRepository,
        mockThresholds,
      );

      const thresholds = await service.getThresholds();

      expect(thresholds.coldThreshold).toBe(22);
      expect(thresholds.hotThreshold).toBe(35);
    });
  });
});
