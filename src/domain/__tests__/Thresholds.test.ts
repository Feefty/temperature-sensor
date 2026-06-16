import { Thresholds } from "@domain/Thresholds.ts";

describe("Thresholds", () => {
  describe("default", () => {
    it("creates default thresholds with cold=22 and hot=35", () => {
      const thresholds = Thresholds.default();
      expect(thresholds.coldThreshold).toBe(22);
      expect(thresholds.hotThreshold).toBe(35);
    });
  });

  describe("create", () => {
    it("creates thresholds with valid values", () => {
      const thresholds = Thresholds.create(10, 30);
      expect(thresholds.coldThreshold).toBe(10);
      expect(thresholds.hotThreshold).toBe(30);
    });

    it("throws when cold threshold >= hot threshold", () => {
      expect(() => Thresholds.create(30, 20)).toThrow();
      expect(() => Thresholds.create(25, 25)).toThrow();
    });

    it("throws when thresholds are below -273.15", () => {
      expect(() => Thresholds.create(-300, 20)).toThrow();
    });
  });

  describe("determineState", () => {
    const thresholds = Thresholds.create(22, 35);

    it("returns COLD when temperature is below cold threshold", () => {
      expect(thresholds.determineState(21)).toBe("COLD");
      expect(thresholds.determineState(-10)).toBe("COLD");
      expect(thresholds.determineState(21.9)).toBe("COLD");
    });

    it("returns HOT when temperature is at or above hot threshold", () => {
      expect(thresholds.determineState(35)).toBe("HOT");
      expect(thresholds.determineState(40)).toBe("HOT");
      expect(thresholds.determineState(100)).toBe("HOT");
    });

    it("returns WARM when temperature is between cold and hot thresholds", () => {
      expect(thresholds.determineState(22)).toBe("WARM");
      expect(thresholds.determineState(30)).toBe("WARM");
      expect(thresholds.determineState(34.9)).toBe("WARM");
    });
  });

  describe("toObject", () => {
    it("returns plain object representation", () => {
      const thresholds = Thresholds.create(10, 40);
      expect(thresholds.toObject()).toEqual({
        coldThreshold: 10,
        hotThreshold: 40,
      });
    });
  });
});
