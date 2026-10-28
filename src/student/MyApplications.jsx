import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Inbox,
  AlertCircle,
  ClipboardList,
  HandCoins,
  Stethoscope,
} from 'lucide-react'
import NavBar from './NavBar.jsx'
import { STATUS } from './applicationStatus.js'
import { useRoleGuard } from '@/lib/useRoleGuard'
import { logout } from '@/lib/useAuth'

const MODULE_LABEL = { WELFARE: 'Student Welfare', MEDICAL: 'Medical Outpatient' }
const MODULE_ICON = { WELFARE: HandCoins, MEDICAL: Stethoscope }

export default function MyApplications() {
  const navigate = useNavigate()
  const { user, ready } = useRoleGuard(['STUDENT'])
  const [applications, setApplications] = useState(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!ready) return
    fetch('/api/students/me/applications', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setApplications)
      .catch(() => setLoadError('Could not load your applications. Please try again.'))
  }, [ready])

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  if (!ready || (!applications && !loadError)) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">Loading…</div>
    )
  }

  const counts = {
    total: applications?.length ?? 0,
    pending: applications?.filter((a) => a.status === 'PENDING' || a.status === 'RECOMMENDED').length ?? 0,
    approved: applications?.filter((a) => a.status === 'APPROVED').length ?? 0,
    rejected: applications?.filter((a) => a.status === 'REJECTED').length ?? 0,
  }

  return (
    <div className="flex min-h-screen bg-background">
      <NavBar user={user} onLogout={handleLogout} />

      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mt-4 flex items-center gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ClipboardList className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">My applications</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Track the status of everything you&apos;ve submitted to SDCL.
              </p>
            </div>
          </div>

          {loadError && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {loadError}
            </div>
          )}

          {applications && applications.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatTile label="Total" value={counts.total} className="bg-primary/10 text-primary" />
              <StatTile label="Pending" value={counts.pending} className="bg-amber-500/10 text-amber-600" />
              <StatTile label="Approved" value={counts.approved} className="bg-emerald-500/10 text-emerald-600" />
              <StatTile label="Rejected" value={counts.rejected} className="bg-destructive/10 text-destructive" />
            </div>
          )}

          {applications && (
            applications.length > 0 ? (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="px-5 py-3 font-medium">Application No.</th>
                      <th className="px-5 py-3 font-medium">Module</th>
                      <th className="px-5 py-3 font-medium">Category</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Submitted</th>
                      <th className="px-5 py-3 font-medium">Decided</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {applications.map((app) => {
                      const status = STATUS[app.status] ?? STATUS.PENDING
                      const StatusIcon = status.icon
                      const ModuleIcon = MODULE_ICON[app.module] ?? ClipboardList
                      return (
                        <tr key={app.id}>
                          <td className="px-5 py-3.5 font-mono text-xs font-medium text-foreground">
                            {app.applicationNo}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <ModuleIcon className="size-4" />
                              </div>
                              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {MODULE_LABEL[app.module] ?? app.module}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-foreground">{app.categoryName}</td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                            >
                              <StatusIcon className="size-3.5" />
                              {status.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">
                            {app.decidedAt ? new Date(app.decidedAt).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
                <Inbox className="size-6 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Nothing here yet</p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Once you submit an application, you&apos;ll be able to see and track it right here.
                </p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  )
}

function StatTile({ label, value, className }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>
        {label}
      </span>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}
