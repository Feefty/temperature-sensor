import { InvalidThresholdsError } from '../errors/InvalidThresholdsError';
import { Celsius } from './Celsius';

/**
 * Default boundaries from the specification. These two numbers are the single
 * source of the 22 / 35 magic values; nothing else in the codebase hard-codes
 * a threshold.
 */
const DEFAULT_COLD_BOUNDARY: Celsius = 22;
const DEFAULT_HOT_BOUNDARY: Celsius = 35;

/**
 * Immutable value object holding the two boundaries that partition the
 * temperature range:
 *
 *   COLD  when  celsius < cold
 *   WARM  when  cold <= celsius < hot
 *   HOT   when  celsius >= hot
 *
 * The invariant `cold < hot` is enforced at construction, so a `Thresholds`
 * instance is always valid by existence.
 */
export class Thresholds {
  private constructor(
    readonly cold: Celsius,
    readonly hot: Celsius,
  ) {}

  static create(cold: Celsius, hot: Celsius): Thresholds {
    if (!Number.isFinite(cold) || !Number.isFinite(hot)) {
      throw new InvalidThresholdsError(
        `thresholds must be finite numbers (received cold=${cold}, hot=${hot})`,
      );
    }
    if (cold >= hot) {
      throw new InvalidThresholdsError(
        `cold boundary (${cold}) must be less than hot boundary (${hot})`,
      );
    }
    return new Thresholds(cold, hot);
  }

  static default(): Thresholds {
    return Thresholds.create(DEFAULT_COLD_BOUNDARY, DEFAULT_HOT_BOUNDARY);
  }
}
