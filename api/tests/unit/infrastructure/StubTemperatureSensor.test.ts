import { StubTemperatureSensor } from '../../../src/infrastructure/sensor/StubTemperatureSensor';

describe('StubTemperatureSensor', () => {
  it('returns a finite temperature within the simulated range', async () => {
    const sensor = new StubTemperatureSensor();

    for (let i = 0; i < 50; i += 1) {
      const value = await sensor.read();
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(-10);
      expect(value).toBeLessThanOrEqual(50);
    }
  });
});
