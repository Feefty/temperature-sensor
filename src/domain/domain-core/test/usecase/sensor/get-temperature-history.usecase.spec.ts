import { GetTemperatureHistoryUseCase } from '../../../src/usecase/sensor/get-temperature-history.usecase';
import { TemperatureCaptureRepositoryPort } from '../../../../domain-contract/ports/secondary/temperature-capture.repository.port';
import { TemperatureCapture } from '../../../../domain-contract/models/temperature-capture.model';
import { TemperatureState } from '../../../../domain-contract/models/temperature-state.enum';

describe('GetTemperatureHistoryUseCase', () => {
  let usecase: GetTemperatureHistoryUseCase;
  let captureRepository: jest.Mocked<TemperatureCaptureRepositoryPort>;

  beforeEach(() => {
    captureRepository = { save: jest.fn(), findLastN: jest.fn().mockResolvedValue([]) };
    usecase = new GetTemperatureHistoryUseCase(captureRepository);
  });

  //region Success scenarios
  it('execute_shouldReturnEmptyArray_whenNoCapturesExist', async () => {
    captureRepository.findLastN.mockResolvedValue([]);

    const result = await usecase.execute();

    expect(result).toEqual([]);
    expect(captureRepository.findLastN).toHaveBeenCalledWith(15);
  });

  it('execute_shouldReturnCaptures_whenCapturesExist', async () => {
    const captures: TemperatureCapture[] = [
      { id: '1', value: 25, state: TemperatureState.WARM, capturedAt: new Date() },
      { id: '2', value: 38, state: TemperatureState.HOT, capturedAt: new Date() },
    ];
    captureRepository.findLastN.mockResolvedValue(captures);

    const result = await usecase.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual(captures);
    expect(captureRepository.findLastN).toHaveBeenCalledWith(15);
  });
  //endregion
});
