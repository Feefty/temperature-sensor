import { validateThresholds } from '../../src/validation/threshold.validator';
import { ValidationException } from '../../../domain-contract/exceptions/validation.exception';

describe('ThresholdValidator', () => {
  //region Valid scenarios
  it.each([
    ['normal range', 20, 35],
    ['boundary values', -50, 60],
    ['close values', 22, 23],
  ])('validateThresholds_shouldPass_when%s', (_label, coldMax, hotMin) => {
    expect(() => validateThresholds(coldMax, hotMin)).not.toThrow();
  });
  //endregion

  //region Invalid scenarios
  it.each([
    ['coldMax > hotMin', 35, 20, 'must be less than hotMin'],
    ['coldMax equals hotMin', 30, 30, 'must not equal hotMin'],
    ['coldMax below minimum bound (-50)', -55, 35, 'must be between -50 and 60'],
    ['hotMin above maximum bound (60)', 20, 65, 'must be between -50 and 60'],
  ])(
    'validateThresholds_shouldThrowValidationException_when%s',
    (_label, coldMax, hotMin, expectedMessage) => {
      expect(() => validateThresholds(coldMax, hotMin)).toThrow(ValidationException);
      expect(() => validateThresholds(coldMax, hotMin)).toThrow(expectedMessage);
    },
  );
  //endregion
});
