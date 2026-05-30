import type { SensorState, TemperatureReading } from '../../domain/entities/TemperatureReading';

// Explicit wire shape: capturedAt is serialised as an ISO 8601 string at the boundary.
export interface ReadingDto {
  temperature: number;
  state: SensorState;
  capturedAt: string;
}

export function toReadingDto(reading: TemperatureReading): ReadingDto {
  return {
    temperature: reading.temperature,
    state: reading.state,
    capturedAt: reading.capturedAt.toISOString(),
  };
}
