export class FakeTemperatureSensor {
  private readonly temperature: number;

  constructor() {
    const raw = process.env.FAKE_SENSOR_TEMPERATURE;
    const parsed = raw !== undefined ? Number(raw) : NaN;
    this.temperature = Number.isFinite(parsed) ? parsed : 25;
  }

  read(): number {
    return this.temperature;
  }
}
