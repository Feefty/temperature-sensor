import { randomUUID } from "crypto";
import { Temperature } from "../../domain/entities/Temperature";
import { classifyTemperature } from "../../domain/entities/Threshold";
import { TemperatureSensorPort } from "../../domain/ports/TemperatureSensorPort";
import { TemperatureRepositoryPort } from "../../domain/ports/TemperatureRepositoryPort";
import { ThresholdRepositoryPort } from "../../domain/ports/ThresholdRepositoryPort";

export class GetTemperatureUseCase {
  constructor(
    private readonly sensor: TemperatureSensorPort,
    private readonly temperatureRepo: TemperatureRepositoryPort,
    private readonly thresholdRepo: ThresholdRepositoryPort
  ) {}

  async execute(): Promise<Temperature> {
    const value = await this.sensor.read();
    const threshold = await this.thresholdRepo.get();
    const state = classifyTemperature(value, threshold);

    const temperature: Temperature = {
      id: randomUUID(),
      value,
      state,
      recordedAt: new Date(),
    };

    return this.temperatureRepo.save(temperature);
  }
}
