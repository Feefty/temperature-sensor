import { GetHistoryUseCase } from "@application/use-cases/GetHistoryUseCase";
import { TemperatureRepositoryPort } from "@domain/ports/TemperatureRepositoryPort";
import { Temperature } from "@domain/entities/Temperature";
import { SensorState } from "@domain/entities/SensorState";

describe("GetHistoryUseCase", () => {
  const mockTempRepo: jest.Mocked<TemperatureRepositoryPort> = {
    save: jest.fn(),
    findLast: jest.fn(),
  };

  let useCase: GetHistoryUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetHistoryUseCase(mockTempRepo);
  });

  it("should return the last 15 temperature readings", async () => {
    const mockHistory: Temperature[] = [
      {
        id: "1",
        value: 28.5,
        state: SensorState.WARM,
        recordedAt: new Date(),
      },
      {
        id: "2",
        value: 36,
        state: SensorState.HOT,
        recordedAt: new Date(),
      },
    ];

    mockTempRepo.findLast.mockResolvedValue(mockHistory);

    const result = await useCase.execute();

    expect(mockTempRepo.findLast).toHaveBeenCalledWith(15);
    expect(result).toEqual(mockHistory);
  });

  it("should return an empty array when no history exists", async () => {
    mockTempRepo.findLast.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
