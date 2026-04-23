import { Inject, Injectable } from '@nestjs/common';
import { SensorThresholds } from '../../domain/sensor-thresholds';
import { ThresholdsRepositoryPort, THRESHOLDS_REPOSITORY } from '../ports/thresholds.repository.port';

@Injectable()
export class GetThresholdsUseCase {
  public constructor(
    @Inject(THRESHOLDS_REPOSITORY)
    private readonly thresholdsRepository: ThresholdsRepositoryPort
  ) {}

  public async execute(): Promise<SensorThresholds> {
    return this.thresholdsRepository.get();
  }
}
