import { ThresholdsInvariantError } from '../errors/DomainError';

// WARM is derived (the [coldMax, hotMin) band); only the two bounds are stored.
export interface Thresholds {
  readonly coldMax: number;
  readonly hotMin: number;
}

export function createThresholds(coldMax: number, hotMin: number): Thresholds {
  if (!Number.isFinite(coldMax) || !Number.isFinite(hotMin)) {
    throw new ThresholdsInvariantError('Thresholds must be finite numbers');
  }
  if (coldMax >= hotMin) {
    throw new ThresholdsInvariantError(
      `coldMax (${coldMax}) must be strictly less than hotMin (${hotMin})`,
    );
  }
  return { coldMax, hotMin };
}

export const DEFAULT_THRESHOLDS: Thresholds = createThresholds(22, 35);
