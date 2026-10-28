import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import multer from 'multer'

// Supporting documents are stored as-is on disk — CLAUDE.md says uploaded
// documents are not encrypted, standard file types and size limits apply.
const UPLOAD_ROOT = path.resolve(import.meta.dirname, '../../uploads/applications')
const ALLOWED_MIME_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png'])
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

fs.mkdirSync(UPLOAD_ROOT, { recursive: true })

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

// Documents are grouped by the upload date (uploads/applications/<year>/<month>)
// so the folder stays browsable as volume grows.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const now = new Date()
    const dir = path.join(UPLOAD_ROOT, String(now.getFullYear()), MONTH_NAMES[now.getMonth()])
    fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).slice(0, 10)
    cb(null, `${crypto.randomUUID()}${ext}`)
  },
})

export const uploadApplicationDocuments = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 10 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error('Unsupported file type. Upload a PDF, JPG, or PNG.'))
    }
    return cb(null, true)
  },
}).array('documents', 10)

export { UPLOAD_ROOT }
