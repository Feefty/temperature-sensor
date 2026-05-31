import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { DomainError, ThresholdsInvariantError } from '../../../domain/errors/DomainError';

// express.json() rejects client mistakes (malformed JSON -> 400, over-limit body -> 413) with a
// numeric status and expose:true. Honour that status instead of masking it as a server fault.
function clientErrorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  const { status, expose } = error as { status?: unknown; expose?: unknown };
  if (expose === true && typeof status === 'number' && status >= 400 && status < 500) {
    return status;
  }
  return undefined;
}

// Single place that maps errors to status codes. ThresholdsInvariantError is checked
// before DomainError because it is a subclass.
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Invalid request body',
      details: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
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
  const status = clientErrorStatus(error);
  if (status !== undefined) {
    res
      .status(status)
      .json({ error: status === 413 ? 'Payload too large' : 'Invalid request body' });
    return;
  }
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
};
