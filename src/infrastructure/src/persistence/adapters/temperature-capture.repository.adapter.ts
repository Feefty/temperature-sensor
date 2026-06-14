import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemperatureCapture } from '../../../../domain/domain-contract/models/temperature-capture.model';
import { TemperatureCaptureRepositoryPort } from '../../../../domain/domain-contract/ports/secondary/temperature-capture.repository.port';
import { TemperatureCaptureEntity } from '../entities/temperature-capture.entity';
import { toDomain, toEntity } from '../mappers/temperature-capture.persistence-mapper';

@Injectable()
export class TemperatureCaptureRepositoryAdapter implements TemperatureCaptureRepositoryPort {
  constructor(
    @InjectRepository(TemperatureCaptureEntity)
    private readonly repo: Repository<TemperatureCaptureEntity>
  ) {}

  async save(capture: TemperatureCapture): Promise<void> {
    const entity = this.repo.create(toEntity(capture));
    await this.repo.save(entity);
  }

  async findLastN(count: number): Promise<TemperatureCapture[]> {
    const entities = await this.repo.find({
      order: { capturedAt: 'DESC' },
      take: count,
    });
    return entities.map(toDomain);
  }
}
