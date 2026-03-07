const GetTemperature = require('../../src/domain/usecases/GetTemperature');

const mockSensor = { getTemperature: jest.fn() };
const mockRepo = { save: jest.fn(), getHistory: jest.fn() };

describe('GetTemperature use case', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns a reading with correct state for HOT temp', async () => {
    mockSensor.getTemperature.mockResolvedValue(36);
    mockRepo.save.mockResolvedValue({});
    const uc = new GetTemperature(mockSensor, mockRepo);
    const result = await uc.execute();
    expect(result.temperature).toBe(36);
    expect(result.state).toBe('HOT');
    expect(mockRepo.save).toHaveBeenCalled();
  });

  test('returns COLD state for low temp', async () => {
    mockSensor.getTemperature.mockResolvedValue(15);
    mockRepo.save.mockResolvedValue({});
    const uc = new GetTemperature(mockSensor, mockRepo);
    const result = await uc.execute();
    expect(result.state).toBe('COLD');
  });
});