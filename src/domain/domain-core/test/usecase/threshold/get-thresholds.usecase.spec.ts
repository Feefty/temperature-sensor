import { ThresholdRepositoryStub } from '../../../../../test-component/stubs/threshold.repository.stub';
import { GetThresholdsUseCase } from '../../../src/usecase/threshold/get-thresholds.usecase';

describe('GetThresholdsUseCase', () => {
  let usecase: GetThresholdsUseCase;

  beforeEach(() => {
    usecase = new GetThresholdsUseCase(new ThresholdRepositoryStub());
  });

  it('execute_shouldReturnCurrentThresholds', async () => {
    const result = await usecase.execute();

    expect(result).toMatchObject({
      coldMax: 22,
      hotMin: 35,
    });
  });
});
