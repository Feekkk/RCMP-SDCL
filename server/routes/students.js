import path from 'node:path'
import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'
import { encryptField, decryptField } from '../lib/crypto.js'
import { logAudit } from '../lib/audit.js'
import { uploadApplicationDocuments, UPLOAD_ROOT } from '../lib/uploads.js'

export const studentsRouter = Router()

// Human-readable reference built from the module and the row's own
// auto-increment id, so it's unique and always increasing without a
// separate sequence/counter to keep in sync. Stored on the row itself
// (application_no, uniquely indexed) so lookups don't need to recompute it.
const MODULE_PREFIX = { WELFARE: 'WEL', MEDICAL: 'MED' }
const buildApplicationNo = (module, id) => `${MODULE_PREFIX[module] ?? 'APP'}-${String(id).padStart(6, '0')}`

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

// Dependants are part of the profile (completed once, before any
// application) rather than re-entered on every Welfare form that needs a
// Dependants Form (CLAUDE.md: profile is completed first).
studentsRouter.get('/me/dependants', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, name, ic_number_enc, relationship, status, income
       FROM dependants WHERE student_id = ? ORDER BY id ASC`,
    [req.user.sub],
  )

  return res.json(
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      icNumber: decryptField(row.ic_number_enc),
      relationship: row.relationship,
      status: row.status,
      income: row.income,
    })),
  )
})

studentsRouter.put('/me/dependants', async (req, res) => {
  const dependants = Array.isArray(req.body?.dependants) ? req.body.dependants : []

  for (const d of dependants) {
    if (!d.name?.trim() || !d.icNumber?.trim() || !d.relationship?.trim() || !d.status) {
      return res.status(400).json({ error: 'Each dependant needs a name, IC number, relationship, and status' })
    }
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    await connection.query('DELETE FROM dependants WHERE student_id = ?', [req.user.sub])
    for (const d of dependants) {
      await connection.query(
        `INSERT INTO dependants (student_id, name, ic_number_enc, relationship, status, income)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.user.sub,
          d.name.trim(),
          encryptField(d.icNumber.trim()),
          d.relationship.trim(),
          d.status,
          d.income || null,
        ],
      )
    }
    await connection.commit()
  } catch (err) {
    await connection.rollback()
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    connection.release()
  }

  await logAudit({
    actorType: 'student',
    actorId: req.user.sub,
    action: 'DEPENDANTS_UPDATED',
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

// Categories are data (CLAUDE.md), so the form's required fields/documents
// come from here rather than being hard-coded per module.
studentsRouter.get('/categories', async (req, res) => {
  const module = String(req.query.module ?? '').toUpperCase()
  if (!['WELFARE', 'MEDICAL'].includes(module)) {
    return res.status(400).json({ error: 'module must be WELFARE or MEDICAL' })
  }

  const [rows] = await pool.query(
    `SELECT id, code, name, amount_label, notes, required_documents
       FROM categories
      WHERE module = ? AND is_active = TRUE
      ORDER BY sort_order ASC`,
    [module],
  )

  return res.json(
    rows.map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      amountLabel: row.amount_label,
      notes: row.notes,
      requiredDocuments: row.required_documents,
    })),
  )
})

studentsRouter.get('/me/applications', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.id, a.application_no, a.module, a.status, a.reason, a.submitted_at, a.decided_at,
            c.code AS category_code, c.name AS category_name
       FROM applications a
       JOIN categories c ON c.id = a.category_id
      WHERE a.student_id = ?
      ORDER BY a.submitted_at DESC`,
    [req.user.sub],
  )

  return res.json(
    rows.map((row) => ({
      id: row.id,
      applicationNo: row.application_no,
      module: row.module,
      categoryCode: row.category_code,
      categoryName: row.category_name,
      status: row.status,
      reason: row.reason,
      submittedAt: row.submitted_at,
      decidedAt: row.decided_at,
    })),
  )
})

// Submits an application for the chosen category. Required documents are
// uploaded in the same order as the category's required_documents list, one
// file per entry — the form enforces this before it lets the student submit.
studentsRouter.post('/me/applications', (req, res, next) => {
  uploadApplicationDocuments(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message })
    return next()
  })
}, async (req, res) => {
  const categoryId = Number(req.body?.categoryId)
  const reason = req.body?.reason ?? null
  const files = req.files ?? []

  let details = null
  if (req.body?.details) {
    try {
      details = JSON.parse(req.body.details)
    } catch {
      return res.status(400).json({ error: 'details must be valid JSON' })
    }
  }

  if (!categoryId) {
    return res.status(400).json({ error: 'categoryId is required' })
  }

  const [categoryRows] = await pool.query(
    'SELECT id, module, required_documents FROM categories WHERE id = ? AND is_active = TRUE LIMIT 1',
    [categoryId],
  )
  const category = categoryRows[0]
  if (!category) {
    return res.status(404).json({ error: 'Category not found' })
  }

  const requiredDocuments = category.required_documents
  if (files.length !== requiredDocuments.length) {
    return res.status(400).json({
      error: `This category needs ${requiredDocuments.length} document(s), received ${files.length}.`,
    })
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    const [result] = await connection.query(
      `INSERT INTO applications (student_id, category_id, module, reason, details)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.sub, category.id, category.module, reason, details ? JSON.stringify(details) : null],
    )
    const applicationId = result.insertId
    const applicationNo = buildApplicationNo(category.module, applicationId)
    await connection.query('UPDATE applications SET application_no = ? WHERE id = ?', [
      applicationNo,
      applicationId,
    ])

    for (const [index, file] of files.entries()) {
      await connection.query(
        `INSERT INTO application_documents
           (application_id, label, original_filename, stored_path, mime_type, size_bytes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          applicationId,
          requiredDocuments[index]?.label ?? 'Supporting document',
          file.originalname,
          path.relative(UPLOAD_ROOT, file.path),
          file.mimetype,
          file.size,
        ],
      )
    }

    await connection.commit()

    await logAudit({
      actorType: 'student',
      actorId: req.user.sub,
      action: 'APPLICATION_SUBMITTED',
      entityType: 'application',
      entityId: String(applicationId),
      details: { module: category.module, categoryId: category.id },
      req,
    })

    return res.status(201).json({
      id: applicationId,
      applicationNo,
      status: 'PENDING',
    })
  } catch (err) {
    await connection.rollback()
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    connection.release()
  }
})
