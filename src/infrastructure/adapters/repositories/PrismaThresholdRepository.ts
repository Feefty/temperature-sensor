import { PrismaClient } from "@prisma/client";
import { Threshold } from "../../../domain/entities/Threshold";
import { ThresholdRepositoryPort } from "../../../domain/ports/ThresholdRepositoryPort";

const DEFAULT_THRESHOLD: Threshold = { coldMax: 22, hotMin: 35 };

export class PrismaThresholdRepository implements ThresholdRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async get(): Promise<Threshold> {
    const config = await this.prisma.thresholdConfig.findFirst();

    if (!config) {
      const created = await this.prisma.thresholdConfig.create({
        data: {
          coldMax: DEFAULT_THRESHOLD.coldMax,
          hotMin: DEFAULT_THRESHOLD.hotMin,
        },
      });
      return { coldMax: created.coldMax, hotMin: created.hotMin };
    }

    return { coldMax: config.coldMax, hotMin: config.hotMin };
  }

  async update(threshold: Threshold): Promise<Threshold> {
    const existing = await this.prisma.thresholdConfig.findFirst();

    if (!existing) {
      const created = await this.prisma.thresholdConfig.create({
        data: {
          coldMax: threshold.coldMax,
          hotMin: threshold.hotMin,
        },
      });
      return { coldMax: created.coldMax, hotMin: created.hotMin };
    }

    const updated = await this.prisma.thresholdConfig.update({
      where: { id: existing.id },
      data: {
        coldMax: threshold.coldMax,
        hotMin: threshold.hotMin,
      },
    });

    return { coldMax: updated.coldMax, hotMin: updated.hotMin };
  }
}
