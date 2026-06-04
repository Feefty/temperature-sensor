import type { TemperatureSensor } from '../../domain/ports/TemperatureSensor';
import type { ReadingRepository } from '../../domain/ports/ReadingRepository';
import type { TemperatureReading } from '../../domain/entities/TemperatureReading';
import { resolveState } from '../../domain/services/resolveState';

export class CaptureReading {
  constructor(
    private readonly sensor: TemperatureSensor,
    private readonly repository: ReadingRepository,
  ) {}

  async execute(): Promise<TemperatureReading> {
    const temperature = await this.sensor.read();
    // Thresholds are read at capture time, so a redefinition only affects future readings.
    const thresholds = await this.repository.getThresholds();
    const reading: TemperatureReading = {
      temperature,
      state: resolveState(temperature, thresholds),
      capturedAt: new Date(),
      thresholds,
    };
    await this.repository.append(reading);
    return reading;
  }
}
