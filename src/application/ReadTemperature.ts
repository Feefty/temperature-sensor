import { TemperatureReading } from '../domain/history/TemperatureReading';
import { TemperatureHistoryRepository } from '../domain/ports/TemperatureHistoryRepository';
import { TemperatureSensor } from '../domain/ports/TemperatureSensor';
import { ThresholdsRepository } from '../domain/ports/ThresholdsRepository';
import { classifyTemperature } from '../domain/temperature/classifyTemperature';
import { Clock } from '../domain/time/Clock';

/**
 * Reads the current temperature from the sensor, classifies it against the
 * active thresholds, appends the reading to history, and returns it.
 */
export class ReadTemperature {
  constructor(
    private readonly sensor: TemperatureSensor,
    private readonly thresholds: ThresholdsRepository,
    private readonly history: TemperatureHistoryRepository,
    private readonly clock: Clock,
  ) {}

  async execute(): Promise<TemperatureReading> {
    const celsius = await this.sensor.read();
    const thresholds = await this.thresholds.get();

    const reading: TemperatureReading = {
      celsius,
      state: classifyTemperature(celsius, thresholds),
      recordedAt: this.clock(),
    };

    await this.history.record(reading);
    return reading;
  }
}
