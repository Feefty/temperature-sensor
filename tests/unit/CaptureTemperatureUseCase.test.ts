import { CaptureTemperatureUseCase } from '../../src/application/use-cases/CaptureTemperatureUseCase';
import { SensorState } from '../../src/domain/entities/SensorState';

describe('CaptureTemperatureUseCase', () => {
  it('captures and stores temperature reading', async () => {
    const fakeSensor = {
      getTemperature: async () => 30,
    };

    const fakeRepo = {
      save: jest.fn(),
      findLast: jest.fn().mockResolvedValue([]),
    };

    const thresholds = {
      coldMax: 22,
      hotMin: 35,
    };

    const useCase = new CaptureTemperatureUseCase(
      fakeSensor,
      fakeRepo,
      thresholds
    );

    const result = await useCase.execute();

    expect(result.value).toBe(30);
    expect(result.state).toBe(SensorState.WARM);
    expect(fakeRepo.save).toHaveBeenCalled();
  });
});