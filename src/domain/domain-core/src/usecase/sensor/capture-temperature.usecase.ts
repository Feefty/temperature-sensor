import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CaptureTemperatureAction } from '../../../../domain-contract/command/action/sensor/capture-temperature.action';
import { TemperatureCapture } from '../../../../domain-contract/models/temperature-capture.model';
import { TemperatureState } from '../../../../domain-contract/models/temperature-state.enum';
import { TemperatureCaptureRepositoryPort } from '../../../../domain-contract/ports/secondary/temperature-capture.repository.port';
import { ThresholdRepositoryPort } from '../../../../domain-contract/ports/secondary/threshold.repository.port';
import { TEMPERATURE_CAPTURE_REPOSITORY, THRESHOLD_REPOSITORY } from '../../../../../shared/constants/injection-tokens';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CaptureTemperatureAction)
export class CaptureTemperatureUseCase implements ICommandHandler<CaptureTemperatureAction, TemperatureCapture> {
  constructor(
    @Inject(TEMPERATURE_CAPTURE_REPOSITORY)
    private readonly captureRepository: TemperatureCaptureRepositoryPort,
    @Inject(THRESHOLD_REPOSITORY)
    private readonly thresholdRepository: ThresholdRepositoryPort,
  ) {}

  async execute(): Promise<TemperatureCapture> {
    const value = Math.round((Math.random() * 60 - 10) * 100) / 100;
    const threshold = await this.thresholdRepository.getCurrent();

    let state: TemperatureState;
    if (value >= threshold.hotMin) state = TemperatureState.HOT;
    else if (value < threshold.coldMax) state = TemperatureState.COLD;
    else state = TemperatureState.WARM;

    const capture: TemperatureCapture = {
      id: uuidv4(),
      value,
      state,
      capturedAt: new Date()
    };
    await this.captureRepository.save(capture);
    return capture;
  }
}
