import { Threshold } from '../../../../domain/domain-contract/models/threshold.model';
import { ThresholdEntity } from '../entities/threshold.entity';

export function toDomain(entity: ThresholdEntity | null): Threshold | null {
  if (!entity) return null;
  return {
    id: entity.id,
    coldMax: Number(entity.coldMax),
    hotMin: Number(entity.hotMin),
    updatedAt: entity.updatedAt
  };
}
