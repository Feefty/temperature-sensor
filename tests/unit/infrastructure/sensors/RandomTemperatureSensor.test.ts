import { describe, it, expect } from 'vitest';
import { RandomTemperatureSensor } from '../../../../src/infrastructure/sensors/RandomTemperatureSensor';

describe('RandomTemperatureSensor', () => {
  it('should return a temperature between -20 and 50', async () => {
    const sensor = new RandomTemperatureSensor();

    for (let i = 0; i < 100; i++) {
      const temp = await sensor.read();
      expect(temp).toBeGreaterThanOrEqual(-20);
      expect(temp).toBeLessThanOrEqual(50);
    }
  });

  it('should return temperature with one decimal place', async () => {
    const sensor = new RandomTemperatureSensor();

    for (let i = 0; i < 50; i++) {
      const temp = await sensor.read();
      const decimalPlaces = (temp.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(1);
    }
  });
});
