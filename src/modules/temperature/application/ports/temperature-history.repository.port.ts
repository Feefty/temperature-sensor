import { TemperatureHistory } from '../../domain/temperature-history.domain';

export const TEMPERATURE_HISTORY_REPOSITORY = Symbol('TEMPERATURE_HISTORY_REPOSITORY');

export interface TemperatureHistoryRepositoryPort {
  save(temperatureHistory: TemperatureHistory): Promise<void>;
  findLast(take: number): Promise<TemperatureHistory[]>;
}
