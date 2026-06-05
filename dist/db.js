import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
export const db = new Kysely({
    dialect: new PostgresDialect({
        pool: new Pool({
            host: process.env.DB_HOST ?? 'localhost',
            port: Number(process.env.DB_PORT ?? 5432),
            user: process.env.DB_USER ?? 'admin',
            password: process.env.DB_PASSWORD ?? 'password',
            database: process.env.DB_NAME ?? 'appdb'
        })
    })
});
