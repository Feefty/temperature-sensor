import { Database } from "bun:sqlite";
import { Thresholds } from "@domain/Thresholds.ts";
import type { ThresholdsRepositoryPort } from "@domain/ports/ThresholdsRepositoryPort.ts";

export class SqliteThresholdsRepository implements ThresholdsRepositoryPort {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
    this.db.run(`
      CREATE TABLE IF NOT EXISTS thresholds (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        cold_threshold REAL NOT NULL,
        hot_threshold REAL NOT NULL
      )
    `);
    const row = this.db.query("SELECT id FROM thresholds WHERE id = 1").get();
    if (!row) {
      const defaults = Thresholds.default();
      this.db.run(
        "INSERT INTO thresholds (id, cold_threshold, hot_threshold) VALUES (1, ?, ?)",
        [defaults.coldThreshold, defaults.hotThreshold],
      );
    }
  }

  async get(): Promise<Thresholds> {
    const row = this.db
      .query(
        "SELECT cold_threshold, hot_threshold FROM thresholds WHERE id = 1",
      )
      .get() as { cold_threshold: number; hot_threshold: number } | null;
    if (!row) {
      return Thresholds.default();
    }
    return Thresholds.create(row.cold_threshold, row.hot_threshold);
  }

  async update(thresholds: Thresholds): Promise<void> {
    this.db.run(
      "UPDATE thresholds SET cold_threshold = ?, hot_threshold = ? WHERE id = 1",
      [thresholds.coldThreshold, thresholds.hotThreshold],
    );
  }
}
