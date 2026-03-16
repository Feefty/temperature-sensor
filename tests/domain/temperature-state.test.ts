import { classify, type Thresholds } from '../../src/domain/temperature-state';

const defaultThresholds: Thresholds = {
  coldMaxExclusive: 22,
  hotMinInclusive: 35,
};

describe('classify', () => {
  it('returns COLD when temperature is 21.9', () => {
    expect(classify(21.9, defaultThresholds)).toBe('COLD');
  });

  it('returns WARM when temperature is 22', () => {
    expect(classify(22, defaultThresholds)).toBe('WARM');
  });

  it('returns WARM when temperature is 34.9', () => {
    expect(classify(34.9, defaultThresholds)).toBe('WARM');
  });

  it('returns HOT when temperature is 35', () => {
    expect(classify(35, defaultThresholds)).toBe('HOT');
  });

  it('returns correct state with custom thresholds', () => {
    const custom: Thresholds = { coldMaxExclusive: 20, hotMinInclusive: 40 };
    expect(classify(19.9, custom)).toBe('COLD');
    expect(classify(20, custom)).toBe('WARM');
    expect(classify(39.9, custom)).toBe('WARM');
    expect(classify(40, custom)).toBe('HOT');
  });
});
