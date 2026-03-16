import type { HistoryEntry } from '../../domain/temperature-state';

const MAX_HISTORY_SIZE = 15;

export class InMemoryHistoryRepository {
  private readonly entries: HistoryEntry[] = [];

  save(entry: HistoryEntry): void {
    this.entries.push(entry);
    if (this.entries.length > MAX_HISTORY_SIZE) {
      this.entries.shift();
    }
  }

  getLast(count: number = MAX_HISTORY_SIZE): HistoryEntry[] {
    const start = Math.max(0, this.entries.length - count);
    return this.entries.slice(start);
  }
}
