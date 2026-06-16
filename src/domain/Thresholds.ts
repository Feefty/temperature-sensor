import { minValue, number, object, pipe, safeParse } from "valibot";
import type { SensorState } from "./SensorState.ts";

const thresholdsSchema = object({
  coldThreshold: pipe(number(), minValue(-273.15)),
  hotThreshold: pipe(number(), minValue(-273.15)),
});

export class Thresholds {
  readonly coldThreshold: number;
  readonly hotThreshold: number;

  private constructor(coldThreshold: number, hotThreshold: number) {
    this.coldThreshold = coldThreshold;
    this.hotThreshold = hotThreshold;
  }

  static create(coldThreshold: number, hotThreshold: number): Thresholds {
    const result = safeParse(thresholdsSchema, { coldThreshold, hotThreshold });
    if (!result.success) {
      throw new Error(
        `Invalid thresholds: cold=${coldThreshold}, hot=${hotThreshold}. Must be numbers >= -273.15.`,
      );
    }
    if (coldThreshold >= hotThreshold) {
      throw new Error(
        `Invalid thresholds: cold threshold (${coldThreshold}) must be less than hot threshold (${hotThreshold}).`,
      );
    }
    return new Thresholds(
      result.output.coldThreshold,
      result.output.hotThreshold,
    );
  }

  static default(): Thresholds {
    return new Thresholds(22, 35);
  }

  determineState(temperatureCelsius: number): SensorState {
    if (temperatureCelsius >= this.hotThreshold) return "HOT";
    if (temperatureCelsius < this.coldThreshold) return "COLD";
    return "WARM";
  }

  toObject(): { coldThreshold: number; hotThreshold: number } {
    return {
      coldThreshold: this.coldThreshold,
      hotThreshold: this.hotThreshold,
    };
  }
}
