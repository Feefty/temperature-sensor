import { UpdateThresholdsAction } from '../../../../domain-contract/command/action/threshold/update-thresholds.action';
import { ThresholdRepositoryStub } from '../../../../../test-component/stubs/threshold.repository.stub';
import { ValidationException } from '../../../../domain-contract/exceptions/validation.exception';
import { UpdateThresholdsUseCase } from '../../../src/usecase/threshold/update-thresholds.usecase';

describe('UpdateThresholdsUseCase', () => {
  let usecase: UpdateThresholdsUseCase;

  beforeEach(() => {
    usecase = new UpdateThresholdsUseCase(new ThresholdRepositoryStub());
  });

  it('execute_shouldReturnUpdatedThresholds_whenValid', async () => {
    const result = await usecase.execute(new UpdateThresholdsAction(20, 33));

    expect(result).toMatchObject({ coldMax: 20, hotMin: 33 });
  });

  it.each([
    ['coldMax >= hotMin', 35, 20],
    ['coldMax equals hotMin', 30, 30],
    ['coldMax below minimum bound', -60, 30],
    ['hotMin above maximum bound', 20, 65],
  ])('execute_shouldThrowValidationException_when%s', async (_label, coldMax, hotMin) => {
    await expect(usecase.execute(new UpdateThresholdsAction(coldMax, hotMin)))
      .rejects.toThrow(ValidationException);
  });
});
