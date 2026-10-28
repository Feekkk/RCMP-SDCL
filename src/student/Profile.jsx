import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Plus,
  Trash2,
  IdCard,
  GraduationCap,
  Phone,
  Users,
} from 'lucide-react'
import NavBar from './NavBar.jsx'
import { DEPENDANT_STATUSES, ageFromIc, emptyDependant } from './dependants.js'
import { useRoleGuard } from '@/lib/useRoleGuard'
import { logout } from '@/lib/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PROGRAMS = [
  'Foundation in Medical Sciences',
  'Diploma in Pharmacy',
  'Diploma in Nursing',
  'Diploma in Physiotherapy',
  'Diploma in Medical Imaging',
  'Advance Diploma in midwifery',
  'Bachelor of Medicine and Bachelor of Surgery (MBBS)',
  'Bachelor of Pharmacy (Hons)',
  'Bachelor of Pharmaceutical Technology (Hons)',
  'Bachelor of Nursing Science(Hons)',
  'Bachelor of Physiotherapy (Hons)',
  'Bachelor of Science in Psychology (Hons)',
  'Master of Medical Science',
  'Master of Science (Pharmacy)',
  'Master of Public Health',
  'Master of Science in Public Health',
  'Doctor of Philosophy (Medical Sciences)',
  'Doctor of Philosophy (Pharmacy)',
]

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

  const [programIsOther, setProgramIsOther] = useState(false)

  const [dependants, setDependants] = useState([])
  const [dependantsSaving, setDependantsSaving] = useState(false)
  const [dependantsSaved, setDependantsSaved] = useState(false)
  const [dependantsError, setDependantsError] = useState('')

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
        setProgramIsOther(Boolean(data.program) && !PROGRAMS.includes(data.program))
      })
      .catch(() => setLoadError('Could not load your profile. Please try again.'))

    fetch('/api/students/me/dependants', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setDependants(data.length ? data : []))
      .catch(() => setDependantsError('Could not load your dependants. Please try again.'))
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

  const updateDependant = (index, field, value) => {
    setDependantsSaved(false)
    setDependants((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const addDependant = () => {
    setDependantsSaved(false)
    setDependants((prev) => [...prev, emptyDependant()])
  }

  const removeDependant = (index) => {
    setDependantsSaved(false)
    setDependants((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveDependants = async (event) => {
    event.preventDefault()
    setDependantsSaving(true)
    setDependantsError('')
    setDependantsSaved(false)
    try {
      const res = await fetch('/api/students/me/dependants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ dependants }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not save your dependants.')
      }
      setDependantsSaved(true)
    } catch (err) {
      setDependantsError(err.message || 'Could not save your dependants. Please try again.')
    } finally {
      setDependantsSaving(false)
    }
  }

  if (!ready || (!profile && !loadError)) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">Loading…</div>
    )
  }

  const completionFields = profile
    ? [
        Boolean(form.program),
        Boolean(form.currentSemester),
        Boolean(form.contactNumber),
        Boolean(form.bankName && form.bankNumber),
      ]
    : []
  const completionCount = completionFields.filter(Boolean).length
  const completionTotal = completionFields.length
  const profileComplete = completionTotal > 0 && completionCount === completionTotal

  return (
    <div className="flex min-h-screen bg-background">
      <NavBar user={user} onLogout={handleLogout} />

      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-5xl">

          {loadError && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {loadError}
            </div>
          )}

          {profile && (
            <>
              <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-xl font-semibold text-primary ring-4 ring-primary/5">
                    {initials(profile.name)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground">{profile.name ?? 'My Profile'}</h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Student ID {profile.studentId} · {profile.email}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-1.5 sm:items-end">
                  <span
                    className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-semibold sm:self-end ${
                      profileComplete
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {profileComplete ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                    {profileComplete ? 'Profile complete' : `${completionCount}/${completionTotal} sections complete`}
                  </span>
                  <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${completionTotal ? (completionCount / completionTotal) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <form className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-12" onSubmit={handleSave}>
                <section className="rounded-2xl border border-border bg-card p-6 md:col-span-5">
                  <SectionHeader
                    icon={IdCard}
                    title="Account"
                    description="Your basic information is provided by the Microsoft."
                  />
                  <dl className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-muted/30 p-4">
                    <div>
                      <dt className="text-xs text-muted-foreground">Student ID</dt>
                      <dd className="mt-0.5 text-sm font-medium text-foreground">{profile.studentId}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Name</dt>
                      <dd className="mt-0.5 text-sm font-medium text-foreground">{profile.name ?? '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Microsoft SSO email</dt>
                      <dd className="mt-0.5 truncate text-sm font-medium text-foreground">{profile.email}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Consent</dt>
                      <dd className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                        {profile.consentAt ? (
                          <>
                            <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                            Agreed on{' '}
                            {new Date(profile.consentAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </>
                        ) : (
                          <>
                            <AlertCircle className="size-3.5 shrink-0 text-amber-600" />
                            Not yet agreed
                          </>
                        )}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6 md:col-span-7">
                  <SectionHeader icon={GraduationCap} title="Study Details" description="Update your academic information." />
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="program">Programme</Label>
                      <Select
                        value={programIsOther ? 'Other' : form.program}
                        onValueChange={(value) => {
                          setSaved(false)
                          setProgramIsOther(value === 'Other')
                          setForm((f) => ({ ...f, program: value === 'Other' ? '' : value }))
                        }}
                      >
                        <SelectTrigger id="program" className="w-full">
                          <SelectValue placeholder="Choose your programme" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROGRAMS.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {programIsOther && (
                        <Input
                          className="mt-2"
                          placeholder="Enter your programme"
                          value={form.program}
                          onChange={handleChange('program')}
                          required
                        />
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="currentSemester" placeholder="Current semester">
                        Current semester
                      </Label>
                      <Input
                        id="currentSemester"
                        value={form.currentSemester}
                        onChange={handleChange('currentSemester')}
                        required
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6 md:col-span-12">
                  <div className="flex items-start justify-between gap-3">
                    <SectionHeader
                      icon={Phone}
                      title="Contact & Banking"
                      description="Used for application updates and reimbursements."
                    />
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <ShieldCheck className="size-3.5" />
                      Kept private
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                </section>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 md:col-span-12">
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

              <form className="mt-6" onSubmit={handleSaveDependants}>
                <section className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-start justify-between gap-3">
                    <SectionHeader
                      icon={Users}
                      title="Dependants"
                      description="Used to pre-fill the Dependants Form on Welfare applications that need one."
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addDependant}>
                      <Plus className="size-3.5" />
                      Add dependant
                    </Button>
                  </div>

                  {dependantsError && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                      <AlertCircle className="size-4 shrink-0" />
                      {dependantsError}
                    </div>
                  )}

                  {dependants.length === 0 ? (
                    <div className="mt-5 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
                      <Users className="size-6 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">No dependants added yet</p>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        Add one if your application requires a Dependants Form.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 flex flex-col gap-4">
                      {dependants.map((dependant, index) => {
                        const age = ageFromIc(dependant.icNumber)
                        const showIncome =
                          dependant.status === 'Employed' || dependant.status === 'Self-Employed'
                        return (
                          <div
                            key={dependant.id ?? index}
                            className="space-y-4 rounded-xl border border-border bg-muted/20 p-4"
                          >
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-foreground">
                                Dependant {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeDependant(index)}
                                className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
                              >
                                <Trash2 className="size-3.5" />
                                Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:flex lg:flex-nowrap lg:items-start">
                              <div className="space-y-1.5 lg:min-w-0 lg:flex-1">
                                <Label className="text-xs font-normal text-muted-foreground">Name</Label>
                                <Input
                                  value={dependant.name}
                                  onChange={(event) => updateDependant(index, 'name', event.target.value)}
                                  required
                                />
                              </div>
                              <div className="space-y-1.5 lg:min-w-0 lg:flex-1">
                                <Label className="text-xs font-normal text-muted-foreground">
                                  Identity Card Number
                                </Label>
                                <Input
                                  value={dependant.icNumber}
                                  onChange={(event) => updateDependant(index, 'icNumber', event.target.value)}
                                  placeholder="YYMMDD-PB-XXXX"
                                  required
                                />
                              </div>
                              <div className="space-y-1.5 lg:min-w-0 lg:flex-1">
                                <Label className="text-xs font-normal text-muted-foreground">Relationship</Label>
                                <Input
                                  value={dependant.relationship}
                                  onChange={(event) => updateDependant(index, 'relationship', event.target.value)}
                                  required
                                />
                              </div>
                              <div className="space-y-1.5 lg:w-24 lg:shrink-0">
                                <Label className="text-xs font-normal text-muted-foreground">
                                  Age
                                </Label>
                                <Input value={age} disabled placeholder="—" />
                              </div>
                              <div className="space-y-1.5 lg:min-w-0 lg:flex-1">
                                <Label className="text-xs font-normal text-muted-foreground">Status</Label>
                                <Select
                                  value={dependant.status}
                                  onValueChange={(value) => updateDependant(index, 'status', value)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {DEPENDANT_STATUSES.map((status) => (
                                      <SelectItem key={status} value={status}>
                                        {status}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              {showIncome && (
                                <div className="space-y-1.5 lg:min-w-0 lg:flex-1">
                                  <Label className="text-xs font-normal text-muted-foreground">Income</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={dependant.income ?? ''}
                                    onChange={(event) => updateDependant(index, 'income', event.target.value)}
                                    placeholder="RM"
                                    required
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </section>

                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                  <Button type="submit" disabled={dependantsSaving}>
                    {dependantsSaving ? 'Saving…' : 'Save dependants'}
                  </Button>
                  {dependantsSaved && (
                    <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                      <CheckCircle2 className="size-4" />
                      Saved
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

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4.5" />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}
