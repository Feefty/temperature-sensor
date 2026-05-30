import { CaptureReading } from '../../../src/application/use-cases/CaptureReading';
import { RedefineThresholds } from '../../../src/application/use-cases/RedefineThresholds';
import type { TemperatureSensor } from '../../../src/domain/ports/TemperatureSensor';
import { FakeTemperatureSensor } from '../../fakes/FakeTemperatureSensor';
import { FakeReadingRepository } from '../../fakes/FakeReadingRepository';

describe('CaptureReading', () => {
  it('captures the current temperature and classifies it', async () => {
    const reading = await new CaptureReading(new FakeTemperatureSensor(25), new FakeReadingRepository()).execute();

    expect(reading.temperature).toBe(25);
    expect(reading.state).toBe('WARM');
    expect(reading.capturedAt).toBeInstanceOf(Date);
  });

  it('persists each reading to the repository', async () => {
    const repository = new FakeReadingRepository();

    await new CaptureReading(new FakeTemperatureSensor(40), repository).execute();

    const history = await repository.latest(15);
    expect(history).toHaveLength(1);
    expect(history[0]?.state).toBe('HOT');
  });

  it('classifies using the thresholds active at capture time', async () => {
    const repository = new FakeReadingRepository();
    const capture = new CaptureReading(new FakeTemperatureSensor(25), repository);
    await new RedefineThresholds(repository).execute({ coldMax: 10, hotMin: 20 });

    const reading = await capture.execute();

    expect(reading.state).toBe('HOT');
  });

  it('never rewrites the state of past readings when thresholds change', async () => {
    const repository = new FakeReadingRepository();
    const capture = new CaptureReading(new FakeTemperatureSensor(25), repository);

    await capture.execute(); // WARM under the default 22..35
    await capture.execute(); // WARM
    await new RedefineThresholds(repository).execute({ coldMax: 10, hotMin: 20 });
    await capture.execute(); // 25 >= 20 -> HOT

    const states = (await repository.latest(15)).map((reading) => reading.state);
    expect(states).toEqual(['HOT', 'WARM', 'WARM']);
  });

  it('propagates sensor errors', async () => {
    const failing: TemperatureSensor = {
      read: () => Promise.reject(new Error('sensor unavailable')),
    };

    await expect(new CaptureReading(failing, new FakeReadingRepository()).execute()).rejects.toThrow(
      'sensor unavailable',
    );
  });

  it('propagates repository write errors', async () => {
    const repository = new FakeReadingRepository();
    jest.spyOn(repository, 'append').mockRejectedValue(new Error('write failed'));

    await expect(new CaptureReading(new FakeTemperatureSensor(20), repository).execute()).rejects.toThrow(
      'write failed',
    );
  });
});
