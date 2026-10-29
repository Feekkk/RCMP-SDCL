import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, BadgeCheck, Check, FileCheck2, Info, Paperclip, Send } from 'lucide-react'
import StudentShell from './StudentShell.jsx'
import { StudentLoading, ErrorNote } from './StudentUI.jsx'
import { fundLook, moduleInfo, profileChecklist } from './funds.js'
import { ageFromIc } from './dependants.js'
import StickerArt from '../landing/StickerArt.jsx'
import { useRoleGuard } from '@/lib/useRoleGuard'

const STEPS = [
  { key: 'category', label: 'Fund' },
  { key: 'details', label: 'Details' },
  { key: 'documents', label: 'Documents' },
  { key: 'review', label: 'Review' },
]

// Per-category field list, matching FORM.md exactly. Documents themselves
// still come from the category's requiredDocuments (CLAUDE.md: categories
// are data) — this only controls which extra fields the form shows.
const CATEGORY_FORM = {
  'living-allowance': { basicDetails: true, amount: 'Recommended below RM500', purpose: true, dependants: true },
  'learning-aid': { basicDetails: true, dependants: true, justification: true },
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

const STEP_HINT = [
  'Pick a fund to continue.',
  'Fill in every field to continue.',
  'Attach every document to continue.',
]

// category.notes is one free-text sentence or two from the categories table
// (CLAUDE.md) — split on sentence boundaries so it reads as bullet points.
const notesToBullets = (notes) =>
  (notes ?? '')
    .split(/(?<=[.;])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

// Welfare and Medical both apply through this same wizard — only the category
// list and its CATEGORY_FORM fields differ. Opening it from a dashboard fund
// sticker passes ?category=<code>, which pre-picks the fund; the Fund step then
// shows everything about it (the dashboard itself only shows stickers).
export default function ApplyForm({ module, title }) {
  const { user, ready } = useRoleGuard(['STUDENT'])
  const { category: presetCode } = useSearch({ strict: false })

  const [profile, setProfile] = useState(null)
  const [categories, setCategories] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [step, setStep] = useState(0)
  const [categoryId, setCategoryId] = useState('')
  const [files, setFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submittedNo, setSubmittedNo] = useState('')
  // Briefly disables the Submit button right after landing on Review, so a
  // fast double-click that moved Next -> Review can't also land on Submit
  // (same screen position, different button) before the student has had a
  // chance to actually see the review.
  const [reviewCooldown, setReviewCooldown] = useState(false)

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
  const stepsRef = useRef(null)

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
        const preset = categoriesData.find((c) => c.code === presetCode)
        if (preset) setCategoryId(String(preset.id))
      })
      .catch(() => setLoadError('Could not load your application details. Please try again.'))
  }, [ready, module, presetCode])

  // A long Details step leaves the student scrolled down; bring the stepper
  // back into view so each new step starts from its top.
  useEffect(() => {
    const steps = stepsRef.current
    if (steps && steps.getBoundingClientRect().top < 0) {
      steps.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [step])

  useEffect(() => {
    if (step !== STEPS.length - 1) return
    setReviewCooldown(true)
    const timer = setTimeout(() => setReviewCooldown(false), 500)
    return () => clearTimeout(timer)
  }, [step])

  const category = categories?.find((c) => String(c.id) === categoryId) ?? null
  const fields = CATEGORY_FORM[category?.code] ?? {}
  const meta = moduleInfo(module)
  const look = category ? fundLook(category.code) : { sticker: meta.sticker, tone: 'aqua' }

  const missingProfile = profileChecklist(profile)
    .filter((f) => !f.done)
    .map((f) => f.label)

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
    // Guards against the browser implicitly submitting the form (e.g. the
    // Enter key after confirming a file picker on the Documents step) before
    // the student has actually reached and seen the Review step.
    if (step !== STEPS.length - 1 || reviewCooldown) return
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
      const data = await res.json()
      setSubmittedNo(data.applicationNo ?? '')
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message || 'Could not submit your application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!ready || (!categories && !loadError)) {
    return <StudentLoading />
  }

  return (
    <StudentShell user={user}>
      <Link to="/student" hash="funds" className="pill pill-white pill-sm st-back">
        <ArrowLeft />
        All funds
      </Link>

      <section className={`st-apply-banner st-tone-${look.tone}`}>
        <span className="sticker-art st-apply-sticker">
          <StickerArt name={look.sticker} />
        </span>
        <div className="st-apply-banner-text">
          <p className="mg-script st-kicker">{title}</p>
          <h1 className="mg-display st-apply-title">{category?.name ?? 'Pick a fund'}</h1>
          {category && (
            <div className="st-chip-row">
              <span className="st-chip st-chip-strong">{category.amountLabel ?? 'Amount varies'}</span>
            </div>
          )}
        </div>
      </section>

      {loadError && <ErrorNote>{loadError}</ErrorNote>}

      {submitted ? (
        <section className="st-panel st-success st-tone-mint">
          <span className="sticker-art st-success-sticker">
            <StickerArt name={look.sticker} />
          </span>
          <p className="mg-script st-kicker">all done!</p>
          <h2 className="mg-display st-success-title">Application submitted</h2>
          {submittedNo && <span className="st-mono st-success-no">{submittedNo}</span>}
          <p>
            You&apos;ll get an email once there&apos;s a decision. You can track it any time from My
            applications.
          </p>
          <div className="st-actions">
            <Link to="/student/applications" className="pill pill-orange">
              Track it
              <ArrowRight />
            </Link>
            <Link to="/student" className="pill pill-white">
              Back to dashboard
            </Link>
          </div>
        </section>
      ) : profile && missingProfile.length > 0 ? (
        <section className="st-panel st-setup st-tone-butter">
          <span className="sticker-art st-setup-sticker">
            <StickerArt name="grad-cap" />
          </span>
          <div className="st-setup-body">
            <p className="mg-script st-kicker">one quick thing first</p>
            <h2 className="mg-display st-h2">Finish your profile before applying</h2>
            <p className="st-setup-note">We use these details on every application. Still missing:</p>
            <div className="st-chip-row">
              {missingProfile.map((field) => (
                <span className="st-chip" key={field}>
                  {field}
                </span>
              ))}
            </div>
          </div>
          <Link to="/student/profile" className="pill pill-orange">
            Complete profile
            <ArrowRight />
          </Link>
        </section>
      ) : (
        categories && (
          <form className="st-wizard" onSubmit={handleSubmit}>
            <ol className="st-steps" ref={stepsRef}>
              {STEPS.map((s, index) => {
                const state = index < step ? 'done' : index === step ? 'active' : 'todo'
                return (
                  <li key={s.key} className={`st-step st-step-${state}`}>
                    <button
                      type="button"
                      className="st-step-btn"
                      onClick={() => goTo(index)}
                      aria-current={index === step ? 'step' : undefined}
                    >
                      <span className="st-step-dot">{state === 'done' ? <Check /> : index + 1}</span>
                      <span className="st-step-label">{s.label}</span>
                    </button>
                  </li>
                )
              })}
            </ol>

            <section className="st-panel st-wizard-panel">
              {step === 0 && (
                <div>
                  {category ? (
                    <FundDetail category={category} flow={meta.flow} />
                  ) : (
                    <>
                      <h2 className="st-step-title">Which fund matches your situation?</h2>
                      <p className="st-step-hint">Pick one to see what it covers and what you&rsquo;ll need.</p>
                    </>
                  )}

                  {(!category || categories.length > 1) && (
                    <div className={category ? 'st-switch' : undefined}>
                      {category && <h3 className="st-switch-title">Not the right one? Switch fund</h3>}
                      <div className="st-pick-grid" role="radiogroup" aria-label="Fund">
                        {categories.map((c) => {
                          const cLook = fundLook(c.code)
                          const selected = String(c.id) === categoryId
                          return (
                            <button
                              key={c.id}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              className={`st-pick st-tone-${cLook.tone} ${selected ? 'st-pick-on' : ''}`}
                              onClick={() => handleCategoryChange(String(c.id))}
                            >
                              <span className="sticker-art st-pick-sticker">
                                <StickerArt name={cLook.sticker} />
                              </span>
                              <span className="st-pick-text">
                                <strong>{c.name}</strong>
                                <span>{c.amountLabel ?? 'Amount varies'}</span>
                              </span>
                              {selected && (
                                <span className="st-pick-check">
                                  <Check />
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="st-fields">
                  {fields.basicDetails && profile && (
                    <div className="st-field">
                      <span className="st-label">Basic details</span>
                      <dl className="st-readonly">
                        <Field label="Student name" value={profile.name} />
                        <Field label="Student ID" value={profile.studentId} />
                        <Field label="Programme" value={profile.program} />
                        <Field label="Email" value={profile.email} />
                        <Field label="Phone number" value={profile.contactNumber} />
                        <Field label="Bank name" value={profile.bankName} />
                        <Field label="Bank account number" value={profile.bankNumber} />
                      </dl>
                      <p className="st-help">
                        From your profile.{' '}
                        <Link to="/student/profile" className="st-link">
                          Edit profile
                        </Link>
                      </p>
                    </div>
                  )}

                  {fields.amount && (
                    <div className="st-field">
                      <label className="st-label" htmlFor="amount">
                        Amount requested (RM)
                      </label>
                      <input
                        id="amount"
                        className="st-input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        placeholder="RM"
                        required
                      />
                      <p className="st-help">{fields.amount}</p>
                    </div>
                  )}

                  {fields.purpose && (
                    <div className="st-field">
                      <label className="st-label" htmlFor="purpose">
                        Purpose of application
                      </label>
                      <textarea
                        id="purpose"
                        className="st-input st-textarea"
                        placeholder="Explain why you are applying for this fund."
                        rows={3}
                        value={purpose}
                        onChange={(event) => setPurpose(event.target.value)}
                        required
                      />
                    </div>
                  )}

                  {fields.allocation && (
                    <div className="st-field">
                      <label className="st-label" htmlFor="allocation">
                        How the money is allocated and who is the priority
                      </label>
                      <textarea
                        id="allocation"
                        className="st-input st-textarea"
                        rows={3}
                        value={allocation}
                        onChange={(event) => setAllocation(event.target.value)}
                        placeholder="Next-of-kin priority: spouse, then parent(s)."
                        required
                      />
                    </div>
                  )}

                  {fields.justification && (
                    <div className="st-field">
                      <label className="st-label" htmlFor="justification">
                        Justification
                      </label>
                      <textarea
                        id="justification"
                        className="st-input st-textarea"
                        rows={4}
                        placeholder={
                          category?.code === 'learning-aid'
                            ? 'Explain what you need and confirm you are not already receiving related financial aid, loans, or sponsorship from external sponsors.'
                            : 'Explain your case clearly.'
                        }
                        value={justification}
                        onChange={(event) => setJustification(event.target.value)}
                        required
                      />
                    </div>
                  )}

                  {fields.medicalClaim && (
                    <div className="st-field">
                      <span className="st-label">Medical claim details</span>
                      <div className="st-field-grid">
                        <div className="st-field">
                          <label className="st-sublabel" htmlFor="dateOfTreatment">
                            Date of treatment
                          </label>
                          <input
                            id="dateOfTreatment"
                            className="st-input"
                            type="date"
                            value={medicalClaim.dateOfTreatment}
                            onChange={(event) =>
                              setMedicalClaim((prev) => ({ ...prev, dateOfTreatment: event.target.value }))
                            }
                            required
                          />
                        </div>
                        <div className="st-field">
                          <label className="st-sublabel" htmlFor="clinicName">
                            Name of clinic / panel
                          </label>
                          <input
                            id="clinicName"
                            className="st-input"
                            placeholder="e.g. Klinik Kesihatan"
                            value={medicalClaim.clinicName}
                            onChange={(event) =>
                              setMedicalClaim((prev) => ({ ...prev, clinicName: event.target.value }))
                            }
                            required
                          />
                        </div>
                        <div className="st-field st-field-wide">
                          <label className="st-sublabel" htmlFor="description">
                            Description of treatment
                          </label>
                          <textarea
                            id="description"
                            className="st-input st-textarea"
                            placeholder="e.g. Consultation and medication for flu symptoms"
                            rows={3}
                            value={medicalClaim.description}
                            onChange={(event) =>
                              setMedicalClaim((prev) => ({ ...prev, description: event.target.value }))
                            }
                            required
                          />
                        </div>
                        <div className="st-field">
                          <label className="st-sublabel" htmlFor="amountPaid">
                            Amount paid (RM)
                          </label>
                          <input
                            id="amountPaid"
                            className="st-input"
                            placeholder="RM"
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
                      <p className="st-help">Submit within 1 month of your treatment or visit date.</p>
                    </div>
                  )}

                  {fields.dependants && (
                    <div className="st-field">
                      <div className="st-label-row">
                        <span className="st-label">Dependants</span>
                        <Link to="/student/profile" className="st-link">
                          Manage dependants
                        </Link>
                      </div>

                      {dependants.length === 0 ? (
                        <ErrorNote>No dependants on file. Add at least one from your profile before continuing.</ErrorNote>
                      ) : (
                        <div className="st-dependant-list">
                          {dependants.map((dependant, index) => {
                            const showIncome =
                              dependant.status === 'Employed' || dependant.status === 'Self-Employed'
                            return (
                              <dl key={dependant.id ?? index} className="st-readonly st-readonly-row">
                                <Field label="Name" value={dependant.name} />
                                <Field label="Relationship" value={dependant.relationship} />
                                <Field label="Age" value={ageFromIc(dependant.icNumber)} />
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
                  <h2 className="st-step-title">Upload your supporting documents</h2>
                  <p className="st-step-hint">One file per item. PDF, JPG or PNG, up to 10MB each.</p>

                  <div className="st-doc-list">
                    {requiredDocuments.map((doc, index) => (
                      <div key={doc.label} className={`st-doc ${files[index] ? 'st-doc-done' : ''}`}>
                        <span className="st-doc-icon">{files[index] ? <FileCheck2 /> : <Paperclip />}</span>
                        <div className="st-doc-text">
                          <strong>{doc.label}</strong>
                          <span>{files[index] ? files[index].name : 'Not attached yet'}</span>
                        </div>
                        <label htmlFor={`document-${index}`} className="pill pill-white pill-sm st-doc-btn">
                          {files[index] ? 'Change' : 'Upload'}
                        </label>
                        <input
                          id={`document-${index}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange(index)}
                          className="sr-only"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && category && (
                <div>
                  <h2 className="st-step-title">Review your application</h2>
                  <p className="st-step-hint">Check everything once more. Tap a step above to make changes.</p>

                  <dl className="st-review">
                    <ReviewRow label="Fund">{category.name}</ReviewRow>
                    {fields.basicDetails && profile && (
                      <ReviewRow label="Basic details">
                        <span>{profile.name}</span>
                        <span>{profile.studentId}</span>
                        <span>{profile.program}</span>
                        <span>{profile.email}</span>
                        <span>{profile.contactNumber}</span>
                        <span>
                          {profile.bankName} · {profile.bankNumber}
                        </span>
                      </ReviewRow>
                    )}
                    {fields.amount && <ReviewRow label="Amount requested">RM {amount}</ReviewRow>}
                    {fields.purpose && <ReviewRow label="Purpose">{purpose}</ReviewRow>}
                    {fields.allocation && <ReviewRow label="Allocation">{allocation}</ReviewRow>}
                    {fields.justification && <ReviewRow label="Justification">{justification}</ReviewRow>}
                    {fields.medicalClaim && (
                      <ReviewRow label="Medical claim">
                        {medicalClaim.clinicName} · {medicalClaim.dateOfTreatment} · RM {medicalClaim.amountPaid}
                      </ReviewRow>
                    )}
                    {fields.dependants && (
                      <ReviewRow label="Dependants">
                        {dependants.map((d, index) => (
                          <span key={index}>
                            {d.name} ({d.relationship})
                          </span>
                        ))}
                      </ReviewRow>
                    )}
                    <ReviewRow label="Documents">
                      {requiredDocuments.map((doc, index) => (
                        <span key={doc.label}>
                          <strong>{doc.label}</strong>
                          <small>
                            {files[index]
                              ? `${files[index].name} · ${(files[index].size / 1024).toFixed(0)} KB`
                              : 'Not attached'}
                          </small>
                        </span>
                      ))}
                    </ReviewRow>
                  </dl>

                  {submitError && <ErrorNote>{submitError}</ErrorNote>}
                </div>
              )}
            </section>

            <div className="st-wizard-nav">
              <button type="button" className="pill pill-white" onClick={handleBack} disabled={step === 0}>
                <ArrowLeft />
                Back
              </button>

              {step < STEPS.length - 1 && !canLeaveStep(step) && (
                <span className="st-nav-hint">{STEP_HINT[step]}</span>
              )}

              {/* Distinct keys stop React from reusing the Next <button> as Submit: if
                  the same element flipped to type="submit" mid-click, the click that
                  moved Documents -> Review would also submit the form. */}
              {step < STEPS.length - 1 ? (
                <button
                  key="next"
                  type="button"
                  className="pill pill-orange"
                  onClick={handleNext}
                  disabled={!canLeaveStep(step)}
                >
                  Next
                  <ArrowRight />
                </button>
              ) : (
                <button
                  key="submit"
                  type="submit"
                  className="pill pill-orange"
                  disabled={submitting || reviewCooldown || !allDocumentsAttached}
                >
                  {submitting ? 'Submitting…' : 'Submit application'}
                  {!submitting && <Send />}
                </button>
              )}
            </div>
          </form>
        )
      )}
    </StudentShell>
  )
}

// Everything a student needs to decide lives here: the dashboard only shows
// the fund's sticker.
function FundDetail({ category, flow }) {
  const covers = notesToBullets(category.notes)
  return (
    <div className="st-fund-detail">
      <div>
        <h2 className="st-step-title">Here&rsquo;s what you&rsquo;re applying for</h2>
        <p className="st-step-hint">Read this first, then press Next to start your application.</p>
      </div>

      <div className="st-facts">
        {covers.length > 0 && (
          <div className="st-fact">
            <span className="st-fact-head">
              <Info />
              What it covers
            </span>
            <ul>
              {covers.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="st-fact">
          <span className="st-fact-head">
            <Paperclip />
            Documents to prepare
          </span>
          <ul>
            {(category.requiredDocuments ?? []).map((doc) => (
              <li key={doc.label}>{doc.label}</li>
            ))}
          </ul>
        </div>
        <div className="st-fact">
          <span className="st-fact-head">
            <BadgeCheck />
            How it&rsquo;s approved
          </span>
          <p>{flow}</p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="st-readonly-item">
      <dt>{label}</dt>
      <dd>{value || '—'}</dd>
    </div>
  )
}

function ReviewRow({ label, children }) {
  return (
    <div className="st-review-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
