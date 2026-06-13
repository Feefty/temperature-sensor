import { createThresholds, Thresholds } from '../../domain/thresholds';
import { ThresholdsRepository } from '../ports/thresholds.repository';

export type ThresholdUpdate = Readonly<{
  coldThreshold?: number;
  hotThreshold?: number;
}>;

export type UpdateThresholdsDependencies = Readonly<{
  thresholdsRepository: ThresholdsRepository;
}>;

export class EmptyThresholdUpdateError extends Error {
  constructor() {
    super('At least one threshold must be provided');
    this.name = 'EmptyThresholdUpdateError';
  }
}

function hasThresholdUpdate(update: ThresholdUpdate): boolean {
  return update.coldThreshold !== undefined || update.hotThreshold !== undefined;
}

export async function updateThresholds(
  dependencies: UpdateThresholdsDependencies,
  update: ThresholdUpdate,
): Promise<Thresholds> {
  if (!hasThresholdUpdate(update)) {
    throw new EmptyThresholdUpdateError();
  }

  const activeThresholds: Thresholds =
    await dependencies.thresholdsRepository.get();
  const updatedThresholds: Thresholds = createThresholds(
    update.coldThreshold ?? activeThresholds.coldThreshold,
    update.hotThreshold ?? activeThresholds.hotThreshold,
  );

  await dependencies.thresholdsRepository.save(updatedThresholds);

  return updatedThresholds;
}
