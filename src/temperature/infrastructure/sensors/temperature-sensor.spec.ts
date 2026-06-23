import {
  InvalidFixedTemperatureError,
  TemperatureSensor,
} from './temperature-sensor';

describe('TemperatureSensor', () => {
  it('returns the configured fixed temperature', (): void => {
    const sensor = new TemperatureSensor(
      { TEMPERATURE_SENSOR_FIXED_VALUE: '21.5' },
      (): number => 0.5,
    );

    expect(sensor.measureTemperature()).toBe(21.5);
  });

  it.each(['not-a-number', '', 'Infinity'])(
    'rejects invalid fixed temperature %j',
    (fixedTemperature: string): void => {
      const sensor = new TemperatureSensor(
        { TEMPERATURE_SENSOR_FIXED_VALUE: fixedTemperature },
        (): number => 0.5,
      );

      expect((): number => sensor.measureTemperature()).toThrow(
        InvalidFixedTemperatureError,
      );
    },
  );

  it('returns a temperature in the configured random range when no fixed value exists', (): void => {
    const sensor = new TemperatureSensor({}, (): number => 0.5);

    expect(sensor.measureTemperature()).toBe(17.5);
  });
});
