// Bootstraps the first System Admin account, since only System Admin can
// create further staff accounts. Run once: node server/seed.js <staffId> <email> <password>
import { pool } from './db.js'
import { hashPassword } from './lib/password.js'

async function main() {
  const [staffId, email, password] = process.argv.slice(2)
  if (!staffId || !email || !password) {
    console.error('Usage: node server/seed.js <staffId> <email> <password>')
    process.exit(1)
  }

  const passwordHash = await hashPassword(password)
  await pool.query(
    `INSERT INTO staff (staff_id, email, name, role, unit, password_hash)
     VALUES (?, ?, 'System Administrator', 'SYSTEM_ADMIN', NULL, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [staffId, email, passwordHash],
  )

  console.log(`System Admin account ready: ${staffId} (${email})`)
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
