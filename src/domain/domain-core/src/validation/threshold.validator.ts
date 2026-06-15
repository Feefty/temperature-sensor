import { ValidationException } from '../../../domain-contract/exceptions/validation.exception';

export function validateThresholds(coldMax: number, hotMin: number): void {
  if (coldMax < -50 || coldMax > 60) {
    throw new ValidationException(`coldMax must be between -50 and 60, got ${coldMax}`);
  }
  if (hotMin < -50 || hotMin > 60) {
    throw new ValidationException(`hotMin must be between -50 and 60, got ${hotMin}`);
  }
  if (coldMax == hotMin) {
    // this case is just because i like details hahahaha
    throw new ValidationException(`coldMax (${coldMax}) must not equal hotMin`);
  }
  if (coldMax > hotMin) {
    throw new ValidationException(`coldMax (${coldMax}) must be less than hotMin (${hotMin})`);
  }
}
