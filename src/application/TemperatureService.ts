import { Thresholds } from "@domain/Thresholds.ts";
import type { TemperatureReading } from "@domain/TemperatureReading.ts";
import type { TemperatureSensorPort } from "@domain/ports/TemperatureSensorPort.ts";
import type { TemperatureRepositoryPort } from "@domain/ports/TemperatureRepositoryPort.ts";
import type { ThresholdsRepositoryPort } from "@domain/ports/ThresholdsRepositoryPort.ts";

export class TemperatureService {
  constructor(
    private readonly temperatureSensor: TemperatureSensorPort,
    private readonly temperatureRepository: TemperatureRepositoryPort,
    private readonly thresholdsRepository: ThresholdsRepositoryPort,
  ) {}

  async readCurrentTemperature(): Promise<TemperatureReading> {
    const thresholds = await this.thresholdsRepository.get();
    const temperature = await this.temperatureSensor.read();
    const state = thresholds.determineState(temperature.celsius);

    const reading: TemperatureReading = {
      id: crypto.randomUUID(),
      temperatureCelsius: temperature.celsius,
      state,
      timestamp: new Date().toISOString(),
    };

    await this.temperatureRepository.save(reading);
    return reading;
  }

  async getHistory(): Promise<TemperatureReading[]> {
    return this.temperatureRepository.findLast(15);
  }

  async updateThresholds(
    coldThreshold: number,
    hotThreshold: number,
  ): Promise<Thresholds> {
    const thresholds = Thresholds.create(coldThreshold, hotThreshold);
    await this.thresholdsRepository.update(thresholds);
    return thresholds;
  }

  async getThresholds(): Promise<Thresholds> {
    return this.thresholdsRepository.get();
  }
}
