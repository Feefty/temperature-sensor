import { describe, it, expect } from 'vitest';
import { TemperatureStateService } from '../../../../src/domain/services/TemperatureStateService';
import { TemperatureState } from '../../../../src/domain/entities/TemperatureState';
import { ThresholdConfig } from '../../../../src/domain/entities/ThresholdConfig';

describe('TemperatureStateService', () => {
  const defaultThresholds = new ThresholdConfig(
    '1',
    35,
    22,
    new Date(),
    new Date()
  );

  describe('calculateState', () => {
    it('should return HOT when temperature >= hotThreshold', () => {
      expect(TemperatureStateService.calculateState(35, defaultThresholds)).toBe(
        TemperatureState.HOT
      );
      expect(TemperatureStateService.calculateState(40, defaultThresholds)).toBe(
        TemperatureState.HOT
      );
      expect(TemperatureStateService.calculateState(100, defaultThresholds)).toBe(
        TemperatureState.HOT
      );
    });

    it('should return COLD when temperature < coldThreshold', () => {
      expect(TemperatureStateService.calculateState(21.9, defaultThresholds)).toBe(
        TemperatureState.COLD
      );
      expect(TemperatureStateService.calculateState(0, defaultThresholds)).toBe(
        TemperatureState.COLD
      );
      expect(TemperatureStateService.calculateState(-10, defaultThresholds)).toBe(
        TemperatureState.COLD
      );
    });

    it('should return WARM when temperature >= coldThreshold and < hotThreshold', () => {
      expect(TemperatureStateService.calculateState(22, defaultThresholds)).toBe(
        TemperatureState.WARM
      );
      expect(TemperatureStateService.calculateState(34.9, defaultThresholds)).toBe(
        TemperatureState.WARM
      );
      expect(TemperatureStateService.calculateState(28, defaultThresholds)).toBe(
        TemperatureState.WARM
      );
    });

    it('should work with custom thresholds', () => {
      const customThresholds = new ThresholdConfig('2', 40, 10, new Date(), new Date());

      expect(TemperatureStateService.calculateState(39, customThresholds)).toBe(
        TemperatureState.WARM
      );
      expect(TemperatureStateService.calculateState(40, customThresholds)).toBe(
        TemperatureState.HOT
      );
      expect(TemperatureStateService.calculateState(10, customThresholds)).toBe(
        TemperatureState.WARM
      );
      expect(TemperatureStateService.calculateState(9.9, customThresholds)).toBe(
        TemperatureState.COLD
      );
    });
  });
});
