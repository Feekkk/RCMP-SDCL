import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Check,
  CheckCircle2,
  FileCheck2,
  Paperclip,
  HandCoins,
  Stethoscope,
} from 'lucide-react'
import NavBar from './NavBar.jsx'
import { ageFromIc } from './dependants.js'
import { useRoleGuard } from '@/lib/useRoleGuard'
import { logout } from '@/lib/useAuth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const MODULE_ICON = { WELFARE: HandCoins, MEDICAL: Stethoscope }

const STEPS = [
  { key: 'category', label: 'Category' },
  { key: 'details', label: 'Details' },
  { key: 'documents', label: 'Documents' },
  { key: 'review', label: 'Review' },
]

// Per-category field list, matching FORM.md exactly. Documents themselves
// still come from the category's requiredDocuments (CLAUDE.md: categories
// are data) — this only controls which extra fields the form shows.
const CATEGORY_FORM = {
  'living-allowance': { basicDetails: true, amount: 'Recommended below RM500', purpose: true, dependants: true },
  'learning-aid': { basicDetails: true, dependants: true },
  umi: { basicDetails: true, dependants: true },
  bereavement: { basicDetails: true, allocation: true },
  'travel-assistance-bereavement': { basicDetails: true },
  'medical-support-supply': { basicDetails: true, amount: 'Recommended RM200' },
  'medical-outpatient': {
    basicDetails: true,
    amount: 'Maximum claimable amount: RM100 per student per year',
    medicalClaim: true,
  },
  'natural-disasters': { basicDetails: true, amount: 'Recommended RM200 per incident' },
  others: { justification: true },
}

