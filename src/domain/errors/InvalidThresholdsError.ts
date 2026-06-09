import { DomainError } from './DomainError';

/**
 * Raised when a caller attempts to build {@link Thresholds} that violate the
 * invariant `cold < hot` (or supplies non-finite boundaries).
 */
export class InvalidThresholdsError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
