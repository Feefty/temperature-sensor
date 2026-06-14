import { TemperatureCapture } from '../../domain/domain-contract/models/temperature-capture.model';
import { TemperatureState } from '../../domain/domain-contract/models/temperature-state.enum';

export const hotCapture: TemperatureCapture = {
  id: 'hot-id',
  value: 38.5,
  state: TemperatureState.HOT,
  capturedAt: new Date('2024-01-01T12:00:00Z'),
};

export const warmCapture: TemperatureCapture = {
  id: 'warm-id',
  value: 25.0,
  state: TemperatureState.WARM,
  capturedAt: new Date('2024-01-01T12:05:00Z'),
};

export const coldCapture: TemperatureCapture = {
  id: 'cold-id',
  value: 18.0,
  state: TemperatureState.COLD,
  capturedAt: new Date('2024-01-01T12:10:00Z'),
};

export function generateCaptures(count: number): TemperatureCapture[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `capture-${i}`,
    value: 20 + i,
    state: TemperatureState.WARM,
    capturedAt: new Date(Date.now() + i * 1000),
  }));
}