// category.notes is one free-text sentence or two from the categories table
// (CLAUDE.md) — split on sentence boundaries so it reads as bullet points.
const notesToBullets = (notes) =>
  (notes ?? '')
    .split(/(?<=[.;])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

const textareaClass =
  'w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

// Welfare and Medical both apply through this same form — only the category
// list and its CATEGORY_FORM fields differ.
export default function ApplyForm({ module, title, backHref }) {
  const navigate = useNavigate()
  const { user, ready } = useRoleGuard(['STUDENT'])

  const [profile, setProfile] = useState(null)
  const [categories, setCategories] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [step, setStep] = useState(0)
  const [categoryId, setCategoryId] = useState('')
  const [files, setFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Category-specific fields (FORM.md).
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [allocation, setAllocation] = useState('')
  const [justification, setJustification] = useState('')
  const [medicalClaim, setMedicalClaim] = useState({
    dateOfTreatment: '',
    clinicName: '',
    description: '',
    amountPaid: '',
  })
  // Dependants are maintained once on the student profile, not re-entered
  // here — this form only displays what's already on file.
  const [dependants, setDependants] = useState([])

  useEffect(() => {
    if (!ready) return
    Promise.all([
      fetch('/api/students/me/profile', { credentials: 'include' }).then((res) =>
        res.ok ? res.json() : Promise.reject(),
      ),
      fetch(`/api/students/categories?module=${module}`, { credentials: 'include' }).then((res) =>
        res.ok ? res.json() : Promise.reject(),
      ),
      fetch('/api/students/me/dependants', { credentials: 'include' }).then((res) =>
        res.ok ? res.json() : Promise.reject(),
      ),
    ])
      .then(([profileData, categoriesData, dependantsData]) => {
        setProfile(profileData)
        setCategories(categoriesData)
        setDependants(dependantsData)
      })
      .catch(() => setLoadError('Could not load your application details. Please try again.'))
  }, [ready, module])

  const category = categories?.find((c) => String(c.id) === categoryId) ?? null
  const fields = CATEGORY_FORM[category?.code] ?? {}

  const handleCategoryChange = (value) => {
    setCategoryId(value)
    setFiles([])
    setSubmitError('')
  }

  const handleFileChange = (index) => (event) => {
    const file = event.target.files?.[0] ?? null
    setFiles((prev) => {
      const next = [...prev]
      next[index] = file
      return next
    })
  }

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  const requiredDocuments = category?.requiredDocuments ?? []
  const allDocumentsAttached =
    requiredDocuments.length > 0 && requiredDocuments.every((_, index) => files[index])

  const detailsStepComplete = useMemo(() => {
    if (fields.amount && amount.trim().length === 0) return false
    if (fields.purpose && purpose.trim().length === 0) return false
    if (fields.allocation && allocation.trim().length === 0) return false
    if (fields.justification && justification.trim().length === 0) return false
    if (fields.medicalClaim) {
      const { dateOfTreatment, clinicName, description, amountPaid } = medicalClaim
      if (!dateOfTreatment || !clinicName.trim() || !description.trim() || !amountPaid.trim()) {
        return false
      }
    }
    if (fields.dependants && dependants.length === 0) return false
    return true
  }, [amount, purpose, allocation, justification, medicalClaim, dependants, fields])

  const canLeaveStep = (index) => {
    if (index === 0) return Boolean(category)
    if (index === 1) return detailsStepComplete
    if (index === 2) return allDocumentsAttached
    return true
  }

  const goTo = (index) => {
    if (index < step) {
      setStep(index)
      return
    }
    for (let i = step; i < index; i += 1) {
      if (!canLeaveStep(i)) return
    }
    setStep(index)
  }

  const handleNext = () => {
    if (!canLeaveStep(step)) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const handleBack = () => setStep((s) => Math.max(s - 1, 0))

  const buildDetails = () => {
    const details = {}
    if (fields.amount) details.amountRequested = amount
    if (fields.purpose) details.purposeOfApplication = purpose
    if (fields.allocation) details.allocation = allocation
    if (fields.justification) details.justification = justification
    if (fields.medicalClaim) details.medicalClaim = medicalClaim
    if (fields.dependants) details.dependants = dependants
    return details
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!category || !allDocumentsAttached || !detailsStepComplete) return

    setSubmitting(true)
    setSubmitError('')
    try {
      const formData = new FormData()
      formData.append('categoryId', category.id)
      formData.append('details', JSON.stringify(buildDetails()))
      requiredDocuments.forEach((_, index) => formData.append('documents', files[index]))

      const res = await fetch('/api/students/me/applications', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not submit your application.')
      }
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message || 'Could not submit your application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!ready || (!categories && !loadError)) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">Loading…</div>
    )
  }

  const ModuleIcon = MODULE_ICON[module]

  return (
    <div className="flex min-h-screen bg-background">
      <NavBar user={user} onLogout={handleLogout} />

      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-3xl">
          <Link
            to={backHref}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>

          <div className="mt-4 flex items-center gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ModuleIcon className="size-6" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          </div>

          {loadError && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {loadError}
            </div>
          )}

          {submitted ? (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
              <CheckCircle2 className="size-8 text-emerald-600" />
              <h2 className="text-base font-semibold text-foreground">Application submitted</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                You&apos;ll be notified by email once there&apos;s a decision. You can track its status
                from your dashboard.
              </p>
              <Button asChild className="mt-2">
                <Link to="/student">Back to dashboard</Link>
              </Button>
            </div>
          ) : (
            categories && (
              <form className="mt-8" onSubmit={handleSubmit}>
                {/* Step indicator */}
                <ol className="mb-8 flex items-center">
                  {STEPS.map((s, index) => {
                    const isDone = index < step
                    const isActive = index === step
                    const isLast = index === STEPS.length - 1
                    return (
                      <li key={s.key} className={cn('flex items-center', !isLast && 'flex-1')}>
                        <button
                          type="button"
                          onClick={() => goTo(index)}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <span
                            className={cn(
                              'flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors',
                              isDone && 'border-primary bg-primary text-primary-foreground',
                              isActive && !isDone && 'border-primary text-primary',
                              !isActive && !isDone && 'border-border text-muted-foreground',
                            )}
                          >
                            {isDone ? <Check className="size-4" /> : index + 1}
                          </span>
                          <span
                            className={cn(
                              'text-xs font-medium whitespace-nowrap',
                              isActive || isDone ? 'text-foreground' : 'text-muted-foreground',
                            )}
                          >
                            {s.label}
                          </span>
                        </button>
                        {!isLast && (
                          <div
                            className={cn(
                              'mx-2 h-px flex-1',
                              index < step ? 'bg-primary' : 'bg-border',
                            )}
                          />
                        )}
                      </li>
                    )
                  })}
                </ol>

                <section className="rounded-2xl border border-border bg-card p-8">
                  {step === 0 && (
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">
                        Which category matches your situation?
                      </h2>
                      <div className="mt-3">
                        <Select value={categoryId} onValueChange={handleCategoryChange}>
                          <SelectTrigger id="category" className="w-full">
                            <SelectValue placeholder="Choose a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {category && (category.amountLabel || category.notes) && (
                        <div className="mt-5 space-y-2 border-l-2 border-primary/40 pl-4">
                          {category.amountLabel && (
                            <p className="text-sm font-semibold text-primary">{category.amountLabel}</p>
                          )} 
                          {category.notes && (
                            <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                              {notesToBullets(category.notes).map((point, index) => (
                                <li key={index}>{point}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-8">
                      {/* Basic Details — profile recap, read-only */}
                      {fields.basicDetails && profile && (
                        <div className="space-y-1.5">
                          <Label>Basic Details</Label>
                          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-border bg-muted/30 px-4 py-4 text-sm">
                            <Field label="Student Name" value={profile.name} />
                            <Field label="Student ID" value={profile.studentId} />
                            <Field label="Programme" value={profile.program} />
                            <Field label="Email" value={profile.email} />
                            <Field label="Phone Number" value={profile.contactNumber} />
                            <Field label="Bank Name" value={profile.bankName} />
                            <Field label="Bank Account Number" value={profile.bankNumber} />
                          </dl>
                        </div>
                      )}

                      {/* Amount Requested */}
                      {fields.amount && (
                        <div className="space-y-1.5">
                          <Label htmlFor="amount">Amount Requested</Label>
                          <Input
                            id="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            placeholder="RM"
                            required
                          />
                          <p className="text-xs text-muted-foreground">{fields.amount}</p>
                        </div>
                      )}

                      {/* Purpose of Application — Living Allowance */}
                      {fields.purpose && (
                        <div className="space-y-1.5">
                          <Label htmlFor="purpose">Purpose of Application</Label>
                          <textarea
                            id="purpose"
                            rows={3}
                            value={purpose}
                            onChange={(event) => setPurpose(event.target.value)}
                            className={textareaClass}
                            required
                          />
                        </div>
                      )}

                      {/* Bereavement allocation / priority */}
                      {fields.allocation && (
                        <div className="space-y-1.5">
                          <Label htmlFor="allocation">
                            How the money is allocated and who is the priority
                          </Label>
                          <textarea
                            id="allocation"
                            rows={3}
                            value={allocation}
                            onChange={(event) => setAllocation(event.target.value)}
                            placeholder="Next-of-kin priority: spouse, then parent(s)."
                            className={textareaClass}
                            required
                          />
                        </div>
                      )}

                      {/* Others — Justification */}
                      {fields.justification && (
                        <div className="space-y-1.5">
                          <Label htmlFor="justification">Justification</Label>
                          <textarea
                            id="justification"
                            rows={4}
                            value={justification}
                            onChange={(event) => setJustification(event.target.value)}
                            className={textareaClass}
                            required
                          />
                        </div>
                      )}

                      {/* Medical Claim Details — Medical Outpatient */}
                      {fields.medicalClaim && (
                        <div className="space-y-3">
                          <Label>Medical Claim Details</Label>
                          <div className="grid grid-cols-2 gap-4 rounded-lg border border-border p-4">
                            <div className="col-span-2 space-y-1.5 sm:col-span-1">
                              <Label htmlFor="dateOfTreatment" className="text-xs font-normal text-muted-foreground">
                                Date of Treatment
                              </Label>
                              <Input
                                id="dateOfTreatment"
                                type="date"
                                value={medicalClaim.dateOfTreatment}
                                onChange={(event) =>
                                  setMedicalClaim((prev) => ({ ...prev, dateOfTreatment: event.target.value }))
                                }
                                required
                              />
                            </div>
                            <div className="col-span-2 space-y-1.5 sm:col-span-1">
                              <Label htmlFor="clinicName" className="text-xs font-normal text-muted-foreground">
                                Name of Clinic / Panel
                              </Label>
                              <Input
                                id="clinicName"
                                value={medicalClaim.clinicName}
                                onChange={(event) =>
                                  setMedicalClaim((prev) => ({ ...prev, clinicName: event.target.value }))
                                }
                                required
                              />
                            </div>
                            <div className="col-span-2 space-y-1.5">
                              <Label htmlFor="description" className="text-xs font-normal text-muted-foreground">
                                Description of Treatment
                              </Label>
                              <textarea
                                id="description"
                                rows={3}
                                value={medicalClaim.description}
                                onChange={(event) =>
                                  setMedicalClaim((prev) => ({ ...prev, description: event.target.value }))
                                }
                                className={textareaClass}
                                required
                              />
                            </div>
                            <div className="col-span-2 space-y-1.5 sm:col-span-1">
                              <Label htmlFor="amountPaid" className="text-xs font-normal text-muted-foreground">
                                Amount Paid (RM)
                              </Label>
                              <Input
                                id="amountPaid"
                                type="number"
                                min="0"
                                step="0.01"
                                value={medicalClaim.amountPaid}
                                onChange={(event) =>
                                  setMedicalClaim((prev) => ({ ...prev, amountPaid: event.target.value }))
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dependants Form — maintained on the profile, shown here read-only */}
                      {fields.dependants && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label>Dependants Form</Label>
                            <Link
                              to="/student/profile"
                              className="text-xs font-medium text-primary hover:underline"
                            >
                              Manage dependants
                            </Link>
                          </div>

                          {dependants.length === 0 ? (
                            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3.5 py-3 text-sm text-destructive">
                              <AlertCircle className="size-4 shrink-0" />
                              No dependants on file. Add at least one from your profile before continuing.
                            </div>
                          ) : (
                            <div className="divide-y divide-border rounded-lg border border-border">
                              {dependants.map((dependant, index) => {
                                const age = ageFromIc(dependant.icNumber)
                                const showIncome =
                                  dependant.status === 'Employed' || dependant.status === 'Self-Employed'
                                return (
                                  <dl
                                    key={dependant.id ?? index}
                                    className="grid grid-cols-2 gap-x-6 gap-y-2 px-4 py-3.5 text-sm sm:grid-cols-4"
                                  >
                                    <Field label="Name" value={dependant.name} />
                                    <Field label="Relationship" value={dependant.relationship} />
                                    <Field label="Age" value={age} />
                                    <Field label="Status" value={dependant.status} />
                                    {showIncome && <Field label="Income" value={`RM ${dependant.income}`} />}
                                  </dl>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <h2 className="text-sm font-semibold text-foreground">Supporting documents</h2>
                        <span className="shrink-0 text-xs text-muted-foreground">PDF, JPG, or PNG · up to 10MB</span>
                      </div>

                      <div className="mt-4 divide-y divide-border rounded-lg border border-border">
                        {requiredDocuments.map((doc, index) => (
                          <div key={doc.label} className="flex items-center gap-3 px-4 py-3.5">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              {files[index] ? (
                                <FileCheck2 className="size-4 text-emerald-600" />
                              ) : (
                                <Paperclip className="size-4" />
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-foreground">{doc.label}</p>
                              {files[index] && (
                                <p className="truncate text-xs text-muted-foreground">{files[index].name}</p>
                              )}
                            </div>
                            <Label
                              htmlFor={`document-${index}`}
                              className="shrink-0 cursor-pointer rounded-md border border-input px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                            >
                              {files[index] ? 'Change' : 'Upload'}
                            </Label>
                            <input
                              id={`document-${index}`}
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileChange(index)}
                              className="sr-only"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && category && (
                    <div className="space-y-6">
                      <h2 className="text-sm font-semibold text-foreground">Review your application</h2>

                      <div className="space-y-4 text-sm">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-muted-foreground">Category</span>
                          <span className="text-right font-medium text-foreground">{category.name}</span>
                        </div>
                        {fields.amount && (
                          <div className="flex items-start justify-between gap-3">
                            <span className="shrink-0 text-muted-foreground">Amount Requested</span>
                            <span className="text-right font-medium text-foreground">RM {amount}</span>
                          </div>
                        )}
                        {fields.purpose && (
                          <div className="flex items-start justify-between gap-3">
                            <span className="shrink-0 text-muted-foreground">Purpose</span>
                            <p className="max-w-[70%] text-right text-foreground">{purpose}</p>
                          </div>
                        )}
                        {fields.allocation && (
                          <div className="flex items-start justify-between gap-3">
                            <span className="shrink-0 text-muted-foreground">Allocation</span>
                            <p className="max-w-[70%] text-right text-foreground">{allocation}</p>
                          </div>
                        )}
                        {fields.justification && (
                          <div className="flex items-start justify-between gap-3">
                            <span className="shrink-0 text-muted-foreground">Justification</span>
                            <p className="max-w-[70%] text-right text-foreground">{justification}</p>
                          </div>
                        )}
                        {fields.medicalClaim && (
                          <div className="flex items-start justify-between gap-3">
                            <span className="shrink-0 text-muted-foreground">Medical Claim</span>
                            <p className="max-w-[70%] text-right text-foreground">
                              {medicalClaim.clinicName} · {medicalClaim.dateOfTreatment} · RM{' '}
                              {medicalClaim.amountPaid}
                            </p>
                          </div>
                        )}
                        {fields.dependants && (
                          <div className="flex items-start justify-between gap-3">
                            <span className="shrink-0 text-muted-foreground">Dependants</span>
                            <ul className="text-right text-foreground">
                              {dependants.map((d, index) => (
                                <li key={index}>
                                  {d.name} ({d.relationship})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-3">
                          <span className="shrink-0 text-muted-foreground">Documents</span>
                          <ul className="text-right text-foreground">
                            {requiredDocuments.map((doc, index) => (
                              <li key={doc.label} className="truncate">
                                {files[index]?.name ?? doc.label}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {submitError && (
                        <div className="flex items-center gap-1.5 text-sm text-destructive">
                          <AlertCircle className="size-4 shrink-0" />
                          {submitError}
                        </div>
                      )}
                    </div>
                  )}
                </section>

                <div className="mt-5 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={step === 0}
                  >
                    Back
                  </Button>

                  {step < STEPS.length - 1 ? (
                    <Button type="button" onClick={handleNext} disabled={!canLeaveStep(step)}>
                      Next
                      <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={submitting || !allDocumentsAttached}>
                      {submitting ? 'Submitting…' : 'Submit application'}
                    </Button>
                  )}
                </div>
              </form>
            )
          )}
        </div>
      </main>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium text-foreground">{value || '—'}</dd>
    </div>
  )
}
