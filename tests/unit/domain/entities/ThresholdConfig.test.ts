import { describe, it, expect } from 'vitest';
import { ThresholdConfig } from '../../../../src/domain/entities/ThresholdConfig';

describe('ThresholdConfig Entity', () => {
  it('should create a valid threshold config', () => {
    const config = ThresholdConfig.create('1', 35, 22);

    expect(config.id).toBe('1');
    expect(config.hotThreshold).toBe(35);
    expect(config.coldThreshold).toBe(22);
  });

  it('should throw error when hotThreshold <= coldThreshold', () => {
    expect(() => ThresholdConfig.create('1', 22, 22)).toThrow(
      'Hot threshold must be greater than cold threshold'
    );
    expect(() => ThresholdConfig.create('1', 20, 22)).toThrow(
      'Hot threshold must be greater than cold threshold'
    );
  });

  it('should update thresholds correctly', () => {
    const config = ThresholdConfig.create('1', 35, 22);
    const updated = config.withUpdatedThresholds(40, 15);

    expect(updated.hotThreshold).toBe(40);
    expect(updated.coldThreshold).toBe(15);
    expect(updated.id).toBe(config.id);
  });

  it('should keep original values when partial update', () => {
    const config = ThresholdConfig.create('1', 35, 22);

    const updatedHot = config.withUpdatedThresholds(40, undefined);
    expect(updatedHot.hotThreshold).toBe(40);
    expect(updatedHot.coldThreshold).toBe(22);

    const updatedCold = config.withUpdatedThresholds(undefined, 15);
    expect(updatedCold.hotThreshold).toBe(35);
    expect(updatedCold.coldThreshold).toBe(15);
  });
});
