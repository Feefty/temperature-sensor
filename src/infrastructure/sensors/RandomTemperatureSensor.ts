import { ITemperatureSensor } from '../../application/interfaces/index.js';

const MIN_TEMPERATURE = -20;
const MAX_TEMPERATURE = 50;

export class RandomTemperatureSensor implements ITemperatureSensor {
  async read(): Promise<number> {
    const randomTemp = Math.random() * (MAX_TEMPERATURE - MIN_TEMPERATURE) + MIN_TEMPERATURE;
    return Math.round(randomTemp * 10) / 10;
  }
}
