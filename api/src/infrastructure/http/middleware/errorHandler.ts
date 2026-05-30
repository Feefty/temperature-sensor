import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { DomainError, ThresholdsInvariantError } from '../../../domain/errors/DomainError';

// Single place that maps errors to status codes. ThresholdsInvariantError is checked
// before DomainError because it is a subclass.
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'Invalid request body', details: error.issues });
    return;
  }
  if (error instanceof ThresholdsInvariantError) {
    res.status(422).json({ error: error.message });
    return;
  }
  if (error instanceof DomainError) {
    res.status(400).json({ error: error.message });
    return;
  }
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
};
