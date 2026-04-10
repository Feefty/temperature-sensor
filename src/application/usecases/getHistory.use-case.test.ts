import { GetHistoryUseCaseImpl } from "./getHistory.use-case";
import { HistoryRepository } from "../../domain/ports/History.repository";
import { TemperatureHistory } from "../../domain/entities/TemperatureHistory";

describe("GetHistoryUseCaseImpl", () => {
    let mockHistoryRepository: jest.Mocked<HistoryRepository>;
    let getHistoryUseCase: GetHistoryUseCaseImpl;

    const mockHistory: TemperatureHistory[] = [
        { temperature: 30, state: "HOT", timestamp: new Date("2024-01-01T10:00:00Z") },
        { temperature: 20, state: "WARM", timestamp: new Date("2024-01-01T09:00:00Z") },
        { temperature: 5, state: "COLD", timestamp: new Date("2024-01-01T08:00:00Z") },
    ];

    beforeEach(() => {
        mockHistoryRepository = {
            getMany: jest.fn().mockResolvedValue(mockHistory),
            save: jest.fn(),
        };
        getHistoryUseCase = new GetHistoryUseCaseImpl(mockHistoryRepository);
    });

    it("should always fetch the last 15 entries in descending order", async () => {
        await getHistoryUseCase.execute();

        expect(mockHistoryRepository.getMany).toHaveBeenCalledTimes(1);
        expect(mockHistoryRepository.getMany).toHaveBeenCalledWith(15, "desc");
    });

    it("should return the history entries from the repository", async () => {
        const result = await getHistoryUseCase.execute();

        expect(result).toEqual(mockHistory);
    });

    it("should return an empty array when there are no entries", async () => {
        mockHistoryRepository.getMany.mockResolvedValue([]);

        const result = await getHistoryUseCase.execute();

        expect(result).toEqual([]);
    });

    it("should propagate repository errors", async () => {
        mockHistoryRepository.getMany.mockRejectedValue(new Error("DB connection failed"));

        await expect(getHistoryUseCase.execute()).rejects.toThrow("DB connection failed");
    });
});
