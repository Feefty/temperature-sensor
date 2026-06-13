import {
  createThresholds,
  InvalidThresholdRangeError,
  InvalidThresholdValueError,
} from './thresholds';

describe('Thresholds', () => {
  it.each([
    ['coldThreshold', Number.NaN, 35],
    ['coldThreshold', Number.NEGATIVE_INFINITY, 35],
    ['hotThreshold', 22, Number.POSITIVE_INFINITY],
  ])(
    'rejects a non-finite %s',
    (
      expectedThresholdName: string,
      coldThreshold: number,
      hotThreshold: number,
    ): void => {
      expect(() => createThresholds(coldThreshold, hotThreshold)).toThrow(
        InvalidThresholdValueError,
      );
      expect(() => createThresholds(coldThreshold, hotThreshold)).toThrow(
        expectedThresholdName,
      );
    },
  );

  it.each([
    [22, 22],
    [23, 22],
  ])(
    'rejects coldThreshold=%s and hotThreshold=%s when cold is not lower than hot',
    (coldThreshold: number, hotThreshold: number): void => {
      expect(() => createThresholds(coldThreshold, hotThreshold)).toThrow(
        InvalidThresholdRangeError,
      );
    },
  );

  it('rejects a threshold range below the minimum', (): void => {
    expect(() => createThresholds(22, 23.9)).toThrow(
      InvalidThresholdRangeError,
    );
  });

  it('accepts a threshold range equal to the minimum', (): void => {
    expect(createThresholds(22, 24)).toEqual({
      coldThreshold: 22,
      hotThreshold: 24,
    });
  });
});
