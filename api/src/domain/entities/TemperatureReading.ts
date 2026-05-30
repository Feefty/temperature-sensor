import type { Temperature } from '../value-objects/Temperature';

export type SensorState = 'COLD' | 'WARM' | 'HOT';

export interface TemperatureReading {
  readonly temperature: Temperature;
  readonly state: SensorState;
  readonly capturedAt: Date;
}
