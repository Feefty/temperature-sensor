import { ErrorRequestHandler } from 'express';
import { DomainError } from '../../domain/errors/DomainError';

/**
 * Translates errors into HTTP responses. A domain rule violation is the
 * caller's fault and maps to 400 with its message; anything else is an
 * unexpected failure, masked as a generic 500 so internals never leak.
 *
 * Must keep all four parameters: Express only recognises a middleware as an
 * error handler when its arity is 4.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof DomainError) {
    res.status(400).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Internal Server Error' });
};
