import { Request, Response, NextFunction } from 'express';
import { getContainer } from '../../../infrastructure/container/index.js';
import { UpdateThresholdsDTO } from '../../../application/dtos/index.js';

export class ThresholdController {
  static async get(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const container = getContainer();
      const result = await container.getThresholdsUseCase.execute();

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const container = getContainer();
      const dto: UpdateThresholdsDTO = req.body;
      const result = await container.updateThresholdsUseCase.execute(dto);

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
