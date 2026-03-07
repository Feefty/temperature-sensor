const { getState, setThresholds } = require('../../src/domain/entities/SensorState');

describe('SensorState', () => {
  beforeEach(() => setThresholds({ hot: 35, cold: 22 }));

  test('returns HOT when temp >= 35', () => expect(getState(35)).toBe('HOT'));
  test('returns HOT when temp > 35', () => expect(getState(40)).toBe('HOT'));
  test('returns COLD when temp < 22', () => expect(getState(21)).toBe('COLD'));
  test('returns WARM when temp is exactly 22', () => expect(getState(22)).toBe('WARM'));
  test('returns WARM when temp is between 22 and 35', () => expect(getState(28)).toBe('WARM'));

  test('respects updated thresholds', () => {
    setThresholds({ hot: 30, cold: 20 });
    expect(getState(30)).toBe('HOT');
    expect(getState(19)).toBe('COLD');
    expect(getState(25)).toBe('WARM');
  });
});