import { TemperatureHistory } from "../../domain/entities/TemperatureHistory";
import { HistoryRepository } from "../../domain/ports/History.repository";

export interface GetHistoryUseCase {
    execute(): Promise<TemperatureHistory[]>;
}

export class GetHistoryUseCaseImpl implements GetHistoryUseCase {
    constructor(private readonly historyRepository: HistoryRepository) { }

    async execute(): Promise<TemperatureHistory[]> {
        return await this.historyRepository.getMany(15, "desc");
    }
}
