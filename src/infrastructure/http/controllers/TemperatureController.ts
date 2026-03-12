import { Request, Response, NextFunction } from "express";
import { GetTemperatureUseCase } from "../../../application/use-cases/GetTemperatureUseCase";
import { GetHistoryUseCase } from "../../../application/use-cases/GetHistoryUseCase";
import { GetThresholdsUseCase } from "../../../application/use-cases/GetThresholdsUseCase";
import { UpdateThresholdsUseCase } from "../../../application/use-cases/UpdateThresholdsUseCase";

export class TemperatureController {
  constructor(
    private readonly getTemperature: GetTemperatureUseCase,
    private readonly getHistory: GetHistoryUseCase,
    private readonly getThresholds: GetThresholdsUseCase,
    private readonly updateThresholds: UpdateThresholdsUseCase
  ) {}

  async readTemperature(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.getTemperature.execute();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async readHistory(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.getHistory.execute();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async readThresholds(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.getThresholds.execute();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async writeThresholds(req: Request, res: Response, next: NextFunction) {
    try {
      const { coldMax, hotMin } = req.body;
      const result = await this.updateThresholds.execute(coldMax, hotMin);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
