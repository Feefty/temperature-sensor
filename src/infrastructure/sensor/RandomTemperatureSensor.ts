import { TemperatureSensor } from '../../domain/ports/TemperatureSensor';
import { Celsius } from '../../domain/temperature/Celsius';

/**
 * Concrete {@link TemperatureSensor} standing in for real hardware: it returns
 * a temperature drawn uniformly from `[min, max)`. The random source is
 * injected (defaulting to `Math.random`) so reads are deterministic in tests.
 */
export class RandomTemperatureSensor implements TemperatureSensor {
  constructor(
    private readonly min: Celsius,
    private readonly max: Celsius,
    private readonly random: () => number = Math.random,
  ) {
    if (!(min < max)) {
      throw new Error(`sensor range requires min < max (received min=${min}, max=${max})`);
    }
  }

  async read(): Promise<Celsius> {
    return this.min + (this.max - this.min) * this.random();
  }
}
