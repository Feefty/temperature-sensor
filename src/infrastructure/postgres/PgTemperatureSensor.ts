import { Kysely } from 'kysely'
import type { TemperatureSensorRepository } from '../../domain/TemperatureSensor/TemperatureSensorRepository.js';
import  {  TemperatureSensor } from '../../domain/TemperatureSensor/TemperatureSensor.js';
import type { DB } from '../../../db.js'

export class PgTemperatureSensor implements TemperatureSensorRepository {
  constructor(private db: DB) {}

  async getFifteenLastedTemperatureState(): Promise<TemperatureSensor[]> {
    const rows = await this.db
      .selectFrom('temperature_sensor')
      .selectAll()
      .orderBy('created_at', 'desc')
      .limit(15)
      .execute()

    return rows.map((row) => ({
      id: String(row.id),
      value: row.value,
      state: row.state,
      created_at: row.created_at ? new Date(row.created_at) : null,
    }))
  }

  async save(temperatureSensor: TemperatureSensor): Promise<TemperatureSensor> {
    await this.db
      .insertInto('temperature_sensor')
      .values([{
        value: temperatureSensor.value,
        state: temperatureSensor.state
      }])
      .execute()

    return temperatureSensor
  }
}