import { resolveState } from '../../../src/domain/services/resolveState';
import { createTemperature } from '../../../src/domain/value-objects/Temperature';
import { createThresholds, DEFAULT_THRESHOLDS } from '../../../src/domain/value-objects/Thresholds';

describe('resolveState', () => {
  describe('with default thresholds (COLD below 22, HOT at or above 35)', () => {
    it.each([
      [21.9, 'COLD'],
      [22.0, 'WARM'],
      [34.9, 'WARM'],
      [35.0, 'HOT'],
      [40, 'HOT'],
      [-100, 'COLD'],
    ])('classifies %p as %s', (temperature, expected) => {
      expect(resolveState(createTemperature(temperature), DEFAULT_THRESHOLDS)).toBe(expected);
    });
  });

  it('honours custom thresholds', () => {
    const thresholds = createThresholds(0, 10);
    expect(resolveState(createTemperature(-0.1), thresholds)).toBe('COLD');
    expect(resolveState(createTemperature(0), thresholds)).toBe('WARM');
    expect(resolveState(createTemperature(9.9), thresholds)).toBe('WARM');
    expect(resolveState(createTemperature(10), thresholds)).toBe('HOT');
  });
});
