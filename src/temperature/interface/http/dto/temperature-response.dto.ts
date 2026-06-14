import { TemperatureReading } from '../../../application/models/temperature-reading';
import type { TemperatureHistory } from '../../../application/use-cases/get-temperature-history.use-case';
import { TemperatureState } from '../../../domain/temperature-state';
import { Thresholds } from '../../../domain/thresholds';

export type TemperatureResponse = Readonly<{
  id: string;
  temperature: number;
  state: TemperatureState;
  thresholds: Thresholds;
  capturedAt: string;
}>;

export type TemperatureHistoryResponse = Readonly<{
  items: TemperatureResponse[];
  count: number;
  maxSize: TemperatureHistory['maxSize'];
}>;

export function toTemperatureResponse(
  reading: TemperatureReading,
): TemperatureResponse {
  return {
    id: reading.id,
    temperature: reading.temperature,
    state: reading.state,
    thresholds: reading.thresholds,
    capturedAt: reading.capturedAt.toISOString(),
  };
}
