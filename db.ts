import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import type { Database } from './src/types.js'

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      user: process.env.DB_USER ?? 'admin',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_NAME ?? 'appdb'
    })
  })
})

export type DB = typeof db