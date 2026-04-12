import { ThresholdsService } from "../../application/services/thresholds.service";
import { CaptureTemperatureUseCase } from "../../application/use-cases/get-temperature.use-case";
import { GetHistoryUseCase } from "../../application/use-cases/get-history.use-case";
import { UpdateThresholdsUseCase } from "../../application/use-cases/update-thresholds.use-case";
import { TemperatureSensorAdapter } from "../adapters/outbound/temperature-sensor.adapter";
import { InMemoryReadingRepository } from "../adapters/outbound/in-memory-reading.repository";
import { TemperatureController } from "../adapters/inbound/temperature.controller";
import { createTemperatureRouter } from "../adapters/inbound/temperature.routes";
import { createApp } from "./app";

const sensor = new TemperatureSensorAdapter();
const repository = new InMemoryReadingRepository();
const thresholdsService = new ThresholdsService();

const captureUseCase = new CaptureTemperatureUseCase(sensor, repository, thresholdsService);
const historyUseCase = new GetHistoryUseCase(repository);
const updateThresholdsUseCase = new UpdateThresholdsUseCase(thresholdsService);

const controller = new TemperatureController(captureUseCase, historyUseCase, updateThresholdsUseCase);
const router = createTemperatureRouter(controller);
const app = createApp(router);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`APIrunning on http://localhost:${PORT}`);
});
