import type { Temperature } from '../value-objects/Temperature';
import type { SensorState } from '../entities/TemperatureReading';
import type { Thresholds } from '../value-objects/Thresholds';

// HOT is inclusive (temp >= hotMin); COLD is exclusive (temp < coldMax); WARM is the rest.
export function resolveState(
  temperature: Temperature,
  { coldMax, hotMin }: Thresholds,
): SensorState {
  if (temperature >= hotMin) return 'HOT';
  if (temperature < coldMax) return 'COLD';
  return 'WARM';
}
