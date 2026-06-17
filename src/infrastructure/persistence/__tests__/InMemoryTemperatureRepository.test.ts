import { InMemoryTemperatureRepository } from "@infrastructure/persistence/InMemoryTemperatureRepository.ts";
import type { TemperatureReading } from "@domain/TemperatureReading.ts";

function makeReading(
  overrides: Partial<TemperatureReading> = {},
): TemperatureReading {
  return {
    id: crypto.randomUUID(),
    temperatureCelsius: 25,
    state: "WARM",
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

describe("InMemoryTemperatureRepository", () => {
  describe("save", () => {
    it("stores a reading and returns it via findLast", async () => {
      const repo = new InMemoryTemperatureRepository();
      const reading = makeReading();

      await repo.save(reading);
      const last = await repo.findLast(1);

      expect(last).toHaveLength(1);
      expect(last[0]).toEqual(reading);
    });
  });

  describe("findLast", () => {
    it("returns readings in reverse chronological order", async () => {
      const repo = new InMemoryTemperatureRepository();
      const first = makeReading({ temperatureCelsius: 10 });
      const second = makeReading({ temperatureCelsius: 20 });
      const third = makeReading({ temperatureCelsius: 30 });

      await repo.save(first);
      await repo.save(second);
      await repo.save(third);

      const result = await repo.findLast(3);

      expect(result[0]?.temperatureCelsius).toBe(30);
      expect(result[1]?.temperatureCelsius).toBe(20);
      expect(result[2]?.temperatureCelsius).toBe(10);
    });

    it("returns at most the requested count", async () => {
      const repo = new InMemoryTemperatureRepository();

      for (let i = 0; i < 20; i++) {
        await repo.save(makeReading({ temperatureCelsius: i }));
      }

      const result = await repo.findLast(5);

      expect(result).toHaveLength(5);
    });

    it("returns all readings when count exceeds stored count", async () => {
      const repo = new InMemoryTemperatureRepository();

      await repo.save(makeReading());
      await repo.save(makeReading());

      const result = await repo.findLast(10);

      expect(result).toHaveLength(2);
    });

    it("returns empty array when no readings exist", async () => {
      const repo = new InMemoryTemperatureRepository();

      const result = await repo.findLast(15);

      expect(result).toEqual([]);
    });
  });
});
