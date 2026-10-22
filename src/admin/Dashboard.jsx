import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Users, ShieldCheck } from 'lucide-react'
import NavBar from './NavBar.jsx'
import { useAuth, logout } from '@/lib/useAuth'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [staff, setStaff] = useState(null)

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    if (user.role !== 'SYSTEM_ADMIN') {
      navigate({ to: '/dashboard' })
    }
  }, [loading, user, navigate])

  useEffect(() => {
    if (user?.role !== 'SYSTEM_ADMIN') return
    fetch('/api/admin/staff', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setStaff(data.staff))
      .catch(() => setStaff([]))
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  if (loading || !user || user.role !== 'SYSTEM_ADMIN') {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading…</div>
  }

  const activeCount = staff?.filter((s) => s.is_active).length ?? null

  return (
    <div className="flex min-h-screen bg-background">
      <NavBar user={user} onLogout={handleLogout} />

      <main className="flex-1 px-8 py-8">
        <h1 className="text-2xl font-semibold text-foreground">System Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage staff accounts and oversee the SDCL portal.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" />
              <span className="text-sm">Staff accounts</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {staff === null ? '…' : staff.length}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-4" />
              <span className="text-sm">Active staff</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {activeCount === null ? '…' : activeCount}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Staff accounts</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">ID</th>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Role</th>
                  <th className="py-2 pr-4 font-medium">Unit</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {staff?.map((s) => (
                  <tr key={s.staff_id} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4 text-foreground">{s.staff_id}</td>
                    <td className="py-2 pr-4 text-foreground">{s.name}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{s.role}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{s.unit ?? '—'}</td>
                    <td className="py-2 pr-4">
                      <span className={s.is_active ? 'text-emerald-600' : 'text-destructive'}>
                        {s.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
                {staff && staff.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                      No staff accounts yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
