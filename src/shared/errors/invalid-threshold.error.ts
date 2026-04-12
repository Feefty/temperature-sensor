export class InvalidThresholdError extends Error {
  constructor(coldThreshold: number, hotThreshold: number) {
    super(
      `Invalid thresholds: coldThreshold ${coldThreshold} must be strictly less than hotThreshold ${hotThreshold}`
    );
    this.name = "InvalidThresholdError";
  }
}
