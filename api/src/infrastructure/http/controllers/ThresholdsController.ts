import type { Request, Response } from 'express';
import type { GetThresholds } from '../../../application/use-cases/GetThresholds';
import type { RedefineThresholds } from '../../../application/use-cases/RedefineThresholds';
import { thresholdsSchema } from '../schemas';

export class ThresholdsController {
  constructor(
    private readonly getThresholds: GetThresholds,
    private readonly redefineThresholds: RedefineThresholds,
  ) {}

  current = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.getThresholds.execute());
  };

  // Express 5 forwards rejected promises to the error handler, so no try/catch is needed:
  // a ZodError becomes 400 and a ThresholdsInvariantError becomes 422.
  redefine = async (req: Request, res: Response): Promise<void> => {
    const input = thresholdsSchema.parse(req.body);
    const thresholds = await this.redefineThresholds.execute(input);
    res.json(thresholds);
  };
}
