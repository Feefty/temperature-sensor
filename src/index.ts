import { TemperatureService } from "@application/TemperatureService.ts";
import { RandomTemperatureSensor } from "@infrastructure/sensor/RandomTemperatureSensor.ts";
import { InMemoryTemperatureRepository } from "@infrastructure/persistence/InMemoryTemperatureRepository.ts";
import { InMemoryThresholdsRepository } from "@infrastructure/persistence/InMemoryThresholdsRepository.ts";
import { createServer } from "@infrastructure/web/server.ts";

const temperatureSensor = new RandomTemperatureSensor();
const temperatureRepository = new InMemoryTemperatureRepository();
const thresholdsRepository = new InMemoryThresholdsRepository();

const temperatureService = new TemperatureService(
  temperatureSensor,
  temperatureRepository,
  thresholdsRepository,
);

const app = createServer(temperatureService);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port);

console.log(`🔄 Temperature sensor API running on http://localhost:${port}`);
