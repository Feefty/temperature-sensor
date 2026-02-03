import { PrismaClient } from '../generated/prisma/index.js';
import { ThresholdConfig } from '../../../domain/entities/index.js';
import { IThresholdConfigRepository } from '../../../domain/repositories/index.js';

export class PrismaThresholdConfigRepository implements IThresholdConfigRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async get(): Promise<ThresholdConfig | null> {
    const config = await this.prisma.thresholdConfig.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (!config) {
      return null;
    }

    return new ThresholdConfig(
      config.id,
      config.hotThreshold,
      config.coldThreshold,
      config.createdAt,
      config.updatedAt
    );
  }

  async save(config: ThresholdConfig): Promise<ThresholdConfig> {
    const created = await this.prisma.thresholdConfig.create({
      data: {
        id: config.id,
        hotThreshold: config.hotThreshold,
        coldThreshold: config.coldThreshold
      }
    });

    return new ThresholdConfig(
      created.id,
      created.hotThreshold,
      created.coldThreshold,
      created.createdAt,
      created.updatedAt
    );
  }

  async update(config: ThresholdConfig): Promise<ThresholdConfig> {
    const updated = await this.prisma.thresholdConfig.update({
      where: { id: config.id },
      data: {
        hotThreshold: config.hotThreshold,
        coldThreshold: config.coldThreshold
      }
    });

    return new ThresholdConfig(
      updated.id,
      updated.hotThreshold,
      updated.coldThreshold,
      updated.createdAt,
      updated.updatedAt
    );
  }
}
