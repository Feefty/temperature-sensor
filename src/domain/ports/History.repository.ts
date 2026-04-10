import { TemperatureHistory } from "../entities/TemperatureHistory";

export interface HistoryRepository {
    getMany(limit: number, orderBy: "asc" | "desc"): Promise<TemperatureHistory[]>;
    save(history: TemperatureHistory): Promise<void>;
}