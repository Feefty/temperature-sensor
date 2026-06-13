import { TemperatureState } from './temperature-state';
import { Thresholds } from './thresholds';

export class InvalidTemperatureError extends Error {
  constructor(temperature: number) {
    super(`temperature must be a finite number; received ${temperature}`);
    this.name = 'InvalidTemperatureError';
  }
}

export function classifyTemperature(
  temperature: number,
  thresholds: Thresholds,
): TemperatureState {
  if (!Number.isFinite(temperature)) {
    throw new InvalidTemperatureError(temperature);
  }

  if (temperature < thresholds.coldThreshold) {
    return 'COLD';
  }

  if (temperature < thresholds.hotThreshold) {
    return 'WARM';
  }

  return 'HOT';
}
