import { Kysely, sql } from 'kysely';
export async function up(db) {
    await db.schema
        .createTable('temperature_sensor')
        .addColumn('id', 'serial', col => col.primaryKey())
        .addColumn('value', 'float8', col => col.notNull())
        .addColumn('state', 'varchar(50)', col => col.notNull())
        .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql `now()`))
        .execute();
    await db.schema
        .createTable('thresholds')
        .addColumn('value', 'float8', col => col.notNull())
        .addColumn('state', 'varchar(50)', col => col.notNull())
        .execute();
}
export async function down(db) {
    await db.schema
        .dropTable('temperature_sensor')
        .execute();
    await db.schema
        .dropTable('thresholds')
        .execute();
}
