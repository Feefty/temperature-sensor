import { classifyTemperature } from "@domain/entities/Threshold";
import { SensorState } from "@domain/entities/SensorState";

describe("classifyTemperature", () => {
  const defaultThreshold = { coldMax: 22, hotMin: 35 };

  it("should return HOT when temperature is exactly 35", () => {
    expect(classifyTemperature(35, defaultThreshold)).toBe(SensorState.HOT);
  });

  it("should return HOT when temperature is above 35", () => {
    expect(classifyTemperature(50, defaultThreshold)).toBe(SensorState.HOT);
  });

  it("should return WARM when temperature is 34.9", () => {
    expect(classifyTemperature(34.9, defaultThreshold)).toBe(SensorState.WARM);
  });

  it("should return WARM when temperature is exactly 22", () => {
    expect(classifyTemperature(22, defaultThreshold)).toBe(SensorState.WARM);
  });

  it("should return COLD when temperature is 21.9", () => {
    expect(classifyTemperature(21.9, defaultThreshold)).toBe(SensorState.COLD);
  });

  it("should return COLD when temperature is -10", () => {
    expect(classifyTemperature(-10, defaultThreshold)).toBe(SensorState.COLD);
  });

  it("should work with custom thresholds", () => {
    const customThreshold = { coldMax: 10, hotMin: 30 };

    expect(classifyTemperature(30, customThreshold)).toBe(SensorState.HOT);
    expect(classifyTemperature(29.9, customThreshold)).toBe(SensorState.WARM);
    expect(classifyTemperature(10, customThreshold)).toBe(SensorState.WARM);
    expect(classifyTemperature(9.9, customThreshold)).toBe(SensorState.COLD);
  });
});
