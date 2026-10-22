import crypto from 'node:crypto'
import { config } from '../config.js'

const ALGO = 'aes-256-gcm'
const key = Buffer.from(config.encryptionKeyHex, 'hex')

if (key.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be a 32-byte key encoded as 64 hex characters')
}

// Reversible authenticated encryption for phone/bank fields (never hashed —
// these must be decryptable for legitimate use, per CLAUDE.md).
export function encryptField(plaintext) {
  if (plaintext === null || plaintext === undefined || plaintext === '') return null
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGO, key, iv)
  const ciphertext = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return Buffer.concat([iv, authTag, ciphertext])
}

export function decryptField(buffer) {
  if (!buffer) return null
  const raw = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)
  const iv = raw.subarray(0, 12)
  const authTag = raw.subarray(12, 28)
  const ciphertext = raw.subarray(28)
  const decipher = crypto.createDecipheriv(ALGO, key, iv)
  decipher.setAuthTag(authTag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
}
