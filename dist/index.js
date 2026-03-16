"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./infrastructure/http/app");
const in_memory_history_repository_1 = require("./infrastructure/persistence/in-memory-history-repository");
const in_memory_thresholds_repository_1 = require("./infrastructure/persistence/in-memory-thresholds-repository");
const fake_temperature_sensor_1 = require("./infrastructure/sensor/fake-temperature-sensor");
const historyRepository = new in_memory_history_repository_1.InMemoryHistoryRepository();
const thresholdsRepository = new in_memory_thresholds_repository_1.InMemoryThresholdsRepository();
const fakeTemperatureSensor = new fake_temperature_sensor_1.FakeTemperatureSensor();
const getTemperatureDeps = {
    getTemperatureFromSensor: () => fakeTemperatureSensor.read(),
    getThresholds: () => thresholdsRepository.get(),
    saveToHistory: (entry) => historyRepository.save(entry),
};
const getHistoryDeps = {
    getLastEntries: (count) => historyRepository.getLast(count),
};
const getThresholdsDeps = {
    getThresholds: () => thresholdsRepository.get(),
};
const setThresholdsDeps = {
    setThresholds: (thresholds) => thresholdsRepository.set(thresholds),
};
const app = (0, app_1.createApp)({
    getTemperatureDeps,
    getHistoryDeps,
    getThresholdsDeps,
    setThresholdsDeps,
});
const port = Number(process.env.PORT ?? 3000);
app.listen(port);
