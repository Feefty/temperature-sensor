import { Temperature } from "../../domain/entities/Temperature";
import { TemperatureRepositoryPort } from "../../domain/ports/TemperatureRepositoryPort";

export class GetHistoryUseCase {
  constructor(private readonly temperatureRepo: TemperatureRepositoryPort) {}

  async execute(): Promise<Temperature[]> {
    return this.temperatureRepo.findLast(15);
  }
}
