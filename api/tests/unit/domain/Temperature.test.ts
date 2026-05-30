import { createTemperature } from '../../../src/domain/value-objects/Temperature';
import { DomainError } from '../../../src/domain/errors/DomainError';

describe('createTemperature', () => {
  it('accepts a normal celsius value', () => {
    expect(createTemperature(21.5)).toBe(21.5);
  });

  it('accepts zero and negative values', () => {
    expect(createTemperature(0)).toBe(0);
    expect(createTemperature(-40)).toBe(-40);
  });

  it.each([NaN, Infinity, -Infinity])('rejects the non-finite value %p', (value) => {
    expect(() => createTemperature(value)).toThrow(DomainError);
  });
});
