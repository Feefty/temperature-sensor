import { TemperatureSensor } from '../../domain/ports/TemperatureSensor';
import { TemperatureHistoryRepository } from '../../domain/repositories/TemperatureHistoryRepository';
import { SensorStateResolver } from '../../domain/services/SensorStateResolver';
import { TemperatureReading } from '../../domain/entities/TemperatureReading';
import { ThresholdRepository } from '../../domain/ports/ThresholdRepository';

export class CaptureTemperatureUseCase {
  constructor(
    private sensor: TemperatureSensor,
    private history: TemperatureHistoryRepository,
    private thresholdRepo: ThresholdRepository
  ) {}

  async execute(): Promise<TemperatureReading> {
    const temperature = await this.sensor.getTemperature();

    const thresholds = await this.thresholdRepo.get();

    const state = SensorStateResolver.resolve(temperature, thresholds);

    const reading: TemperatureReading = {
      value: temperature,
      state,
      timestamp: new Date(),
    };

    await this.history.save(reading);

    return reading;
  }
}