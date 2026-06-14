import { validateThresholds } from '../../src/validation/threshold.validator';
import { ValidationException } from '../../../domain-contract/exceptions/validation.exception';

describe('ThresholdValidator', () => {
  it.each([
    ['normal range', 20, 35],
    ['boundary values', -50, 60],
    ['close values', 22, 23],
  ])('validateThresholds_shouldPass_when%s', (_label, coldMax, hotMin) => {
    expect(() => validateThresholds(coldMax, hotMin)).not.toThrow();
  });

  it.each([
    ['coldMax >= hotMin', 35, 20],
    ['coldMax equals hotMin', 30, 30],
    ['coldMax below minimum bound (-50)', -55, 35],
    ['hotMin above maximum bound (60)', 20, 65],
  ])('validateThresholds_shouldThrowValidationException_when%s', (_label, coldMax, hotMin) => {
    expect(() => validateThresholds(coldMax, hotMin)).toThrow(ValidationException);
  });
});
