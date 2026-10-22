import { Router } from 'express'
import { pool } from '../db.js'
import { config } from '../config.js'
import { verifyPassword } from '../lib/password.js'
import { signSession } from '../lib/jwt.js'
import { requireAuth } from '../middleware/auth.js'
import { logAudit } from '../lib/audit.js'

export const authRouter = Router()

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.cookieSecure,
  sameSite: 'lax',
  maxAge: 8 * 60 * 60 * 1000,
}

authRouter.post('/login', async (req, res) => {
  if (!config.enablePasswordLogin) {
    return res.status(403).json({ error: 'ID/password login is disabled. Use Microsoft SSO.' })
  }

  const { role, identifier, password } = req.body ?? {}
  if (!identifier || !password || !['student', 'staff'].includes(role)) {
    return res.status(400).json({ error: 'role, identifier and password are required' })
  }

  try {
    if (role === 'student') {
      const [rows] = await pool.query(
        'SELECT student_id, password_hash, name, email, consent_at FROM students WHERE student_id = ? LIMIT 1',
        [identifier],
      )
      const student = rows[0]
      const ok = student && (await verifyPassword(password, student.password_hash))
      if (!ok) {
        await logAudit({ actorType: 'student', actorId: identifier, action: 'LOGIN_FAILED', req })
        return res.status(401).json({ error: 'Invalid ID or password' })
      }

      const token = signSession({ sub: student.student_id, type: 'student', role: 'STUDENT' })
      res.cookie(config.jwt.cookieName, token, COOKIE_OPTIONS)
      await pool.query('UPDATE students SET last_login_at = NOW() WHERE student_id = ?', [student.student_id])
      await logAudit({ actorType: 'student', actorId: student.student_id, action: 'LOGIN_SUCCESS', req })

      return res.json({
        user: {
          id: student.student_id,
          type: 'student',
          role: 'STUDENT',
          name: student.name,
          email: student.email,
          needsConsent: !student.consent_at,
        },
      })
    }

    // role === 'staff'
    const [rows] = await pool.query(
      'SELECT staff_id, password_hash, name, email, role, unit, is_active FROM staff WHERE staff_id = ? LIMIT 1',
      [identifier],
    )
    const staff = rows[0]
    const ok = staff && staff.is_active && (await verifyPassword(password, staff.password_hash))
    if (!ok) {
      await logAudit({ actorType: 'staff', actorId: identifier, action: 'LOGIN_FAILED', req })
      return res.status(401).json({ error: 'Invalid ID or password' })
    }

    const token = signSession({
      sub: staff.staff_id,
      type: 'staff',
      role: staff.role,
      unit: staff.unit,
    })
    res.cookie(config.jwt.cookieName, token, COOKIE_OPTIONS)
    await pool.query('UPDATE staff SET last_login_at = NOW() WHERE staff_id = ?', [staff.staff_id])
    await logAudit({ actorType: 'staff', actorId: staff.staff_id, action: 'LOGIN_SUCCESS', req })

    return res.json({
      user: {
        id: staff.staff_id,
        type: 'staff',
        role: staff.role,
        unit: staff.unit,
        name: staff.name,
        email: staff.email,
      },
    })
  } catch (err) {
    req.log?.error?.(err)
    return res.status(500).json({ error: 'Login failed' })
  }
})

authRouter.post('/logout', requireAuth, async (req, res) => {
  res.clearCookie(config.jwt.cookieName, COOKIE_OPTIONS)
  await logAudit({ actorType: req.user.type, actorId: req.user.sub, action: 'LOGOUT', req })
  return res.json({ ok: true })
})

authRouter.get('/me', requireAuth, (req, res) => {
  return res.json({ user: req.user })
})
