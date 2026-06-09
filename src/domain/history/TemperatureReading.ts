import { Celsius } from '../temperature/Celsius';
import { TemperatureState } from '../temperature/TemperatureState';

/**
 * A single recorded temperature request: the captured temperature, the state
 * it was classified as at that moment, and when it was taken.
 */
export interface TemperatureReading {
  readonly celsius: Celsius;
  readonly state: TemperatureState;
  readonly recordedAt: Date;
}
