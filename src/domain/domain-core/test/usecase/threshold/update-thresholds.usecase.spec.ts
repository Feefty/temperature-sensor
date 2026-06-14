import { UpdateThresholdsUseCase } from '../../../src/usecase/threshold/update-thresholds.usecase';
import { UpdateThresholdsAction } from '../../../../domain-contract/command/action/threshold/update-thresholds.action';
import { ThresholdRepositoryPort } from '../../../../domain-contract/ports/secondary/threshold.repository.port';
import { ValidationException } from '../../../../domain-contract/exceptions/validation.exception';

describe('UpdateThresholdsUseCase', () => {
  let usecase: UpdateThresholdsUseCase;
  let thresholdRepository: jest.Mocked<ThresholdRepositoryPort>;

  beforeEach(() => {
    thresholdRepository = {
      getCurrent: jest.fn(),
      update: jest.fn().mockImplementation((coldMax, hotMin) =>
        Promise.resolve({ id: 'thr-1', coldMax, hotMin, updatedAt: new Date() }),
      ),
    };
    usecase = new UpdateThresholdsUseCase(thresholdRepository);
  });

  //region Success scenarios
  it('execute_shouldReturnUpdatedThreshold_whenValuesAreValid', async () => {
    const result = await usecase.execute(new UpdateThresholdsAction(20, 33));

    expect(result).toMatchObject({ coldMax: 20, hotMin: 33 });
    expect(thresholdRepository.update).toHaveBeenCalledWith(20, 33);
  });
  //endregion

  //region Validation error scenarios
  it.each([
    ['coldMax > hotMin', 35, 20],
    ['coldMax equals hotMin', 30, 30],
    ['coldMax below minimum bound', -60, 30],
    ['hotMin above maximum bound', 20, 65],
  ])('execute_shouldThrowValidationException_when%s', async (_label, coldMax, hotMin) => {
    await expect(
      usecase.execute(new UpdateThresholdsAction(coldMax, hotMin))
    ).rejects.toThrow(ValidationException);

    expect(thresholdRepository.update).not.toHaveBeenCalled();
  });
  //endregion
});
