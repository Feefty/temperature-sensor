import { Temperature } from "../entities/Temperature";

export interface TemperatureRepositoryPort {
  save(temperature: Temperature): Promise<Temperature>;
  findLast(count: number): Promise<Temperature[]>;
}
