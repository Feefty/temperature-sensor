import { TemperatureCaptureRepositoryStub } from '../../../../../test-component/stubs/temperature-capture.repository.stub';
import { generateCaptures } from '../../../../../test-component/fixtures/temperature-captures.fixture';
import { GetTemperatureHistoryUseCase } from '../../../src/usecase/sensor/get-temperature-history.usecase';

describe('GetTemperatureHistoryUseCase', () => {
  let usecase: GetTemperatureHistoryUseCase;
  let captureRepo: TemperatureCaptureRepositoryStub;

  beforeEach(() => {
    captureRepo = new TemperatureCaptureRepositoryStub();
    usecase = new GetTemperatureHistoryUseCase(captureRepo);
  });

  it('execute_shouldReturnEmpty_whenNoCaptures', async () => {
    expect(await usecase.execute()).toEqual([]);
  });

  it.each([
    ['fewer than limit', 5, 5],
    ['exactly at limit', 15, 15],
    ['more than limit', 20, 15],
  ])('execute_shouldReturnCorrectCount_when%sCaptures', async (_label, insertCount, expectedCount) => {
    for (const c of generateCaptures(insertCount)) await captureRepo.save(c);

    const result = await usecase.execute();

    expect(result).toHaveLength(expectedCount);
  });
});
