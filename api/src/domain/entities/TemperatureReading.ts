import type { Temperature } from '../value-objects/Temperature';
import type { Thresholds } from '../value-objects/Thresholds';

export type SensorState = 'COLD' | 'WARM' | 'HOT';

export interface TemperatureReading {
  readonly temperature: Temperature;
  readonly state: SensorState;
  readonly capturedAt: Date;
  // The thresholds in effect when this reading was classified. Snapshotting them makes the
  // "redefining only affects future readings" rule visible in the data, not just asserted in tests.
  readonly thresholds: Thresholds;
}
