import { TemperatureSensorAdapter } from './temperature-sensor.adapter';

describe('TemperatureSensorAdapter', () => {
  it('reads the temperature from the external component', async (): Promise<void> => {
    const measureTemperature = jest.fn((): number => 21.5);
    const adapter = new TemperatureSensorAdapter({ measureTemperature });

    await expect(adapter.readTemperature()).resolves.toBe(21.5);
    expect(measureTemperature).toHaveBeenCalledTimes(1);
  });
});
