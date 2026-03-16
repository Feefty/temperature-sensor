import type { Thresholds } from '../domain/temperature-state';

export interface SetThresholdsDeps {
  setThresholds: (thresholds: Thresholds) => void;
}

export class InvalidThresholdsError extends Error {
  constructor() {
    super('coldMaxExclusive must be strictly less than hotMinInclusive');
    this.name = 'InvalidThresholdsError';
  }
}

export function setThresholds(deps: SetThresholdsDeps, thresholds: Thresholds): void {
  if (thresholds.coldMaxExclusive >= thresholds.hotMinInclusive) {
    throw new InvalidThresholdsError();
  }
  deps.setThresholds(thresholds);
}
