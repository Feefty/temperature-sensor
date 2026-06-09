import { RandomTemperatureSensor } from '../../../src/infrastructure/sensor/RandomTemperatureSensor';

describe('RandomTemperatureSensor', () => {
  it('returns the minimum when the RNG yields 0', async () => {
    const sensor = new RandomTemperatureSensor(-10, 50, () => 0);

    expect(await sensor.read()).toBe(-10);
  });

  it('returns the midpoint when the RNG yields 0.5', async () => {
    const sensor = new RandomTemperatureSensor(0, 40, () => 0.5);

    expect(await sensor.read()).toBe(20);
  });

  it('stays within [min, max) using the default random source', async () => {
    const sensor = new RandomTemperatureSensor(-10, 50);

    for (let i = 0; i < 1000; i++) {
      const celsius = await sensor.read();
      expect(celsius).toBeGreaterThanOrEqual(-10);
      expect(celsius).toBeLessThan(50);
    }
  });

  it('rejects an inverted range', () => {
    expect(() => new RandomTemperatureSensor(50, -10)).toThrow();
  });
});
