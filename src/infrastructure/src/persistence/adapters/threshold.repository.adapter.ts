import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Threshold } from '../../../../domain/domain-contract/models/threshold.model';
import { ThresholdRepositoryPort } from '../../../../domain/domain-contract/ports/secondary/threshold.repository.port';
import { ThresholdEntity } from '../entities/threshold.entity';
import { toDomain } from '../mappers/threshold.persistence-mapper';

@Injectable()
export class ThresholdRepositoryAdapter implements ThresholdRepositoryPort {
  constructor(
    @InjectRepository(ThresholdEntity)
    private readonly repo: Repository<ThresholdEntity>,
  ) {}

  async getCurrent(): Promise<Threshold | null> {
    const entity = await this.findLatest();
    return toDomain(entity);
  }

  async update(coldMax: number, hotMin: number): Promise<Threshold> {
    const current = await this.findLatest();

    const entity = current
      ? this.updateExisting(current, coldMax, hotMin)
      : this.repo.create({ coldMax, hotMin });

    const saved = await this.repo.save(entity);
    return toDomain(saved)!;
  }

  private async findLatest(): Promise<ThresholdEntity | null> {
    return this.repo.findOne({
      where: {},
      order: { updatedAt: 'DESC' },
    });
  }

  private updateExisting(
    entity: ThresholdEntity,
    coldMax: number,
    hotMin: number,
  ): ThresholdEntity {
    entity.coldMax = coldMax;
    entity.hotMin = hotMin;
    return entity;
  }
}
