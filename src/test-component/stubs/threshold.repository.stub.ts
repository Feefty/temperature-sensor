import { Threshold } from '../../domain/domain-contract/models/threshold.model';
import { ThresholdRepositoryPort } from '../../domain/domain-contract/ports/secondary/threshold.repository.port';

export class ThresholdRepositoryStub implements ThresholdRepositoryPort {
  private threshold: Threshold = {
    id: 'stub-id',
    coldMax: 22,
    hotMin: 35,
    updatedAt: new Date(),
  };

  async getCurrent(): Promise<Threshold> {
    return this.threshold;
  }

  async update(coldMax: number, hotMin: number): Promise<Threshold> {
    this.threshold = { ...this.threshold, coldMax, hotMin, updatedAt: new Date() };
    return this.threshold;
  }
}
