import { createApp } from './infrastructure/http/app';
import { TemperatureController } from './infrastructure/http/controllers/TemperatureController';
import { CaptureTemperatureUseCase } from './application/use-cases/CaptureTemperatureUseCase';
import { InMemoryTemperatureHistoryRepository } from './infrastructure/repositories/InMemoryTemperatureHistoryRepository';

const app = createApp();

const sensor = {
  getTemperature: async () => 25,
};

const repo = new InMemoryTemperatureHistoryRepository();

const thresholds = {
  coldMax: 22,
  hotMin: 35,
};

const useCase = new CaptureTemperatureUseCase(sensor, repo, thresholds);

const controller = new TemperatureController(useCase);

app.get('/temperature/capture', controller.capture);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});