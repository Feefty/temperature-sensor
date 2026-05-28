import { TemperatureSensor } from '../../domain/ports/TemperatureSensor';
import { TemperatureHistoryRepository } from '../../domain/repositories/TemperatureHistoryRepository';
import { SensorStateResolver } from '../../domain/services/SensorStateResolver';
import { TemperatureReading } from '../../domain/entities/TemperatureReading';
import { Thresholds } from '../../domain/entities/Thresholds';

export class CaptureTemperatureUseCase {
  constructor(
    private sensor: TemperatureSensor,
    private history: TemperatureHistoryRepository,
    private thresholds: Thresholds
  ) {}

  async execute(): Promise<TemperatureReading> {
    const temperature = await this.sensor.getTemperature();

    const state = SensorStateResolver.resolve(temperature, this.thresholds);

    const reading: TemperatureReading = {
      value: temperature,
      state,
      timestamp: new Date(),
    };

    await this.history.save(reading);

    await this.history.findLast(15);

    return reading;
  }
}