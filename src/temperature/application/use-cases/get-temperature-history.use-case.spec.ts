import { createThresholds } from '../../domain/thresholds';
import { TemperatureReading } from '../models/temperature-reading';
import { TemperatureHistoryRepository } from '../ports/temperature-history.repository';
import {
  getTemperatureHistory,
  MAX_TEMPERATURE_HISTORY_SIZE,
  TemperatureHistory,
} from './get-temperature-history.use-case';

describe('getTemperatureHistory', () => {
  it('returns up to 15 recent entries and response metadata', async (): Promise<void> => {
    const items: TemperatureReading[] = [
      {
        id: 'temp_req_02',
        temperature: 36,
        state: 'HOT',
        thresholds: createThresholds(22, 35),
        capturedAt: new Date('2026-06-13T10:31:00.000Z'),
      },
      {
        id: 'temp_req_01',
        temperature: 21,
        state: 'COLD',
        thresholds: createThresholds(22, 35),
        capturedAt: new Date('2026-06-13T10:30:00.000Z'),
      },
    ];
    const findRecent: jest.Mock<Promise<TemperatureReading[]>, [number]> = jest
      .fn<Promise<TemperatureReading[]>, [number]>()
      .mockResolvedValue(items);
    const historyRepository: TemperatureHistoryRepository = {
      save: jest
        .fn<Promise<void>, [TemperatureReading]>()
        .mockResolvedValue(undefined),
      findRecent,
    };

    const result: TemperatureHistory = await getTemperatureHistory(
      { historyRepository },
    );

    expect(findRecent).toHaveBeenCalledWith(MAX_TEMPERATURE_HISTORY_SIZE);
    expect(result).toEqual({ items, count: 2, maxSize: 15 });
  });
});
