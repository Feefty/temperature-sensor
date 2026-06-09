import { GetTemperatureHistory } from './application/GetTemperatureHistory';
import { ReadTemperature } from './application/ReadTemperature';
import { UpdateThresholds } from './application/UpdateThresholds';
import { Clock } from './domain/time/Clock';
import { Thresholds } from './domain/temperature/Thresholds';
import { createApp } from './infrastructure/http/createApp';
import { InMemoryTemperatureHistoryRepository } from './infrastructure/persistence/InMemoryTemperatureHistoryRepository';
import { InMemoryThresholdsRepository } from './infrastructure/persistence/InMemoryThresholdsRepository';
import { RandomTemperatureSensor } from './infrastructure/sensor/RandomTemperatureSensor';

// Configuration lives only here, at the composition root: the required 15-item
// history window, the simulated sensor range, and the listen port.
const PORT = Number(process.env.PORT) || 3000;
const HISTORY_SIZE = 15;
const SENSOR_MIN_CELSIUS = -10;
const SENSOR_MAX_CELSIUS = 50;

// The single place where concrete adapters are bound to the ports.
const sensor = new RandomTemperatureSensor(SENSOR_MIN_CELSIUS, SENSOR_MAX_CELSIUS);
const historyRepository = new InMemoryTemperatureHistoryRepository(HISTORY_SIZE);
const thresholdsRepository = new InMemoryThresholdsRepository(Thresholds.default());
const clock: Clock = () => new Date();

const app = createApp({
  readTemperature: new ReadTemperature(sensor, thresholdsRepository, historyRepository, clock),
  getTemperatureHistory: new GetTemperatureHistory(historyRepository),
  updateThresholds: new UpdateThresholds(thresholdsRepository),
});

app.listen(PORT, () => {
  console.log(`Temperature sensor API listening on port ${PORT}`);
});
