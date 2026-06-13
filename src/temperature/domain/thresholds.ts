export const MINIMUM_THRESHOLD_RANGE = 2;

export type Thresholds = Readonly<{
  coldThreshold: number;
  hotThreshold: number;
}>;

export class InvalidThresholdValueError extends Error {
  constructor(thresholdName: keyof Thresholds, thresholdValue: number) {
    super(`${thresholdName} must be a finite number; received ${thresholdValue}`);
    this.name = 'InvalidThresholdValueError';
  }
}

export class InvalidThresholdRangeError extends Error {
  constructor(coldThreshold: number, hotThreshold: number) {
    super(
      `hotThreshold must be at least ${MINIMUM_THRESHOLD_RANGE} greater than coldThreshold; ` +
        `received coldThreshold=${coldThreshold}, hotThreshold=${hotThreshold}`,
    );
    this.name = 'InvalidThresholdRangeError';
  }
}

export function createThresholds(
  coldThreshold: number,
  hotThreshold: number,
): Thresholds {
  if (!Number.isFinite(coldThreshold)) {
    throw new InvalidThresholdValueError('coldThreshold', coldThreshold);
  }

  if (!Number.isFinite(hotThreshold)) {
    throw new InvalidThresholdValueError('hotThreshold', hotThreshold);
  }

  if (hotThreshold - coldThreshold < MINIMUM_THRESHOLD_RANGE) {
    throw new InvalidThresholdRangeError(coldThreshold, hotThreshold);
  }

  return { coldThreshold, hotThreshold };
}

export const DEFAULT_THRESHOLDS: Thresholds = createThresholds(22, 35);
