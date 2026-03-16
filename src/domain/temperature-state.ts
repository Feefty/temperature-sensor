export type TemperatureState = 'COLD' | 'WARM' | 'HOT';

export interface Thresholds {
  coldMaxExclusive: number;
  hotMinInclusive: number;
}

export interface HistoryEntry {
  temperature: number;
  state: TemperatureState;
  timestamp: number;
}

export function classify(temperature: number, thresholds: Thresholds): TemperatureState {
  if (temperature >= thresholds.hotMinInclusive) return 'HOT';
  if (temperature < thresholds.coldMaxExclusive) return 'COLD';
  return 'WARM';
}
