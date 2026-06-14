import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Threshold } from '../../../../domain/domain-contract/models/threshold.model';
import { ThresholdRepositoryPort } from '../../../../domain/domain-contract/ports/secondary/threshold.repository.port';
import { ThresholdEntity } from '../entities/threshold.entity';
import { toDomain } from '../mappers/threshold.persistence-mapper';

@Injectable()
export class ThresholdRepositoryAdapter implements ThresholdRepositoryPort {
  constructor(@InjectRepository(ThresholdEntity) private readonly repo: Repository<ThresholdEntity>) {}

  async getCurrent(): Promise<Threshold> {
    const entity = await this.repo.findOne({ where: {}, order: { updatedAt: 'DESC' } });
    return entity ? toDomain(entity) : { id: 'default', coldMax: 22, hotMin: 35, updatedAt: new Date() };
  }

  async update(coldMax: number, hotMin: number): Promise<Threshold> {
    const current = await this.repo.findOne({ where: {}, order: { updatedAt: 'DESC' } });
    if (current) {
      Object.assign(current, { coldMax, hotMin, updatedAt: new Date() });
      return toDomain(await this.repo.save(current));
    }
    return toDomain(await this.repo.save(this.repo.create({ coldMax, hotMin, updatedAt: new Date() })));
  }
}
