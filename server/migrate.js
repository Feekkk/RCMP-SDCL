// Applies db/migration/*.sql in order, tracking what's already run in
// schema_migrations so this is safe to re-run. Run: node server/migrate.js
import fs from 'node:fs'
import path from 'node:path'
import mysql from 'mysql2/promise'
import { config } from './config.js'

const MIGRATIONS_DIR = path.resolve(import.meta.dirname, '../db/migration')

async function main() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  })

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS ${config.db.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )
  await connection.query(`USE ${config.db.database}`)
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) NOT NULL PRIMARY KEY,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const [applied] = await connection.query('SELECT name FROM schema_migrations')
  const appliedNames = new Set(applied.map((row) => row.name))

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    if (appliedNames.has(file)) {
      console.log(`skip  ${file} (already applied)`)
      continue
    }

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8')
    console.log(`apply ${file}`)
    await connection.query(sql)
    await connection.query('INSERT INTO schema_migrations (name) VALUES (?)', [file])
  }

  console.log('Migrations up to date.')
  await connection.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
