import { Threshold } from '../../domain/domain-contract/models/threshold.model';

export const defaultThreshold: Threshold = {
  id: 'thr-001',
  coldMax: 22,
  hotMin: 35,
  updatedAt: new Date('2024-01-01T00:00:00Z'),
};
