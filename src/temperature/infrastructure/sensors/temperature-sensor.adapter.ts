import { TemperatureSensorPort } from '../../application/ports/temperature-sensor.port';

interface TemperatureSensorComponent {
  measureTemperature(): number;
}

export class TemperatureSensorAdapter implements TemperatureSensorPort {
  constructor(
    private readonly temperatureSensor: TemperatureSensorComponent,
  ) {}

  async readTemperature(): Promise<number> {
    return this.temperatureSensor.measureTemperature();
  }
}
