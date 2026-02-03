import { Temperature } from '../entities/Temperature.js';

export interface ITemperatureRepository {
  save(temperature: Temperature): Promise<Temperature>;
  findLast(limit: number): Promise<Temperature[]>;
}
