import { GetThresholdsUseCase } from "@application/use-cases/GetThresholdsUseCase";
import { ThresholdRepositoryPort } from "@domain/ports/ThresholdRepositoryPort";

describe("GetThresholdsUseCase", () => {
  const mockThresholdRepo: jest.Mocked<ThresholdRepositoryPort> = {
    get: jest.fn(),
    update: jest.fn(),
  };

  let useCase: GetThresholdsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetThresholdsUseCase(mockThresholdRepo);
  });

  it("should return the current thresholds", async () => {
    const thresholds = { coldMax: 22, hotMin: 35 };
    mockThresholdRepo.get.mockResolvedValue(thresholds);

    const result = await useCase.execute();

    expect(mockThresholdRepo.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(thresholds);
  });
});
