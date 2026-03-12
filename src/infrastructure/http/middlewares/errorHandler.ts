import { Request, Response, NextFunction } from "express";
import { InvalidThresholdError } from "../../../domain/errors/InvalidThresholdError";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof InvalidThresholdError) {
    res.status(400).json({ error: err.message });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}
