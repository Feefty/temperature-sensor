import type { Request, Response } from 'express';
import type { CaptureReading } from '../../../application/use-cases/CaptureReading';
import type { GetHistory } from '../../../application/use-cases/GetHistory';
import { toReadingDto } from '../dto';

export class TemperatureController {
  constructor(
    private readonly captureReading: CaptureReading,
    private readonly getHistory: GetHistory,
  ) {}

  capture = async (_req: Request, res: Response): Promise<void> => {
    const reading = await this.captureReading.execute();
    res.json(toReadingDto(reading));
  };

  history = async (_req: Request, res: Response): Promise<void> => {
    const readings = await this.getHistory.execute();
    res.json(readings.map(toReadingDto));
  };
}
