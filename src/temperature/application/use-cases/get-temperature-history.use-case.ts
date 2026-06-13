import { TemperatureReading } from '../models/temperature-reading';
import { TemperatureHistoryRepository } from '../ports/temperature-history.repository';

export const MAX_TEMPERATURE_HISTORY_SIZE = 15;

export type TemperatureHistory = Readonly<{
  items: TemperatureReading[];
  count: number;
  maxSize: typeof MAX_TEMPERATURE_HISTORY_SIZE;
}>;

export type GetTemperatureHistoryDependencies = Readonly<{
  historyRepository: TemperatureHistoryRepository;
}>;

export async function getTemperatureHistory(
  dependencies: GetTemperatureHistoryDependencies,
): Promise<TemperatureHistory> {
  const items: TemperatureReading[] =
    await dependencies.historyRepository.findRecent(
      MAX_TEMPERATURE_HISTORY_SIZE,
    );

  return {
    items,
    count: items.length,
    maxSize: MAX_TEMPERATURE_HISTORY_SIZE,
  };
}
