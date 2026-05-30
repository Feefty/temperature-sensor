import { DomainError } from '../errors/DomainError';

declare const brand: unique symbol;

export type Temperature = number & { readonly [brand]: 'Temperature' };

export function createTemperature(celsius: number): Temperature {
  if (!Number.isFinite(celsius)) {
    throw new DomainError(`Temperature must be a finite number, received ${celsius}`);
  }
  return celsius as Temperature;
}
