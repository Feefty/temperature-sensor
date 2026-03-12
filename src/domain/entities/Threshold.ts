import { SensorState } from "./SensorState";

export interface Threshold {
  coldMax: number;
  hotMin: number;
}

export function classifyTemperature(
  value: number,
  threshold: Threshold
): SensorState {
  if (value >= threshold.hotMin) return SensorState.HOT;
  if (value < threshold.coldMax) return SensorState.COLD;
  return SensorState.WARM;
}
