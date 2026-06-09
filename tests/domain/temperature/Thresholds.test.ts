import { Thresholds } from '../../../src/domain/temperature/Thresholds';
import { InvalidThresholdsError } from '../../../src/domain/errors/InvalidThresholdsError';

describe('Thresholds', () => {
  describe('default', () => {
    it('uses the boundaries from the specification (cold 22, hot 35)', () => {
      const thresholds = Thresholds.default();

      expect(thresholds.cold).toBe(22);
      expect(thresholds.hot).toBe(35);
    });
  });

  describe('create', () => {
    it('keeps valid boundaries where cold < hot', () => {
      const thresholds = Thresholds.create(10, 40);

      expect(thresholds.cold).toBe(10);
      expect(thresholds.hot).toBe(40);
    });

    it('rejects cold equal to hot', () => {
      expect(() => Thresholds.create(30, 30)).toThrow(InvalidThresholdsError);
    });

    it('rejects cold greater than hot', () => {
      expect(() => Thresholds.create(40, 10)).toThrow(InvalidThresholdsError);
    });

    it.each([
      ['NaN cold', NaN, 35],
      ['NaN hot', 22, NaN],
      ['infinite hot', 22, Infinity],
      ['infinite cold', -Infinity, 35],
    ])('rejects non-finite boundaries: %s', (_label, cold, hot) => {
      expect(() => Thresholds.create(cold, hot)).toThrow(InvalidThresholdsError);
    });
  });
});
