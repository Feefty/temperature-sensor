import { GetHistoryUseCaseImpl } from "./getHistory.use-case";
import { HistoryRepository } from "../../domain/ports/History.repository";

describe("GetHistoryUseCaseImpl", () => {
    let mockHistoryRepository: jest.Mocked<HistoryRepository>;
    let getHistoryUseCase: GetHistoryUseCaseImpl;

    beforeEach(() => {
        mockHistoryRepository = {
            save: jest.fn(),
            getMany: jest.fn(),
        };

        getHistoryUseCase = new GetHistoryUseCaseImpl(mockHistoryRepository);
    });

    it("should return history records from the repository", async () => {
        const mockHistory = [
            { id: 1, temperature: 25, state: "WARM" as const, timestamp: new Date() },
            { id: 2, temperature: 30, state: "HOT" as const, timestamp: new Date() }
        ];

        mockHistoryRepository.getMany.mockResolvedValue(mockHistory);

        const result = await getHistoryUseCase.execute();

        expect(mockHistoryRepository.getMany).toHaveBeenCalledTimes(1);
        expect(mockHistoryRepository.getMany).toHaveBeenCalledWith(15, "desc");
        expect(result).toEqual(mockHistory);
    });
});
