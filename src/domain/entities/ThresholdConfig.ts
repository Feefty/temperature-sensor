export class ThresholdConfig {
  constructor(
    public readonly id: string,
    public readonly hotThreshold: number,
    public readonly coldThreshold: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.hotThreshold <= this.coldThreshold) {
      throw new Error('Hot threshold must be greater than cold threshold');
    }
  }

  static create(
    id: string,
    hotThreshold: number,
    coldThreshold: number,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ): ThresholdConfig {
    return new ThresholdConfig(id, hotThreshold, coldThreshold, createdAt, updatedAt);
  }

  withUpdatedThresholds(hotThreshold?: number, coldThreshold?: number): ThresholdConfig {
    return new ThresholdConfig(
      this.id,
      hotThreshold ?? this.hotThreshold,
      coldThreshold ?? this.coldThreshold,
      this.createdAt,
      new Date()
    );
  }
}
