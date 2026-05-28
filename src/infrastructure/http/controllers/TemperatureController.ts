import { Request, Response } from 'express';

export class TemperatureController {
  constructor(
    private captureUseCase: any,
    private historyUseCase: any,
    private updateThresholdsUseCase: any
  ) {}

  capture = async (_req: Request, res: Response) => {
    const result = await this.captureUseCase.execute();
    res.json(result);
  };

  history = async (_req: Request, res: Response) => {
    const result = await this.historyUseCase.execute();
    res.json(result);
  };

  updateThresholds = async (req: Request, res: Response) => {
    await this.updateThresholdsUseCase.execute(req.body);
    res.status(204).send();
  };
}