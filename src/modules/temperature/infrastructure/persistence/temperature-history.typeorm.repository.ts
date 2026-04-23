import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemperatureHistory } from '../../domain/temperature-history.domain';
import { TemperatureHistoryRepositoryPort } from '../../application/ports/temperature-history.repository.port';
import { TemperatureHistoryEntity } from './temperature-history.entity';
import { TemperatureHistoryEntityMapper } from '../mappers/temperature-history-entity.mapper';

@Injectable()
export class TemperatureHistoryTypeOrmRepository implements TemperatureHistoryRepositoryPort {
  public constructor(
    @InjectRepository(TemperatureHistoryEntity)
    private readonly repository: Repository<TemperatureHistoryEntity>,
    private readonly mapper: TemperatureHistoryEntityMapper
  ) { }

  public async save(temperatureHistory: TemperatureHistory): Promise<void> {
    const entity: TemperatureHistoryEntity = this.mapper.domainToEntity(temperatureHistory);
    await this.repository.save(entity);
  }

  public async findLast(take: number): Promise<TemperatureHistory[]> {
    const entities: TemperatureHistoryEntity[] = await this.repository.find({
      order: { capturedAt: 'DESC' },
      take,
    });
    return this.mapper.entitiesToDomains(entities);
  }
}
