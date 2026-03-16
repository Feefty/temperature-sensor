import type { Thresholds } from '../domain/temperature-state';

export interface GetThresholdsDeps {
  getThresholds: () => Thresholds;
}

export function getThresholds(deps: GetThresholdsDeps): Thresholds {
  return deps.getThresholds();
}
