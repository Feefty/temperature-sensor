import { Request, Response, NextFunction } from "express";
import { CaptureTemperatureUseCase } from "../../../application/use-cases/get-temperature.use-case";
import { GetHistoryUseCase } from "../../../application/use-cases/get-history.use-case";
import { UpdateThresholdsUseCase } from "../../../application/use-cases/update-thresholds.use-case";

export class TemperatureController {
  constructor(
    private readonly captureTemperatureUseCase: CaptureTemperatureUseCase,
    private readonly getHistoryUseCase: GetHistoryUseCase,
    private readonly updateThresholdsUseCase: UpdateThresholdsUseCase
  ) {}

  async capture(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reading = await this.captureTemperatureUseCase.execute();
      res.status(200).json(reading);
    } catch (error) {
      next(error);
    }
  }

  async history(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const readings = await this.getHistoryUseCase.execute();
      res.status(200).json(readings);
    } catch (error) {
      next(error);
    }
  }

  async updateThresholds(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { hot, cold } = req.body;
      const thresholds = await this.updateThresholdsUseCase.execute(hot, cold);
      res.status(200).json(thresholds);
    } catch (error) {
      next(error);
    }
  }
}
