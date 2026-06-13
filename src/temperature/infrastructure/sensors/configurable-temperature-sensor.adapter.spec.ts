import {
  ConfigurableTemperatureSensorAdapter,
  InvalidFixedTemperatureError,
} from './configurable-temperature-sensor.adapter';

describe('ConfigurableTemperatureSensorAdapter', () => {
  it('returns the configured fixed temperature', async (): Promise<void> => {
    const sensor = new ConfigurableTemperatureSensorAdapter(
      { TEMPERATURE_SENSOR_FIXED_VALUE: '21.5' },
      (): number => 0.5,
    );

    await expect(sensor.readTemperature()).resolves.toBe(21.5);
  });

  it.each(['not-a-number', '', 'Infinity'])(
    'rejects invalid fixed temperature %j',
    async (fixedTemperature: string): Promise<void> => {
      const sensor = new ConfigurableTemperatureSensorAdapter(
        { TEMPERATURE_SENSOR_FIXED_VALUE: fixedTemperature },
        (): number => 0.5,
      );

      await expect(sensor.readTemperature()).rejects.toBeInstanceOf(
        InvalidFixedTemperatureError,
      );
    },
  );

  it('returns a temperature in the configured random range when no fixed value exists', async (): Promise<void> => {
    const sensor = new ConfigurableTemperatureSensorAdapter(
      {},
      (): number => 0.5,
    );

    await expect(sensor.readTemperature()).resolves.toBe(17.5);
  });
});
