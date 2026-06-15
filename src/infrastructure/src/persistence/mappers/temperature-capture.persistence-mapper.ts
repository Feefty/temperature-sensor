import { TemperatureCapture } from '../../../../domain/domain-contract/models/temperature-capture.model';
import { TemperatureState } from '../../../../domain/domain-contract/models/temperature-state.enum';
import { TemperatureCaptureEntity } from '../entities/temperature-capture.entity';

export function toDomain(entity: TemperatureCaptureEntity): TemperatureCapture {
  return {
    id: entity.id,
    value: Number(entity.value),
    state: entity.state as TemperatureState,
    capturedAt: entity.capturedAt,
  };
}

export function toEntity(model: TemperatureCapture): Partial<TemperatureCaptureEntity> {
  return {
    id: model.id,
    value: model.value,
    state: model.state,
    capturedAt: model.capturedAt,
  };
}
