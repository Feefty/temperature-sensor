import { TemperatureCapture } from '../../domain/domain-contract/models/temperature-capture.model';
import { TemperatureCaptureRepositoryPort } from '../../domain/domain-contract/ports/secondary/temperature-capture.repository.port';

export class TemperatureCaptureRepositoryStub implements TemperatureCaptureRepositoryPort {
  private readonly captures: TemperatureCapture[] = [];

  async save(capture: TemperatureCapture): Promise<void> {
    this.captures.push(capture);
  }

  async findLastN(count: number): Promise<TemperatureCapture[]> {
    return this.captures.slice(-count).reverse();
  }

  getAll(): TemperatureCapture[] {
    return this.captures;
  }
}
