import { classify, type HistoryEntry } from '../domain/temperature-state';

export interface GetTemperatureDeps {
  getTemperatureFromSensor: () => number;
  getThresholds: () => { coldMaxExclusive: number; hotMinInclusive: number };
  saveToHistory: (entry: HistoryEntry) => void;
}

export function getTemperature(deps: GetTemperatureDeps): HistoryEntry {
  const temperature = deps.getTemperatureFromSensor();
  const thresholds = deps.getThresholds();
  const state = classify(temperature, thresholds);
  const timestamp = Date.now();

  const entry: HistoryEntry = { temperature, state, timestamp };
  deps.saveToHistory(entry);

  return entry;
}
