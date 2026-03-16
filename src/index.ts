import { createApp } from './infrastructure/http/app';
import { InMemoryHistoryRepository } from './infrastructure/persistence/in-memory-history-repository';
import { InMemoryThresholdsRepository } from './infrastructure/persistence/in-memory-thresholds-repository';
import { FakeTemperatureSensor } from './infrastructure/sensor/fake-temperature-sensor';
import type { GetTemperatureDeps } from './application/get-temperature';
import type { GetHistoryDeps } from './application/get-history';
import type { GetThresholdsDeps } from './application/get-thresholds';
import type { SetThresholdsDeps } from './application/set-thresholds';

const historyRepository = new InMemoryHistoryRepository();
const thresholdsRepository = new InMemoryThresholdsRepository();
const fakeTemperatureSensor = new FakeTemperatureSensor();

const getTemperatureDeps: GetTemperatureDeps = {
  getTemperatureFromSensor: () => fakeTemperatureSensor.read(),
  getThresholds: () => thresholdsRepository.get(),
  saveToHistory: (entry) => historyRepository.save(entry),
};

const getHistoryDeps: GetHistoryDeps = {
  getLastEntries: (count) => historyRepository.getLast(count),
};

const getThresholdsDeps: GetThresholdsDeps = {
  getThresholds: () => thresholdsRepository.get(),
};

const setThresholdsDeps: SetThresholdsDeps = {
  setThresholds: (thresholds) => thresholdsRepository.set(thresholds),
};

const app = createApp({
  getTemperatureDeps,
  getHistoryDeps,
  getThresholdsDeps,
  setThresholdsDeps,
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port);
