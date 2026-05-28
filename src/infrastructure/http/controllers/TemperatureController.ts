import { CaptureTemperatureUseCase } from '../../../application/use-cases/CaptureTemperatureUseCase';

export class TemperatureController {
  constructor(private useCase: CaptureTemperatureUseCase) {}

  capture = async (_req: any, res: any) => {
    const result = await this.useCase.execute();
    res.json(result);
  };
}