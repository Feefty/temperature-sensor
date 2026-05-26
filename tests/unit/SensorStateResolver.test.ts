import { SensorStateResolver } from '../../src/domain/services/SensorStateResolver';
import { SensorState } from '../../src/domain/entities/SensorState';

describe('SensorStateResolver', () => {
  const thresholds = {
    coldMax: 22,
    hotMin: 35,
  };

  it('returns COLD when temperature is below coldMax', () => {
    expect(SensorStateResolver.resolve(10, thresholds)).toBe(SensorState.COLD);
  });

  it('returns WARM when temperature is between thresholds', () => {
    expect(SensorStateResolver.resolve(25, thresholds)).toBe(SensorState.WARM);
  });

  it('returns HOT when temperature is >= hotMin', () => {
    expect(SensorStateResolver.resolve(40, thresholds)).toBe(SensorState.HOT);
  });
});