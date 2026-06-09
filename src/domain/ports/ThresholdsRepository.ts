import { Thresholds } from '../temperature/Thresholds';

/**
 * Driven port holding the currently active thresholds. Modeling the runtime
 * configuration as a repository keeps the mutable state out of the domain and
 * symmetric with the history store, so use cases depend only on an interface.
 */
export interface ThresholdsRepository {
  get(): Promise<Thresholds>;
  save(thresholds: Thresholds): Promise<void>;
}
