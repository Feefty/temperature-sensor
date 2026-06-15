import { Threshold } from '../../../../../domain/domain-contract/models/threshold.model';
import type { ThresholdResponse } from '../../../api-contract/generated/types.gen';

export function toThresholdResponse(model: Threshold): ThresholdResponse {
  return {
    id: model.id,
    coldMax: model.coldMax,
    hotMin: model.hotMin,
    updatedAt: model.updatedAt.toISOString(),
  };
}
