import { Celsius } from './Celsius';
import { TemperatureState } from './TemperatureState';
import { Thresholds } from './Thresholds';

/**
 * Pure classification of a temperature against a set of thresholds. Taking the
 * thresholds as a parameter (rather than reading a global) is what makes the
 * rule both side-effect free and runtime-reconfigurable.
 */
export function classifyTemperature(celsius: Celsius, thresholds: Thresholds): TemperatureState {
  if (celsius >= thresholds.hot) {
    return 'HOT';
  }
  if (celsius < thresholds.cold) {
    return 'COLD';
  }
  return 'WARM';
}
