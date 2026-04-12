import { TemperatureReading } from "../../domain/entities/temperature-reading";
import { ITemperatureSensor } from "../../domain/ports/outbound/i-temperature-sensor";
import { IReadingRepository } from "../../domain/ports/outbound/i-reading-repository";
import { ThresholdsService } from "../services/thresholds.service";

export class CaptureTemperatureUseCase {
  constructor(
    private readonly sensor: ITemperatureSensor,
    private readonly repository: IReadingRepository,
    private readonly thresholdsService: ThresholdsService
  ) {}

  async execute(): Promise<TemperatureReading> {
    const temperature = await this.sensor.getTemperature();
    const thresholds = this.thresholdsService.get();
    const reading = TemperatureReading.create(temperature, thresholds);
    await this.repository.save(reading);
    return reading;
  }
}
