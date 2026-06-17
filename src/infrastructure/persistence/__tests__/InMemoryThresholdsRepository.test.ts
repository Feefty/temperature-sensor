import { InMemoryThresholdsRepository } from "@infrastructure/persistence/InMemoryThresholdsRepository.ts";
import { Thresholds } from "@domain/Thresholds.ts";

describe("InMemoryThresholdsRepository", () => {
  describe("get", () => {
    it("returns default thresholds on first call", async () => {
      const repo = new InMemoryThresholdsRepository();

      const result = await repo.get();

      expect(result.coldThreshold).toBe(22);
      expect(result.hotThreshold).toBe(35);
    });
  });

  describe("update", () => {
    it("persists new thresholds", async () => {
      const repo = new InMemoryThresholdsRepository();
      const updated = Thresholds.create(10, 40);

      await repo.update(updated);
      const result = await repo.get();

      expect(result.coldThreshold).toBe(10);
      expect(result.hotThreshold).toBe(40);
    });

    it("overrides previous thresholds on subsequent updates", async () => {
      const repo = new InMemoryThresholdsRepository();

      await repo.update(Thresholds.create(5, 25));
      await repo.update(Thresholds.create(15, 45));
      const result = await repo.get();

      expect(result.coldThreshold).toBe(15);
      expect(result.hotThreshold).toBe(45);
    });
  });
});
