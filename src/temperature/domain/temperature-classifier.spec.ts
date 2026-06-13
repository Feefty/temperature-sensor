import {
  classifyTemperature,
  InvalidTemperatureError,
} from './temperature-classifier';
import { createThresholds, Thresholds } from './thresholds';

describe('classifyTemperature', () => {
  const thresholds: Thresholds = createThresholds(22, 35);

  it.each([
    [21.9, 'COLD'],
    [22, 'WARM'],
    [30, 'WARM'],
    [35, 'HOT'],
    [35.1, 'HOT'],
  ] as const)(
    'classifies %s as %s',
    (temperature, expectedState): void => {
      expect(classifyTemperature(temperature, thresholds)).toBe(expectedState);
    },
  );

  it.each([Number.NaN, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY])(
    'rejects non-finite temperature %s',
    (temperature: number): void => {
      expect(() => classifyTemperature(temperature, thresholds)).toThrow(
        InvalidTemperatureError,
      );
    },
  );
});
