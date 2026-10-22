import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'
import { encryptField, decryptField } from '../lib/crypto.js'
import { logAudit } from '../lib/audit.js'

export const studentsRouter = Router()

studentsRouter.use(requireAuth, requireRole('STUDENT'))

// Profile is completed first, before any application (CLAUDE.md).
studentsRouter.get('/me/profile', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT student_id, email, name, program, current_semester, bank_name,
            contact_number_enc, bank_number_enc, consent_at
       FROM students WHERE student_id = ? LIMIT 1`,
    [req.user.sub],
  )
  const student = rows[0]
  if (!student) return res.status(404).json({ error: 'Student not found' })

  return res.json({
    studentId: student.student_id,
    email: student.email,
    name: student.name,
    program: student.program,
    currentSemester: student.current_semester,
    bankName: student.bank_name,
    contactNumber: decryptField(student.contact_number_enc),
    bankNumber: decryptField(student.bank_number_enc),
    consentAt: student.consent_at,
  })
})

studentsRouter.put('/me/profile', async (req, res) => {
  const { program, currentSemester, contactNumber, bankName, bankNumber } = req.body ?? {}

  await pool.query(
    `UPDATE students
        SET program = ?, current_semester = ?, bank_name = ?,
            contact_number_enc = ?, bank_number_enc = ?
      WHERE student_id = ?`,
    [
      program ?? null,
      currentSemester ?? null,
      bankName ?? null,
      encryptField(contactNumber),
      encryptField(bankNumber),
      req.user.sub,
    ],
  )

  await logAudit({
    actorType: 'student',
    actorId: req.user.sub,
    action: 'PROFILE_UPDATED',
    entityType: 'student',
    entityId: req.user.sub,
    req,
  })

  return res.json({ ok: true })
})

// Consent is shown on first use and logged once (no versioning needed).
studentsRouter.post('/me/consent', async (req, res) => {
  const [rows] = await pool.query('SELECT consent_at FROM students WHERE student_id = ? LIMIT 1', [
    req.user.sub,
  ])
  if (rows[0]?.consent_at) {
    return res.json({ consentAt: rows[0].consent_at })
  }

  await pool.query('UPDATE students SET consent_at = NOW() WHERE student_id = ?', [req.user.sub])
  await logAudit({
    actorType: 'student',
    actorId: req.user.sub,
    action: 'CONSENT_GIVEN',
    entityType: 'student',
    entityId: req.user.sub,
    req,
  })

  const [updated] = await pool.query('SELECT consent_at FROM students WHERE student_id = ? LIMIT 1', [
    req.user.sub,
  ])
  return res.json({ consentAt: updated[0].consent_at })
})
