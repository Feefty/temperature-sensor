import { describe, it, expect } from 'vitest';
import { Temperature } from '../../../../src/domain/entities/Temperature';
import { TemperatureState } from '../../../../src/domain/entities/TemperatureState';

describe('Temperature Entity', () => {
  it('should create a temperature with all properties', () => {
    const id = '123';
    const value = 25.5;
    const state = TemperatureState.WARM;
    const timestamp = new Date();

    const temperature = Temperature.create(id, value, state, timestamp);

    expect(temperature.id).toBe(id);
    expect(temperature.value).toBe(value);
    expect(temperature.state).toBe(state);
    expect(temperature.timestamp).toBe(timestamp);
  });

  it('should create a temperature with default timestamp', () => {
    const before = new Date();
    const temperature = Temperature.create('123', 25, TemperatureState.WARM);
    const after = new Date();

    expect(temperature.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(temperature.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});
