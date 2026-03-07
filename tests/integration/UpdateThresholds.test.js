const UpdateThresholds = require('../../src/domain/usecases/UpdateThresholds');
const { setThresholds } = require('../../src/domain/entities/SensorState');

describe('UpdateThresholds use case', () => {
  beforeEach(() => setThresholds({ hot: 35, cold: 22 }));

  test('updates thresholds successfully', () => {
    const uc = new UpdateThresholds();
    const result = uc.execute({ hot: 40, cold: 18 });
    expect(result).toEqual({ hot: 40, cold: 18 });
  });

  test('throws when cold >= hot', () => {
    const uc = new UpdateThresholds();
    expect(() => uc.execute({ hot: 20, cold: 25 })).toThrow();
  });

  test('throws when values are not numbers', () => {
    const uc = new UpdateThresholds();
    expect(() => uc.execute({ hot: 'a', cold: 10 })).toThrow();
  });
});