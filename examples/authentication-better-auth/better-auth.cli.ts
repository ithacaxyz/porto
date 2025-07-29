import Database from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import { createAuth } from './better-auth.config'

export const auth = await createAuth({
  db: new Kysely({
    dialect: new SqliteDialect({ database: new Database('db.sqlite') }),
  }),
})
