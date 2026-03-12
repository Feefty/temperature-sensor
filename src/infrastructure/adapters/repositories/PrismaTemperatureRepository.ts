import { PrismaClient } from "@prisma/client";
import { Temperature } from "../../../domain/entities/Temperature";
import { SensorState } from "../../../domain/entities/SensorState";
import { TemperatureRepositoryPort } from "../../../domain/ports/TemperatureRepositoryPort";

export class PrismaTemperatureRepository implements TemperatureRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async save(temperature: Temperature): Promise<Temperature> {
    const record = await this.prisma.temperatureReading.create({
      data: {
        id: temperature.id,
        value: temperature.value,
        state: temperature.state,
        recordedAt: temperature.recordedAt,
      },
    });

    return {
      id: record.id,
      value: record.value,
      state: record.state as SensorState,
      recordedAt: record.recordedAt,
    };
  }

  async findLast(count: number): Promise<Temperature[]> {
    const records = await this.prisma.temperatureReading.findMany({
      orderBy: { recordedAt: "desc" },
      take: count,
    });

    return records.map((record) => ({
      id: record.id,
      value: record.value,
      state: record.state as SensorState,
      recordedAt: record.recordedAt,
    }));
  }
}
