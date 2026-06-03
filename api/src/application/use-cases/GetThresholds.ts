import type { ReadingRepository } from '../../domain/ports/ReadingRepository';
import type { Thresholds } from '../../domain/value-objects/Thresholds';

export class GetThresholds {
  constructor(private readonly repository: ReadingRepository) {}

  execute(): Promise<Thresholds> {
    return this.repository.getThresholds();
  }
}
