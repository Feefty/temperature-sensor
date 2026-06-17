import { Database } from "bun:sqlite";
import type { TemperatureReading } from "@domain/TemperatureReading.ts";
import type { TemperatureRepositoryPort } from "@domain/ports/TemperatureRepositoryPort.ts";

export class SqliteTemperatureRepository implements TemperatureRepositoryPort {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
    this.db.run(`
      CREATE TABLE IF NOT EXISTS temperature_readings (
        id TEXT PRIMARY KEY,
        temperature_celsius REAL NOT NULL,
        state TEXT NOT NULL,
        timestamp TEXT NOT NULL
      )
    `);
  }

  async save(reading: TemperatureReading): Promise<void> {
    this.db.run(
      "INSERT INTO temperature_readings (id, temperature_celsius, state, timestamp) VALUES (?, ?, ?, ?)",
      [
        reading.id,
        reading.temperatureCelsius,
        reading.state,
        reading.timestamp,
      ],
    );
  }

  async findLast(count: number): Promise<TemperatureReading[]> {
    const rows = this.db
      .query(
        "SELECT id, temperature_celsius, state, timestamp FROM temperature_readings ORDER BY timestamp DESC LIMIT ?",
      )
      .all(count) as {
      id: string;
      temperature_celsius: number;
      state: string;
      timestamp: string;
    }[];
    return rows.map((r) => ({
      id: r.id,
      temperatureCelsius: r.temperature_celsius,
      state: r.state as TemperatureReading["state"],
      timestamp: r.timestamp,
    }));
  }
}
