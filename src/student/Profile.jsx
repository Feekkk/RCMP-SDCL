import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'
import NavBar from './NavBar.jsx'
import { useRoleGuard } from '@/lib/useRoleGuard'
import { logout } from '@/lib/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const EMPTY_FORM = {
  program: '',
  currentSemester: '',
  contactNumber: '',
  bankName: '',
  bankNumber: '',
}

const initials = (name) =>
  (name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?'

// Profile is completed before any application can be submitted (CLAUDE.md).
// Student ID, name, and email come from the SSO session and are read-only here.
export default function StudentProfile() {
  const navigate = useNavigate()
  const { user, ready } = useRoleGuard(['STUDENT'])
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!ready) return
    fetch('/api/students/me/profile', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setProfile(data)
        setForm({
          program: data.program ?? '',
          currentSemester: data.currentSemester ?? '',
          contactNumber: data.contactNumber ?? '',
          bankName: data.bankName ?? '',
          bankNumber: data.bankNumber ?? '',
        })
      })
      .catch(() => setLoadError('Could not load your profile. Please try again.'))
  }, [ready])

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  const handleChange = (field) => (event) => {
    setSaved(false)
    setForm((f) => ({ ...f, [field]: event.target.value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setSaveError('')
    setSaved(false)
    try {
      const res = await fetch('/api/students/me/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSaved(true)
    } catch {
      setSaveError('Could not save your profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!ready || (!profile && !loadError)) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">Loading…</div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <NavBar user={user} onLogout={handleLogout} />

      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/student"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>

          {loadError && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {loadError}
            </div>
          )}

          {profile && (
            <>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {initials(profile.name)}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">{profile.name ?? 'My Profile'}</h1>
                  <p className="text-sm text-muted-foreground">Student ID {profile.studentId}</p>
                </div>
              </div>

              <form className="mt-8 space-y-8" onSubmit={handleSave}>
                <section className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Account
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Linked to your Microsoft sign-in — managed by SDCL, not editable here.
                  </p>
                  <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-muted-foreground">Student ID</dt>
                      <dd className="mt-0.5 text-sm font-medium text-foreground">{profile.studentId}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Name</dt>
                      <dd className="mt-0.5 text-sm font-medium text-foreground">{profile.name ?? '—'}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-muted-foreground">Microsoft SSO email</dt>
                      <dd className="mt-0.5 text-sm font-medium text-foreground">{profile.email}</dd>
                    </div>
                  </dl>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Study details
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="program">Program</Label>
                      <Input id="program" value={form.program} onChange={handleChange('program')} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="currentSemester">Current semester</Label>
                      <Input
                        id="currentSemester"
                        value={form.currentSemester}
                        onChange={handleChange('currentSemester')}
                        required
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Contact &amp; banking
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Used for application updates and reimbursements.
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <ShieldCheck className="size-3.5" />
                      Kept private
                    </span>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="contactNumber">Phone number</Label>
                      <Input
                        id="contactNumber"
                        type="tel"
                        value={form.contactNumber}
                        onChange={handleChange('contactNumber')}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="bankName">Bank name</Label>
                        <Input id="bankName" value={form.bankName} onChange={handleChange('bankName')} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bankNumber">Bank account number</Label>
                        <Input
                          id="bankNumber"
                          value={form.bankNumber}
                          onChange={handleChange('bankNumber')}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save profile'}
                  </Button>
                  {saved && (
                    <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                      <CheckCircle2 className="size-4" />
                      Saved
                    </span>
                  )}
                  {saveError && (
                    <span className="flex items-center gap-1.5 text-sm text-destructive">
                      <AlertCircle className="size-4" />
                      {saveError}
                    </span>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
