import { GetTemperatureUseCase } from "@application/use-cases/GetTemperatureUseCase";
import { TemperatureSensorPort } from "@domain/ports/TemperatureSensorPort";
import { TemperatureRepositoryPort } from "@domain/ports/TemperatureRepositoryPort";
import { ThresholdRepositoryPort } from "@domain/ports/ThresholdRepositoryPort";
import { SensorState } from "@domain/entities/SensorState";

describe("GetTemperatureUseCase", () => {
  const mockSensor: jest.Mocked<TemperatureSensorPort> = {
    read: jest.fn(),
  };

  const mockTempRepo: jest.Mocked<TemperatureRepositoryPort> = {
    save: jest.fn(),
    findLast: jest.fn(),
  };

  const mockThresholdRepo: jest.Mocked<ThresholdRepositoryPort> = {
    get: jest.fn(),
    update: jest.fn(),
  };

  let useCase: GetTemperatureUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    mockThresholdRepo.get.mockResolvedValue({ coldMax: 22, hotMin: 35 });
    mockTempRepo.save.mockImplementation(async (temp) => temp);
    useCase = new GetTemperatureUseCase(
      mockSensor,
      mockTempRepo,
      mockThresholdRepo
    );
  });

  it("should read temperature, classify as WARM, and save", async () => {
    mockSensor.read.mockResolvedValue(28.5);

    const result = await useCase.execute();

    expect(mockSensor.read).toHaveBeenCalledTimes(1);
    expect(mockThresholdRepo.get).toHaveBeenCalledTimes(1);
    expect(mockTempRepo.save).toHaveBeenCalledTimes(1);
    expect(result.value).toBe(28.5);
    expect(result.state).toBe(SensorState.WARM);
    expect(result.id).toBeDefined();
    expect(result.recordedAt).toBeInstanceOf(Date);
  });

  it("should classify as HOT when temperature >= 35", async () => {
    mockSensor.read.mockResolvedValue(35);

    const result = await useCase.execute();

    expect(result.state).toBe(SensorState.HOT);
  });

  it("should classify as COLD when temperature < 22", async () => {
    mockSensor.read.mockResolvedValue(21.9);

    const result = await useCase.execute();

    expect(result.state).toBe(SensorState.COLD);
  });
});
