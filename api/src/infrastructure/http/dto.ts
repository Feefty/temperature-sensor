import type { SensorState, TemperatureReading } from '../../domain/entities/TemperatureReading';
import type { Thresholds } from '../../domain/value-objects/Thresholds';

// Explicit wire shape: capturedAt is serialised as an ISO 8601 string at the boundary. The
// thresholds the reading was classified against travel with it, so history is self-describing.
export interface ReadingDto {
  temperature: number;
  state: SensorState;
  capturedAt: string;
  thresholds: Thresholds;
}

export function toReadingDto(reading: TemperatureReading): ReadingDto {
  return {
    temperature: reading.temperature,
    state: reading.state,
    capturedAt: reading.capturedAt.toISOString(),
    thresholds: reading.thresholds,
  };
}
