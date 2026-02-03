import { PrismaClient } from '../generated/prisma/index.js';
import { Temperature, TemperatureState } from '../../../domain/entities/index.js';
import { ITemperatureRepository } from '../../../domain/repositories/index.js';

export class PrismaTemperatureRepository implements ITemperatureRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(temperature: Temperature): Promise<Temperature> {
    await this.prisma.temperature.create({
      data: {
        id: temperature.id,
        value: temperature.value,
        state: temperature.state,
        createdAt: temperature.timestamp
      }
    });
    return temperature;
  }

  async findLast(limit: number): Promise<Temperature[]> {
    const readings = await this.prisma.temperature.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return readings.map(
      (reading) =>
        new Temperature(
          reading.id,
          reading.value,
          reading.state as TemperatureState,
          reading.createdAt
        )
    );
  }
}
