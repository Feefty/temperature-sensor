import { Thresholds } from '../../domain/thresholds';
import { ThresholdsRepository } from '../ports/thresholds.repository';

export type GetThresholdsDependencies = Readonly<{
  thresholdsRepository: ThresholdsRepository;
}>;

export async function getThresholds(
  dependencies: GetThresholdsDependencies,
): Promise<Thresholds> {
  return dependencies.thresholdsRepository.get();
}
