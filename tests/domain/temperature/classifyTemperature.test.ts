import { classifyTemperature } from '../../../src/domain/temperature/classifyTemperature';
import { Thresholds } from '../../../src/domain/temperature/Thresholds';

describe('classifyTemperature', () => {
  describe('with the default thresholds (cold 22, hot 35)', () => {
    const thresholds = Thresholds.default();

    it.each<[number, ReturnType<typeof classifyTemperature>]>([
      [50, 'HOT'],
      [35, 'HOT'], // hot boundary is inclusive: >= 35
      [34.9, 'WARM'],
      [30, 'WARM'],
      [22, 'WARM'], // cold boundary is inclusive on the warm side: >= 22
      [21.9, 'COLD'],
      [0, 'COLD'],
      [-10, 'COLD'],
    ])('classifies %d°C as %s', (celsius, expected) => {
      expect(classifyTemperature(celsius, thresholds)).toBe(expected);
    });
  });

  describe('with custom thresholds, proving the rule is parameterized', () => {
    const thresholds = Thresholds.create(0, 10);

    it.each<[number, ReturnType<typeof classifyTemperature>]>([
      [-5, 'COLD'],
      [0, 'WARM'], // 0 is no longer cold under these thresholds
      [5, 'WARM'],
      [10, 'HOT'], // 10 is now hot under these thresholds
    ])('classifies %d°C as %s', (celsius, expected) => {
      expect(classifyTemperature(celsius, thresholds)).toBe(expected);
    });
  });
});
