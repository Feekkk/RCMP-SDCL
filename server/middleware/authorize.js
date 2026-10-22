// requireRole('SYSTEM_ADMIN') or requireRole('SD_STAFF', 'CEO', 'BOARD') etc.
// Must run after requireAuth. Students carry role 'STUDENT'.
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' })
    }
    return next()
  }
}

// requireUnit('SD') restricts staff to acting only within their own unit.
export function requireUnit(...allowedUnits) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    if (req.user.role === 'SYSTEM_ADMIN') return next()
    if (!allowedUnits.includes(req.user.unit)) {
      return res.status(403).json({ error: 'Forbidden: outside your unit' })
    }
    return next()
  }
}
