import { createApp } from './infrastructure/http/app';
import { TemperatureController } from './infrastructure/http/controllers/TemperatureController';

import { CaptureTemperatureUseCase } from './application/use-cases/CaptureTemperatureUseCase';
import { GetTemperatureHistoryUseCase } from './application/use-cases/GetTemperatureHistoryUseCase';
import { UpdateThresholdsUseCase } from './application/use-cases/UpdateThresholdsUseCase';

import { InMemoryTemperatureRepository } from './infrastructure/repositories/InMemoryTemperatureRepository';
import { InMemoryThresholdRepository } from './infrastructure/repositories/InMemoryThresholdRepository';

const app = createApp();

const sensor = {
  getTemperature: async () => Math.floor(Math.random() * 50),
};

// repositories
const temperatureRepo = new InMemoryTemperatureRepository();
const thresholdRepo = new InMemoryThresholdRepository();

// use cases
const captureUseCase = new CaptureTemperatureUseCase(
  sensor,
  temperatureRepo,
  thresholdRepo
);

const historyUseCase = new GetTemperatureHistoryUseCase(temperatureRepo);

const updateThresholdsUseCase = new UpdateThresholdsUseCase(thresholdRepo);

// controller
const controller = new TemperatureController(
  captureUseCase,
  historyUseCase,
  updateThresholdsUseCase
);

// routes
app.get('/temperature/capture', controller.capture);
app.get('/temperature/history', controller.history);
app.put('/temperature/thresholds', controller.updateThresholds);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});