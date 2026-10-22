import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'
import { hashPassword } from '../lib/password.js'
import { logAudit } from '../lib/audit.js'

export const adminRouter = Router()

const STAFF_ROLES = ['SYSTEM_ADMIN', 'SD_STAFF', 'CL_STAFF', 'SRD_STAFF', 'HOD', 'DD', 'CEO', 'BOARD']
const UNITS = ['SD', 'CL', 'SRD']

// Only System Admin creates staff accounts and assigns roles (assumption in CLAUDE.md).
adminRouter.use(requireAuth, requireRole('SYSTEM_ADMIN'))

adminRouter.get('/staff', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT staff_id, email, name, role, unit, is_active, created_at, last_login_at FROM staff ORDER BY created_at DESC',
  )
  return res.json({ staff: rows })
})

adminRouter.post('/staff', async (req, res) => {
  const { staffId, email, name, role, unit, password } = req.body ?? {}

  if (!staffId || !email || !role || !password) {
    return res.status(400).json({ error: 'staffId, email, role and password are required' })
  }
  if (!STAFF_ROLES.includes(role)) {
    return res.status(400).json({ error: `role must be one of ${STAFF_ROLES.join(', ')}` })
  }
  if (unit && !UNITS.includes(unit)) {
    return res.status(400).json({ error: `unit must be one of ${UNITS.join(', ')}` })
  }

  const passwordHash = await hashPassword(password)

  try {
    await pool.query(
      `INSERT INTO staff (staff_id, email, name, role, unit, password_hash)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [staffId, email, name ?? null, role, unit ?? null, passwordHash],
    )
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A staff account with this ID or email already exists' })
    }
    throw err
  }

  await logAudit({
    actorType: 'staff',
    actorId: req.user.sub,
    action: 'STAFF_ACCOUNT_CREATED',
    entityType: 'staff',
    entityId: staffId,
    details: { role, unit },
    req,
  })

  return res.status(201).json({ ok: true })
})

adminRouter.patch('/staff/:staffId', async (req, res) => {
  const { staffId } = req.params
  const { email, name, role, unit, password } = req.body ?? {}

  if (!email || !role) {
    return res.status(400).json({ error: 'email and role are required' })
  }
  if (!STAFF_ROLES.includes(role)) {
    return res.status(400).json({ error: `role must be one of ${STAFF_ROLES.join(', ')}` })
  }
  if (unit && !UNITS.includes(unit)) {
    return res.status(400).json({ error: `unit must be one of ${UNITS.join(', ')}` })
  }

  const [existing] = await pool.query('SELECT staff_id FROM staff WHERE staff_id = ?', [staffId])
  if (existing.length === 0) {
    return res.status(404).json({ error: 'Staff account not found' })
  }

  try {
    if (password) {
      const passwordHash = await hashPassword(password)
      await pool.query(
        'UPDATE staff SET email = ?, name = ?, role = ?, unit = ?, password_hash = ? WHERE staff_id = ?',
        [email, name ?? null, role, unit ?? null, passwordHash, staffId],
      )
    } else {
      await pool.query(
        'UPDATE staff SET email = ?, name = ?, role = ?, unit = ? WHERE staff_id = ?',
        [email, name ?? null, role, unit ?? null, staffId],
      )
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A staff account with this email already exists' })
    }
    throw err
  }

  await logAudit({
    actorType: 'staff',
    actorId: req.user.sub,
    action: 'STAFF_ACCOUNT_UPDATED',
    entityType: 'staff',
    entityId: staffId,
    details: { role, unit },
    req,
  })

  return res.json({ ok: true })
})

adminRouter.delete('/staff/:staffId', async (req, res) => {
  const { staffId } = req.params

  if (staffId === req.user.sub) {
    return res.status(400).json({ error: 'You cannot delete your own account' })
  }

  const [result] = await pool.query('DELETE FROM staff WHERE staff_id = ?', [staffId])
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Staff account not found' })
  }

  await logAudit({
    actorType: 'staff',
    actorId: req.user.sub,
    action: 'STAFF_ACCOUNT_DELETED',
    entityType: 'staff',
    entityId: staffId,
    req,
  })

  return res.json({ ok: true })
})

adminRouter.patch('/staff/:staffId/status', async (req, res) => {
  const { staffId } = req.params
  const { isActive } = req.body ?? {}

  await pool.query('UPDATE staff SET is_active = ? WHERE staff_id = ?', [isActive ? 1 : 0, staffId])
  await logAudit({
    actorType: 'staff',
    actorId: req.user.sub,
    action: isActive ? 'STAFF_ACCOUNT_ENABLED' : 'STAFF_ACCOUNT_DISABLED',
    entityType: 'staff',
    entityId: staffId,
    req,
  })

  return res.json({ ok: true })
})
