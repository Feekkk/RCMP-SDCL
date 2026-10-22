import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/useAuth'

// Guards a page to one or more roles: redirects to /login when there is no
// session, and to `fallbackTo` when the session holds a different role. This
// is a UI convenience only — every API route enforces the same check
// server-side (requireAuth/requireRole), per CLAUDE.md.
export function useRoleGuard(allowedRoles, fallbackTo = '/dashboard') {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    if (!allowedRoles.includes(user.role)) {
      navigate({ to: fallbackTo })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, navigate, fallbackTo])

  const ready = !loading && !!user && allowedRoles.includes(user.role)
  return { user, loading, ready }
}
