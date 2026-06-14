import { TemperatureState } from '../../../../domain-contract/models/temperature-state.enum';
import { TemperatureCaptureRepositoryStub } from '../../../../../test-component/stubs/temperature-capture.repository.stub';
import { ThresholdRepositoryStub } from '../../../../../test-component/stubs/threshold.repository.stub';
import { CaptureTemperatureUseCase } from '../../../src/usecase/sensor/capture-temperature.usecase';

describe('CaptureTemperatureUseCase', () => {
  let usecase: CaptureTemperatureUseCase;
  let captureRepo: TemperatureCaptureRepositoryStub;

  beforeEach(() => {
    captureRepo = new TemperatureCaptureRepositoryStub();
    usecase = new CaptureTemperatureUseCase(captureRepo, new ThresholdRepositoryStub());
  });

  it('execute_shouldReturnCaptureWithValidFields', async () => {
    const result = await usecase.execute();

    expect(result).toMatchObject({
      id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      value: expect.any(Number),
      state: expect.stringMatching(/^(HOT|COLD|WARM)$/),
      capturedAt: expect.any(Date),
    });
    expect(result.value).toBeGreaterThanOrEqual(-10);
    expect(result.value).toBeLessThanOrEqual(50);
  });

  it('execute_shouldPersistCaptureInRepository', async () => {
    await usecase.execute();
    expect(captureRepo.getAll()).toHaveLength(1);
  });

  it.each([
    ['HOT', 0.9667, TemperatureState.HOT],
    ['COLD', 0.1, TemperatureState.COLD],
    ['WARM', 0.5833, TemperatureState.WARM],
  ])('execute_shouldClassifyAs%s_whenRandomValueIs%s', async (_label, randomValue, expectedState) => {
    jest.spyOn(Math, 'random').mockReturnValue(randomValue);

    const result = await usecase.execute();

    expect(result.state).toBe(expectedState);
    jest.restoreAllMocks();
  });
});
