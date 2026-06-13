import { classifyTemperature } from '../../domain/temperature-classifier';
import { Thresholds } from '../../domain/thresholds';
import { TemperatureReading } from '../models/temperature-reading';
import { ClockPort } from '../ports/clock.port';
import { IdGeneratorPort } from '../ports/id-generator.port';
import { TemperatureHistoryRepository } from '../ports/temperature-history.repository';
import { TemperatureSensorPort } from '../ports/temperature-sensor.port';
import { ThresholdsRepository } from '../ports/thresholds.repository';

export type CaptureCurrentTemperatureDependencies = Readonly<{
  sensor: TemperatureSensorPort;
  thresholdsRepository: ThresholdsRepository;
  historyRepository: TemperatureHistoryRepository;
  clock: ClockPort;
  idGenerator: IdGeneratorPort;
}>;

export async function captureCurrentTemperature(
  dependencies: CaptureCurrentTemperatureDependencies,
): Promise<TemperatureReading> {
  const [temperature, activeThresholds]: [number, Thresholds] =
    await Promise.all([
      dependencies.sensor.readTemperature(),
      dependencies.thresholdsRepository.get(),
    ]);
  const reading: TemperatureReading = {
    id: dependencies.idGenerator.generate(),
    temperature,
    state: classifyTemperature(temperature, activeThresholds),
    thresholds: activeThresholds,
    capturedAt: dependencies.clock.now(),
  };

  await dependencies.historyRepository.save(reading);

  return reading;
}
