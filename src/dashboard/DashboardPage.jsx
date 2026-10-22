import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

// Placeholder landing point after login for non-admin roles. Role-specific
// dashboards (CLAUDE.md build order step 5) replace this once each unit's
// module exists.
export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Not authenticated')
        const data = await res.json()
        setUser(data.user)
      })
      .catch(() => {
        navigate({ to: '/login' })
      })
  }, [navigate])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    navigate({ to: '/login' })
  }

  if (!user) return null

  return (
    <div style={{ padding: '3rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome, {user.sub}</h1>
      <p>Type: {user.type}</p>
      <p>Role: {user.role}</p>
      {user.unit && <p>Unit: {user.unit}</p>}
      <button onClick={handleLogout}>Log out</button>
    </div>
  )
}
