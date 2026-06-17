import { Temperature } from "@domain/Temperature.ts";

describe("Temperature", () => {
  it("creates a valid temperature from celsius", () => {
    const temp = Temperature.fromCelsius(25);
    expect(temp.celsius).toBe(25);
  });

  it("accepts negative temperatures", () => {
    const temp = Temperature.fromCelsius(-10);
    expect(temp.celsius).toBe(-10);
  });

  it("throws for non-numeric values", () => {
    expect(() => Temperature.fromCelsius(NaN)).toThrow();
  });

  it("throws for temperatures below absolute zero", () => {
    expect(() => Temperature.fromCelsius(-300)).toThrow();
  });
});
