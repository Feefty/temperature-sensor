import { minValue, number, pipe, safeParse } from "valibot";

export class Temperature {
  private constructor(readonly celsius: number) {}

  static fromCelsius(value: number): Temperature {
    const schema = pipe(number(), minValue(-273.15));
    const result = safeParse(schema, value);
    if (!result.success) {
      throw new Error(
        `Invalid temperature: ${value}. Must be a number >= -273.15°C.`,
      );
    }
    return new Temperature(result.output);
  }
}
