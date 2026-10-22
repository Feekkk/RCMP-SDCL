import { useEffect, useState } from 'react'

// Reads the current session from the server (httpOnly cookie, never
// inspected client-side) so pages can guard themselves by role/unit.
export function useAuth() {
  const [state, setState] = useState({ user: null, loading: true })

  useEffect(() => {
    let cancelled = false

    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Not authenticated')
        const data = await res.json()
        if (!cancelled) setState({ user: data.user, loading: false })
      })
      .catch(() => {
        if (!cancelled) setState({ user: null, loading: false })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
}
