import { mkdirSync } from "fs";
import { Database } from "bun:sqlite";
import { TemperatureService } from "@application/TemperatureService.ts";
import { RandomTemperatureSensor } from "@infrastructure/sensor/RandomTemperatureSensor.ts";
import { SqliteTemperatureRepository } from "@infrastructure/persistence/SqliteTemperatureRepository.ts";
import { SqliteThresholdsRepository } from "@infrastructure/persistence/SqliteThresholdsRepository.ts";
import { createServer } from "@infrastructure/web/server.ts";

const dbPath = process.env.DATABASE_PATH || "data/sensor.db";
mkdirSync("data", { recursive: true });
const db = new Database(dbPath);

const temperatureSensor = new RandomTemperatureSensor();
const temperatureRepository = new SqliteTemperatureRepository(db);
const thresholdsRepository = new SqliteThresholdsRepository(db);

const temperatureService = new TemperatureService(
  temperatureSensor,
  temperatureRepository,
  thresholdsRepository,
);

const app = createServer(temperatureService);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port);

process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  db.close();
  process.exit(0);
});

console.log(`🔄 Temperature sensor API running on http://localhost:${port}`);
