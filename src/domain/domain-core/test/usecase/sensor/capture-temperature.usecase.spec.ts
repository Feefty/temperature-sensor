import { CaptureTemperatureUseCase } from '../../../src/usecase/sensor/capture-temperature.usecase';
import { TemperatureCaptureRepositoryPort } from '../../../../domain-contract/ports/secondary/temperature-capture.repository.port';
import { ThresholdRepositoryPort } from '../../../../domain-contract/ports/secondary/threshold.repository.port';
import { TemperatureState } from '../../../../domain-contract/models/temperature-state.enum';
import { DomainException } from '../../../../domain-contract/exceptions/domain.exception';

describe('CaptureTemperatureUseCase', () => {
  let usecase: CaptureTemperatureUseCase;
  let captureRepository: jest.Mocked<TemperatureCaptureRepositoryPort>;
  let thresholdRepository: jest.Mocked<ThresholdRepositoryPort>;

  beforeEach(() => {
    captureRepository = { save: jest.fn().mockResolvedValue(undefined), findLastN: jest.fn() };
    thresholdRepository = {
      getCurrent: jest
        .fn()
        .mockResolvedValue({ id: 'thr-1', coldMax: 22, hotMin: 35, updatedAt: new Date() }),
      update: jest.fn(),
    };
    usecase = new CaptureTemperatureUseCase(captureRepository, thresholdRepository);
  });

  //region Success scenarios
  it('should_returnCapture_when_thresholdExists', async () => {
    const result = await usecase.execute();

    expect(result).toMatchObject({
      id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      value: expect.any(Number),
      state: expect.any(String),
      capturedAt: expect.any(Date),
    });
    expect(result.value).toBeGreaterThanOrEqual(-10);
    expect(result.value).toBeLessThanOrEqual(50);
  });

  it('should_persistCapture_when_thresholdExists', async () => {
    await usecase.execute();

    expect(captureRepository.save).toHaveBeenCalledTimes(1);
    expect(thresholdRepository.getCurrent).toHaveBeenCalledTimes(1);
    expect(captureRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        value: expect.any(Number),
        state: expect.any(String),
        capturedAt: expect.any(Date),
      }),
    );
  });

  it.each([
    ['HOT', 0.9667, TemperatureState.HOT],
    ['COLD', 0.1, TemperatureState.COLD],
    ['WARM', 0.5833, TemperatureState.WARM],
  ])(
    'should_classifyAs%s_when_randomValueProduces%s',
    async (_label, randomValue, expectedState) => {
      jest.spyOn(Math, 'random').mockReturnValue(randomValue);

      const result = await usecase.execute();

      expect(result.state).toBe(expectedState);
      jest.restoreAllMocks();
    },
  );
  //endregion

  //region Error scenarios
  it('should_throwDomainException_when_noThresholdFound', async () => {
    thresholdRepository.getCurrent.mockResolvedValue(null);

    await expect(usecase.execute()).rejects.toThrow(DomainException);
    await expect(usecase.execute()).rejects.toThrow('No threshold configuration found');
    expect(captureRepository.save).toHaveBeenCalledTimes(0);
  });
  //endregion
});
