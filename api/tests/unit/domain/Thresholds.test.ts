import { createThresholds, DEFAULT_THRESHOLDS } from '../../../src/domain/value-objects/Thresholds';
import { DomainError, ThresholdsInvariantError } from '../../../src/domain/errors/DomainError';

describe('createThresholds', () => {
  it('creates thresholds when coldMax is below hotMin', () => {
    expect(createThresholds(22, 35)).toEqual({ coldMax: 22, hotMin: 35 });
  });

  it('defaults to 22 cold and 35 hot', () => {
    expect(DEFAULT_THRESHOLDS).toEqual({ coldMax: 22, hotMin: 35 });
  });

  it('rejects equal bounds', () => {
    expect(() => createThresholds(30, 30)).toThrow(ThresholdsInvariantError);
  });

  it('rejects coldMax greater than hotMin', () => {
    expect(() => createThresholds(40, 35)).toThrow(ThresholdsInvariantError);
  });

  it.each([NaN, Infinity, -Infinity])('rejects non-finite coldMax %p', (value) => {
    expect(() => createThresholds(value, 35)).toThrow(ThresholdsInvariantError);
  });

  it.each([NaN, Infinity, -Infinity])('rejects non-finite hotMin %p', (value) => {
    expect(() => createThresholds(22, value)).toThrow(ThresholdsInvariantError);
  });

  it('throws a ThresholdsInvariantError that is also a DomainError', () => {
    expect(new ThresholdsInvariantError('boom')).toBeInstanceOf(DomainError);
  });
});
