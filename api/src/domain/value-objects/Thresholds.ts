import { ThresholdsInvariantError } from '../errors/DomainError';
import { SENSOR_MAX, SENSOR_MIN } from '../sensorRange';

// WARM is everything between the two bounds, so it is computed, not stored.
export interface Thresholds {
  readonly coldMax: number;
  readonly hotMin: number;
}

const outOfRange = (value: number) => value < SENSOR_MIN || value > SENSOR_MAX;

export function createThresholds(coldMax: number, hotMin: number): Thresholds {
  if (!Number.isFinite(coldMax) || !Number.isFinite(hotMin)) {
    throw new ThresholdsInvariantError('Thresholds must be finite numbers');
  }
  // A bound outside the sensor range can never classify a real reading, so reject it server-side
  // rather than leave the client as the only guard.
  if (outOfRange(coldMax) || outOfRange(hotMin)) {
    throw new ThresholdsInvariantError(`Thresholds must be within ${SENSOR_MIN}..${SENSOR_MAX} °C`);
  }
  if (coldMax >= hotMin) {
    throw new ThresholdsInvariantError(
      `coldMax (${coldMax}) must be strictly less than hotMin (${hotMin})`,
    );
  }
  return { coldMax, hotMin };
}

export const DEFAULT_THRESHOLDS: Thresholds = createThresholds(22, 35);
