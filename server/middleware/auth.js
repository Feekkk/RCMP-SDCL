import { config } from '../config.js'
import { verifySession } from '../lib/jwt.js'

// Verifies the session cookie and attaches req.user. Every protected route
// must go through this — access control is enforced server-side, not just
// by hiding UI (CLAUDE.md).
export function requireAuth(req, res, next) {
  const token = req.cookies?.[config.jwt.cookieName]
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const payload = verifySession(token)
    req.user = payload
    return next()
  } catch {
    return res.status(401).json({ error: 'Session expired or invalid' })
  }
}
