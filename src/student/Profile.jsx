import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CheckCircle2, AlertCircle, ShieldCheck, Plus, Trash2, IdCard, GraduationCap, Phone, Users, ArrowRight } from 'lucide-react'
import StudentShell from './StudentShell.jsx'
import { StudentLoading, ErrorNote, formatDate } from './StudentUI.jsx'
import { DEPENDANT_STATUSES, ageFromIc, emptyDependant } from './dependants.js'
import StickerArt from '../landing/StickerArt.jsx'
import { useRoleGuard } from '@/lib/useRoleGuard'
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
    return <StudentLoading />
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
    <StudentShell user={user}>
      {loadError && <ErrorNote>{loadError}</ErrorNote>}

      {profile && (
        <>
          <section className="st-page-banner st-profile-banner st-tone-mint">
            <span className="st-profile-avatar">{initials(profile.name)}</span>
            <div className="st-profile-id">
              <p className="mg-script st-kicker">this is you</p>
              <h1 className="mg-display st-page-title">{profile.name ?? 'My profile'}</h1>
              <p>
                Student ID {profile.studentId} · {profile.email}
              </p>
            </div>
            <div className="st-profile-progress">
              <span className={`st-status st-tone-${profileComplete ? 'aqua' : 'butter'}`}>
                {profileComplete ? <CheckCircle2 /> : <AlertCircle />}
                {profileComplete ? 'Profile complete' : `${completionCount}/${completionTotal} sections complete`}
              </span>
              <div className="st-meter">
                <span style={{ width: `${completionTotal ? (completionCount / completionTotal) * 100 : 0}%` }} />
              </div>
              {profileComplete && (
                <Link to="/student" hash="funds" className="pill pill-orange pill-sm">
                  Browse funds
                  <ArrowRight />
                </Link>
              )}
            </div>
          </section>

          <form className="st-profile-grid" onSubmit={handleSave}>
            <section className="st-panel st-profile-account">
              <SectionHeader icon={IdCard} tone="lilac" title="Account" description="Provided by your Microsoft account." />
              <dl className="st-readonly st-readonly-stack">
                <div className="st-readonly-item">
                  <dt>Student ID</dt>
                  <dd>{profile.studentId}</dd>
                </div>
                <div className="st-readonly-item">
                  <dt>Name</dt>
                  <dd>{profile.name ?? '—'}</dd>
                </div>
                <div className="st-readonly-item">
                  <dt>Microsoft SSO email</dt>
                  <dd>{profile.email}</dd>
                </div>
                <div className="st-readonly-item">
                  <dt>Consent</dt>
                  <dd className="st-consent">
                    {profile.consentAt ? (
                      <>
                        <CheckCircle2 />
                        Agreed on {formatDate(profile.consentAt)}
                      </>
                    ) : (
                      <>
                        <AlertCircle />
                        Not yet agreed
                      </>
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="st-panel st-profile-study">
              <SectionHeader icon={GraduationCap} tone="sky" title="Study details" description="Your current programme and semester." />
              <div className="st-field-grid">
                <div className="st-field">
                  <label className="st-label" htmlFor="program">
                    Programme
                  </label>
                  <Select
                    value={programIsOther ? 'Other' : form.program}
                    onValueChange={(value) => {
                      setSaved(false)
                      setProgramIsOther(value === 'Other')
                      setForm((f) => ({ ...f, program: value === 'Other' ? '' : value }))
                    }}
                  >
                    <SelectTrigger id="program" className="st-input st-select">
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
                    <input
                      className="st-input"
                      placeholder="Enter your programme"
                      value={form.program}
                      onChange={handleChange('program')}
                      required
                    />
                  )}
                </div>
                <div className="st-field">
                  <label className="st-label" htmlFor="currentSemester">
                    Current semester
                  </label>
                  <input
                    id="currentSemester"
                    className="st-input"
                    placeholder="e.g. 3"
                    value={form.currentSemester}
                    onChange={handleChange('currentSemester')}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="st-panel st-profile-contact">
              <div className="st-label-row">
                <SectionHeader
                  icon={Phone}
                  tone="peach"
                  title="Contact & banking"
                  description="Used for application updates and reimbursements."
                />
                <span className="st-chip">
                  <ShieldCheck />
                  Kept private
                </span>
              </div>

              <div className="st-field-grid st-field-grid-3">
                <div className="st-field">
                  <label className="st-label" htmlFor="contactNumber">
                    Phone number
                  </label>
                  <input
                    id="contactNumber"
                    className="st-input"
                    type="tel"
                    value={form.contactNumber}
                    onChange={handleChange('contactNumber')}
                    required
                  />
                </div>
                <div className="st-field">
                  <label className="st-label" htmlFor="bankName">
                    Bank name
                  </label>
                  <input
                    id="bankName"
                    className="st-input"
                    value={form.bankName}
                    onChange={handleChange('bankName')}
                    required
                  />
                </div>
                <div className="st-field">
                  <label className="st-label" htmlFor="bankNumber">
                    Bank account number
                  </label>
                  <input
                    id="bankNumber"
                    className="st-input"
                    value={form.bankNumber}
                    onChange={handleChange('bankNumber')}
                    required
                  />
                </div>
              </div>
            </section>

            <div className="st-save-bar">
              <button type="submit" className="pill pill-orange" disabled={saving}>
                {saving ? 'Saving…' : 'Save profile'}
              </button>
              {saved && (
                <span className="st-saved">
                  <CheckCircle2 />
                  Saved
                </span>
              )}
              {saveError && <ErrorNote>{saveError}</ErrorNote>}
            </div>
          </form>

          <form onSubmit={handleSaveDependants}>
            <section className="st-panel st-dependants">
              <div className="st-label-row">
                <SectionHeader
                  icon={Users}
                  tone="butter"
                  title="Dependants"
                  description="Pre-fills the Dependants Form on Welfare applications that need one."
                />
                <button type="button" className="pill pill-white pill-sm" onClick={addDependant}>
                  <Plus />
                  Add dependant
                </button>
              </div>

              {dependantsError && <ErrorNote>{dependantsError}</ErrorNote>}

              {dependants.length === 0 ? (
                <div className="st-empty st-empty-inline">
                  <span className="sticker-art st-empty-sticker">
                    <StickerArt name="lily" />
                  </span>
                  <p className="mg-script st-empty-note">no dependants added yet</p>
                  <p>Add one if your application requires a Dependants Form.</p>
                </div>
              ) : (
                <div className="st-dependant-list">
                  {dependants.map((dependant, index) => {
                    const age = ageFromIc(dependant.icNumber)
                    const showIncome = dependant.status === 'Employed' || dependant.status === 'Self-Employed'
                    return (
                      <div key={dependant.id ?? index} className="st-dependant">
                        <div className="st-label-row">
                          <span className="st-chip st-chip-strong">Dependant {index + 1}</span>
                          <button type="button" className="st-remove" onClick={() => removeDependant(index)}>
                            <Trash2 />
                            Remove
                          </button>
                        </div>

                        <div className="st-dependant-fields">
                          <div className="st-field">
                            <label className="st-sublabel">Name</label>
                            <input
                              className="st-input"
                              value={dependant.name}
                              onChange={(event) => updateDependant(index, 'name', event.target.value)}
                              required
                            />
                          </div>
                          <div className="st-field">
                            <label className="st-sublabel">Identity card number</label>
                            <input
                              className="st-input"
                              value={dependant.icNumber}
                              onChange={(event) => updateDependant(index, 'icNumber', event.target.value)}
                              placeholder="YYMMDD-PB-XXXX"
                              required
                            />
                          </div>
                          <div className="st-field">
                            <label className="st-sublabel">Relationship</label>
                            <input
                              className="st-input"
                              value={dependant.relationship}
                              onChange={(event) => updateDependant(index, 'relationship', event.target.value)}
                              required
                            />
                          </div>
                          <div className="st-field st-field-age">
                            <label className="st-sublabel">Age</label>
                            <input className="st-input" value={age} disabled placeholder="—" />
                          </div>
                          <div className="st-field">
                            <label className="st-sublabel">Status</label>
                            <Select
                              value={dependant.status}
                              onValueChange={(value) => updateDependant(index, 'status', value)}
                            >
                              <SelectTrigger className="st-input st-select">
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
                            <div className="st-field">
                              <label className="st-sublabel">Income (RM)</label>
                              <input
                                className="st-input"
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

            <div className="st-save-bar">
              <button type="submit" className="pill pill-orange" disabled={dependantsSaving}>
                {dependantsSaving ? 'Saving…' : 'Save dependants'}
              </button>
              {dependantsSaved && (
                <span className="st-saved">
                  <CheckCircle2 />
                  Saved
                </span>
              )}
            </div>
          </form>
        </>
      )}
    </StudentShell>
  )
}

function SectionHeader({ icon: Icon, tone, title, description }) {
  return (
    <div className="st-section-header">
      <span className={`st-section-icon st-tone-${tone}`}>
        <Icon />
      </span>
      <div>
        <h2 className="mg-display">{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  )
}
