const InMemoryTemperatureRepository = require('../../src/infrastructure/repositories/InMemoryTemperatureRepository');
const TemperatureReading = require('../../src/domain/entities/TemperatureReading');

describe('InMemoryTemperatureRepository', () => {
  test('saves and retrieves a reading', async () => {
    const repo = new InMemoryTemperatureRepository();
    await repo.save(new TemperatureReading(25, 'WARM'));
    const history = await repo.getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].temperature).toBe(25);
  });

  test('limits history to 15 readings', async () => {
    const repo = new InMemoryTemperatureRepository();
    for (let i = 0; i < 20; i++) {
      await repo.save(new TemperatureReading(20 + i, 'WARM'));
    }
    const history = await repo.getHistory();
    expect(history).toHaveLength(15);
  });

  test('returns most recent reading first', async () => {
    const repo = new InMemoryTemperatureRepository();
    await repo.save(new TemperatureReading(20, 'COLD'));
    await repo.save(new TemperatureReading(36, 'HOT'));
    const history = await repo.getHistory();
    expect(history[0].temperature).toBe(36);
  });
});