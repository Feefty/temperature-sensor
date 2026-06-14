import { TemperatureCapture } from '../../../../../domain/domain-contract/models/temperature-capture.model';
import type { TemperatureCaptureResponse } from '../../../api-contract/generated/types.gen';

export function toTemperatureCaptureResponseList(models: TemperatureCapture[]): TemperatureCaptureResponse[] {
  return models.map(toTemperatureCaptureResponse);
}

export function toTemperatureCaptureResponse(model: TemperatureCapture): TemperatureCaptureResponse {
  return {
    id: model.id,
    value: model.value,
    state: model.state,
    capturedAt: model.capturedAt.toISOString()
  };
}

