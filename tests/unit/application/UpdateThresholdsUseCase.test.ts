import { UpdateThresholdsUseCase } from "@application/use-cases/UpdateThresholdsUseCase";
import { ThresholdRepositoryPort } from "@domain/ports/ThresholdRepositoryPort";
import { InvalidThresholdError } from "@domain/errors/InvalidThresholdError";

describe("UpdateThresholdsUseCase", () => {
  const mockThresholdRepo: jest.Mocked<ThresholdRepositoryPort> = {
    get: jest.fn(),
    update: jest.fn(),
  };

  let useCase: UpdateThresholdsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateThresholdsUseCase(mockThresholdRepo);
  });

  it("should update thresholds when coldMax < hotMin", async () => {
    const newThresholds = { coldMax: 15, hotMin: 40 };
    mockThresholdRepo.update.mockResolvedValue(newThresholds);

    const result = await useCase.execute(15, 40);

    expect(mockThresholdRepo.update).toHaveBeenCalledWith(newThresholds);
    expect(result).toEqual(newThresholds);
  });

  it("should throw InvalidThresholdError when coldMax >= hotMin", async () => {
    await expect(useCase.execute(35, 22)).rejects.toThrow(
      InvalidThresholdError
    );
    expect(mockThresholdRepo.update).not.toHaveBeenCalled();
  });

  it("should throw InvalidThresholdError when coldMax equals hotMin", async () => {
    await expect(useCase.execute(25, 25)).rejects.toThrow(
      InvalidThresholdError
    );
    expect(mockThresholdRepo.update).not.toHaveBeenCalled();
  });
});
