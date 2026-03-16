import type { HistoryEntry } from '../domain/temperature-state';

const HISTORY_SIZE = 15;

export interface GetHistoryDeps {
  getLastEntries: (count: number) => HistoryEntry[];
}

export function getHistory(deps: GetHistoryDeps): HistoryEntry[] {
  return deps.getLastEntries(HISTORY_SIZE);
}
