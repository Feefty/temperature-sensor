import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/index.js';
import { env } from '../../../infrastructure/config/index.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
    return;
  }

  console.error('Unexpected error:', err);

  res.status(500).json({
    status: 'error',
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
}
