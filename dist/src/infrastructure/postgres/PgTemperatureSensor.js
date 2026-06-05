import { Kysely } from 'kysely';
import { TemperatureSensor } from '../../domain/TemperatureSensor/TemperatureSensor.js';
export class PgTemperatureSensor {
    db;
    constructor(db) {
        this.db = db;
    }
    async getFifteenLastedTemperatureState() {
        const rows = await this.db
            .selectFrom('temperature_sensor')
            .selectAll()
            .orderBy('created_at', 'desc')
            .limit(15)
            .execute();
        return rows.map((row) => ({
            id: String(row.id),
            value: row.value,
            state: row.state,
            created_at: row.created_at ? new Date(row.created_at) : null,
        }));
    }
    async save(temperatureSensor) {
        await this.db
            .insertInto('temperature_sensor')
            .values([{
                value: temperatureSensor.value,
                state: temperatureSensor.state
            }])
            .execute();
        return temperatureSensor;
    }
}
