import { TemperatureResponseDTO } from './TemperatureResponseDTO.js';

export interface TemperatureHistoryDTO {
  records: TemperatureResponseDTO[];
  count: number;
}
