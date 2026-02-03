import { Request, Response, NextFunction } from 'express';
import { getContainer } from '../../../infrastructure/container/index.js';

export class TemperatureController {
  static async getCurrent(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const container = getContainer();
      const result = await container.getCurrentTemperatureUseCase.execute();

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const container = getContainer();
      const result = await container.getTemperatureHistoryUseCase.execute();

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
