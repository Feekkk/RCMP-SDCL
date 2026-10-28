import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'
import { logAudit } from '../lib/audit.js'

export const fundsRouter = Router()

const MODULES = ['WELFARE', 'MEDICAL']
// Roles that can be assigned as a fund's recommender/approver.
const ASSIGNABLE_ROLES = ['SYSTEM_ADMIN', 'SD_STAFF', 'CL_STAFF', 'SRD_STAFF', 'HOD', 'DD', 'CEO', 'BOARD']

// Funds = the Welfare/Medical `categories` table (CLAUDE.md: categories are
// data, not hard-coded). Only System Admin manages this list.
fundsRouter.use(requireAuth, requireRole('SYSTEM_ADMIN'))

const normalizeDocuments = (value) => {
  if (!Array.isArray(value)) return null
  const labels = value
    .map((doc) => (typeof doc === 'string' ? doc : doc?.label))
    .map((label) => (typeof label === 'string' ? label.trim() : ''))
    .filter(Boolean)
  return labels.map((label) => ({ label }))
}

const normalizeRoles = (value) => {
  if (!Array.isArray(value)) return []
  const roles = [...new Set(value.filter((r) => ASSIGNABLE_ROLES.includes(r)))]
  return roles
}

fundsRouter.get('/', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, module, code, name, amount_label, notes, required_documents, recommender_roles, approver_roles, sort_order, is_active, created_at
       FROM categories
      ORDER BY module ASC, sort_order ASC, name ASC`,
  )
  return res.json({ funds: rows })
})

fundsRouter.post('/', async (req, res) => {
  const { module, code, name, amountLabel, notes, requiredDocuments, recommenderRoles, approverRoles, sortOrder } =
    req.body ?? {}

  if (!module || !MODULES.includes(module)) {
    return res.status(400).json({ error: `module must be one of ${MODULES.join(', ')}` })
  }
  if (!code || !name) {
    return res.status(400).json({ error: 'code and name are required' })
  }
  const documents = normalizeDocuments(requiredDocuments)
  if (!documents || documents.length === 0) {
    return res.status(400).json({ error: 'At least one required document is needed' })
  }
  const recommenders = normalizeRoles(recommenderRoles)
  const approvers = normalizeRoles(approverRoles)
  if (approvers.length === 0) {
    return res.status(400).json({ error: 'At least one approver role is needed' })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO categories (module, code, name, amount_label, notes, required_documents, recommender_roles, approver_roles, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        module,
        code,
        name,
        amountLabel || null,
        notes || null,
        JSON.stringify(documents),
        JSON.stringify(recommenders),
        JSON.stringify(approvers),
        sortOrder ?? 0,
      ],
    )

    await logAudit({
      actorType: 'staff',
      actorId: req.user.sub,
      action: 'FUND_CREATED',
      entityType: 'category',
      entityId: result.insertId,
      details: { module, code, recommenders, approvers },
      req,
    })

    return res.status(201).json({ ok: true, id: result.insertId })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A fund with this code already exists for this module' })
    }
    throw err
  }
})

fundsRouter.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { module, code, name, amountLabel, notes, requiredDocuments, recommenderRoles, approverRoles, sortOrder } =
    req.body ?? {}

  if (!module || !MODULES.includes(module)) {
    return res.status(400).json({ error: `module must be one of ${MODULES.join(', ')}` })
  }
  if (!code || !name) {
    return res.status(400).json({ error: 'code and name are required' })
  }
  const documents = normalizeDocuments(requiredDocuments)
  if (!documents || documents.length === 0) {
    return res.status(400).json({ error: 'At least one required document is needed' })
  }
  const recommenders = normalizeRoles(recommenderRoles)
  const approvers = normalizeRoles(approverRoles)
  if (approvers.length === 0) {
    return res.status(400).json({ error: 'At least one approver role is needed' })
  }

  const [existing] = await pool.query('SELECT id FROM categories WHERE id = ?', [id])
  if (existing.length === 0) {
    return res.status(404).json({ error: 'Fund not found' })
  }

  try {
    await pool.query(
      `UPDATE categories
          SET module = ?, code = ?, name = ?, amount_label = ?, notes = ?, required_documents = ?,
              recommender_roles = ?, approver_roles = ?, sort_order = ?
        WHERE id = ?`,
      [
        module,
        code,
        name,
        amountLabel || null,
        notes || null,
        JSON.stringify(documents),
        JSON.stringify(recommenders),
        JSON.stringify(approvers),
        sortOrder ?? 0,
        id,
      ],
    )
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A fund with this code already exists for this module' })
    }
    throw err
  }

  await logAudit({
    actorType: 'staff',
    actorId: req.user.sub,
    action: 'FUND_UPDATED',
    entityType: 'category',
    entityId: id,
    details: { module, code, recommenders, approvers },
    req,
  })

  return res.json({ ok: true })
})

fundsRouter.patch('/:id/status', async (req, res) => {
  const { id } = req.params
  const { isActive } = req.body ?? {}

  const [result] = await pool.query('UPDATE categories SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id])
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Fund not found' })
  }

  await logAudit({
    actorType: 'staff',
    actorId: req.user.sub,
    action: isActive ? 'FUND_ENABLED' : 'FUND_DISABLED',
    entityType: 'category',
    entityId: id,
    req,
  })

  return res.json({ ok: true })
})

fundsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fund not found' })
    }
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({ error: 'This fund has existing applications and cannot be deleted. Disable it instead.' })
    }
    throw err
  }

  await logAudit({
    actorType: 'staff',
    actorId: req.user.sub,
    action: 'FUND_DELETED',
    entityType: 'category',
    entityId: id,
    req,
  })

  return res.json({ ok: true })
})
