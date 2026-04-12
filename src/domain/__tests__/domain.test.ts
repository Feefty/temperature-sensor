import { Thresholds } from "../entities/thresholds";
import { TemperatureReading } from "../entities/temperature-reading";
import { SensorState } from "../value-objects/sensor-state";
import { InvalidThresholdError } from "../../shared/errors/invalid-threshold.error";

describe("Thresholds", () => {
  describe("constructor", () => {
    it("should create with default values (hot=35, cold=22)", () => {
      const t = new Thresholds();
      expect(t.hotThreshold).toBe(35);
      expect(t.coldThreshold).toBe(22);
    });

    it("should create with custom valid values", () => {
      const t = new Thresholds(40, 10);
      expect(t.hotThreshold).toBe(40);
      expect(t.coldThreshold).toBe(10);
    });

    it("should throw InvalidThresholdError when cold >= hot", () => {
      expect(() => new Thresholds(20, 30)).toThrow(InvalidThresholdError);
    });

    it("should throw InvalidThresholdError when cold === hot", () => {
      expect(() => new Thresholds(25, 25)).toThrow(InvalidThresholdError);
    });
  });

  describe("computeState()", () => {
    const thresholds = new Thresholds();

    it("should return HOT when temperature >= hotThreshold (e.g. 40)", () => {
      expect(thresholds.computeState(40)).toBe(SensorState.HOT);
    });

    it("should return HOT at exactly hotThreshold (35)", () => {
      expect(thresholds.computeState(35)).toBe(SensorState.HOT);
    });

    it("should return COLD when temperature < coldThreshold (e.g. 10)", () => {
      expect(thresholds.computeState(10)).toBe(SensorState.COLD);
    });

    it("should return WARM at exactly coldThreshold (22)", () => {
      expect(thresholds.computeState(22)).toBe(SensorState.WARM);
    });

    it("should return WARM for temperature between cold and hot (e.g. 28)", () => {
      expect(thresholds.computeState(28)).toBe(SensorState.WARM);
    });

    it("should return COLD at just below coldThreshold (21.9)", () => {
      expect(thresholds.computeState(21.9)).toBe(SensorState.COLD);
    });

    it("should return WARM at just below hotThreshold (34.9)", () => {
      expect(thresholds.computeState(34.9)).toBe(SensorState.WARM);
    });
  });
});

describe("TemperatureReading", () => {
  describe("create()", () => {
    const thresholds = new Thresholds();

    it("should create a HOT reading for temperature >= 35", () => {
      const reading = TemperatureReading.create(42, thresholds);
      expect(reading.temperature).toBe(42);
      expect(reading.state).toBe(SensorState.HOT);
    });

    it("should create a WARM reading for temperature between 22 and 35", () => {
      const reading = TemperatureReading.create(28, thresholds);
      expect(reading.temperature).toBe(28);
      expect(reading.state).toBe(SensorState.WARM);
    });

    it("should create a COLD reading for temperature < 22", () => {
      const reading = TemperatureReading.create(5, thresholds);
      expect(reading.temperature).toBe(5);
      expect(reading.state).toBe(SensorState.COLD);
    });

    it("should use the provided thresholds for state computation", () => {
      const custom = new Thresholds(50, 40);
      const reading = TemperatureReading.create(42, custom);
      expect(reading.state).toBe(SensorState.WARM);
    });
  });
});
