import { pool } from '../db.js'

// Append-only audit trail. Never pass decrypted phone/bank values in `details`.
export async function logAudit({ actorType, actorId, action, entityType, entityId, details, req }) {
  try {
    await pool.query(
      `INSERT INTO audit_log (actor_type, actor_id, action, entity_type, entity_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        actorType,
        actorId ?? null,
        action,
        entityType ?? null,
        entityId ?? null,
        details ? JSON.stringify(details) : null,
        req?.ip ?? null,
      ],
    )
  } catch (err) {
    console.error('Failed to write audit log entry', err)
  }
}
