import { TemperatureSensorPort } from '../../application/ports/temperature-sensor.port';

const MINIMUM_RANDOM_TEMPERATURE = -10;
const MAXIMUM_RANDOM_TEMPERATURE = 45;
const FIXED_TEMPERATURE_ENVIRONMENT_KEY = 'TEMPERATURE_SENSOR_FIXED_VALUE';

type Environment = Readonly<Record<string, string | undefined>>;

export class InvalidFixedTemperatureError extends Error {
  constructor(environmentKey: string, configuredValue: string) {
    super(
      `${environmentKey} must contain a finite number; received ${JSON.stringify(configuredValue)}`,
    );
    this.name = 'InvalidFixedTemperatureError';
  }
}

export class ConfigurableTemperatureSensorAdapter
  implements TemperatureSensorPort
{
  constructor(
    private readonly environment: Environment,
    private readonly random: () => number,
  ) {}

  async readTemperature(): Promise<number> {
    const fixedValue: string | undefined =
      this.environment[FIXED_TEMPERATURE_ENVIRONMENT_KEY];

    if (fixedValue !== undefined) {
      return this.parseFixedTemperature(fixedValue);
    }

    return (
      MINIMUM_RANDOM_TEMPERATURE +
      this.random() *
        (MAXIMUM_RANDOM_TEMPERATURE - MINIMUM_RANDOM_TEMPERATURE)
    );
  }

  private parseFixedTemperature(fixedValue: string): number {
    const temperature: number = Number(fixedValue);

    if (fixedValue.trim() === '' || !Number.isFinite(temperature)) {
      throw new InvalidFixedTemperatureError(
        FIXED_TEMPERATURE_ENVIRONMENT_KEY,
        fixedValue,
      );
    }

    return temperature;
  }
}
