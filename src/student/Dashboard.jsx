import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowDown, ArrowRight, Lock, Clock, MessageCircleHeart } from 'lucide-react'
import StudentShell from './StudentShell.jsx'
import ConsentModal from './ConsentModal.jsx'
import { StudentLoading, StatusPill, ErrorNote, formatDate } from './StudentUI.jsx'
import { FUND_MODULES, COMING_SOON, fundLook, profileChecklist } from './funds.js'
import { isInReview } from './applicationStatus.js'
import StickerArt from '../landing/StickerArt.jsx'
import { useRoleGuard } from '@/lib/useRoleGuard'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'good morning'
  if (hour < 18) return 'good afternoon'
  return 'good evening'
}

const reveal = (index) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { type: 'spring', stiffness: 140, damping: 20, delay: (index % 3) * 0.06 },
})

export default function StudentDashboard() {
  const { user, ready } = useRoleGuard(['STUDENT'])
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState(false)
  const [applications, setApplications] = useState(null)
  const [funds, setFunds] = useState(null)
  const [fundsError, setFundsError] = useState(false)

  useEffect(() => {
    if (!ready) return
    fetch('/api/students/me/profile', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setProfile)
      .catch(() => setProfileError(true))
    fetch('/api/students/me/applications', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setApplications)
      .catch(() => setApplications([]))
    Promise.all(
      FUND_MODULES.map((module) =>
        fetch(`/api/students/categories?module=${module.key}`, { credentials: 'include' }).then((res) =>
          res.ok ? res.json() : Promise.reject(),
        ),
      ),
    )
      .then((lists) => setFunds(Object.fromEntries(FUND_MODULES.map((module, i) => [module.key, lists[i]]))))
      .catch(() => setFundsError(true))
  }, [ready])

  const handleConsentAgreed = (consentAt) => {
    setProfile((p) => (p ? { ...p, consentAt } : p))
  }

  const checklist = useMemo(() => profileChecklist(profile), [profile])
  const missingFields = checklist.filter((f) => !f.done).map((f) => f.label)
  const profileComplete = profile ? missingFields.length === 0 : false
  const profileProgress = Math.round(((checklist.length - missingFields.length) / checklist.length) * 100)

  const counts = useMemo(() => {
    const list = applications ?? []
    return {
      review: list.filter((a) => isInReview(a.status)).length,
      approved: list.filter((a) => a.status === 'APPROVED').length,
      rejected: list.filter((a) => a.status === 'REJECTED').length,
    }
  }, [applications])

  // One sticker sheet for every fund across modules; each still opens its own
  // module's wizard.
  const allFunds = useMemo(
    () => FUND_MODULES.flatMap((module) => (funds?.[module.key] ?? []).map((category) => ({ category, module }))),
    [funds],
  )

  const firstName = (profile?.name ?? user?.name ?? 'there').split(' ')[0]

  if (!ready || (!profile && !profileError)) {
    return <StudentLoading />
  }

  return (
    <StudentShell user={user}>
      <section className="st-hero mg-bg-aqua">
        <motion.div
          className="st-hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        >
          <p className="mg-script st-hero-hello">{greeting()},</p>
          <h1 className="mg-display st-hero-title">Hi, {firstName}!</h1>
          <p className="st-hero-sub">
            What do you need help with today? Pick a fund below and we&rsquo;ll open the right form for you.
          </p>
          <a href="#funds" className="pill pill-orange">
            See all funds
            <ArrowDown />
          </a>
        </motion.div>

        <motion.div
          className="st-hero-tracker"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.1 }}
        >
          <div className="st-hero-tracker-head">
            <h2 className="mg-display">Your applications</h2>
            {applications && applications.length > 0 && (
              <Link to="/student/applications" className="pill pill-white pill-sm">
                See all {applications.length}
                <ArrowRight />
              </Link>
            )}
          </div>

          <div className="st-counts">
            <Count value={counts.review} label="In review" tone="butter" />
            <Count value={counts.approved} label="Approved" tone="mint" />
            <Count value={counts.rejected} label="Rejected" tone="pink" />
          </div>

          <div className="st-tracker-list">
            {applications && applications.length === 0 && (
              <p className="mg-script st-empty-note">nothing submitted yet. Pick a fund below to get started!</p>
            )}
            {applications?.slice(0, 3).map((app) => (
              <Link to="/student/applications" className="st-recent" key={app.id}>
                <span className="st-recent-main">
                  <span className="st-mono">{app.applicationNo}</span>
                  <strong>{app.categoryName}</strong>
                </span>
                <span className="st-recent-date">{formatDate(app.submittedAt)}</span>
                <StatusPill status={app.status} />
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {profileError && <ErrorNote>We couldn&apos;t load your profile. Try refreshing the page.</ErrorNote>}

      {profile && !profileComplete && (
        <section className="st-panel st-setup st-tone-butter">
          <span className="sticker-art st-setup-sticker">
            <StickerArt name="grad-cap" />
          </span>
          <div className="st-setup-body">
            <p className="mg-script st-kicker">one quick thing first</p>
            <h2 className="mg-display st-h2">Finish your profile to start applying</h2>
            <div className="st-meter" aria-label={`Profile ${profileProgress}% complete`}>
              <span style={{ width: `${profileProgress}%` }} />
            </div>
            <p className="st-setup-note">{profileProgress}% done. Still missing:</p>
            <div className="st-chip-row">
              {missingFields.map((field) => (
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
      )}


      <div id="funds" className="st-funds">
        {fundsError && <ErrorNote>We couldn&apos;t load the funds. Try refreshing the page.</ErrorNote>}

        {funds && (
          <section className="st-panel st-sheet">
            <SectionHead
              kicker="pick what you need"
              title="All funds"
              note="Pick a sticker to get started. Every detail is on the next page."
              count={`${allFunds.length} ${allFunds.length === 1 ? 'fund' : 'funds'}`}
            />
            <div className="st-sticker-grid">
              {allFunds.map(({ category, module }, index) => {
                const look = fundLook(category.code)
                return profileComplete ? (
                  <FundSticker
                    key={category.id}
                    index={index}
                    name={category.name}
                    look={look}
                    to={module.applyPath}
                    search={{ category: category.code }}
                    action="Apply now"
                    actionIcon={ArrowRight}
                  />
                ) : (
                  <FundSticker
                    key={category.id}
                    index={index}
                    name={category.name}
                    look={look}
                    to="/student/profile"
                    action="Complete profile first"
                    actionIcon={Lock}
                  />
                )
              })}
              {COMING_SOON.map((item, index) => (
                <FundSticker
                  key={item.key}
                  index={allFunds.length + index}
                  name={item.name}
                  look={item}
                  action="Coming soon"
                  actionIcon={Clock}
                  soon
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="st-panel st-help-note st-tone-lilac">
        <MessageCircleHeart />
        <p>
          Not sure which fund fits, or need help with your submission? Reach out to the SDCL office and
          we&apos;ll guide you through it.
        </p>
      </section>

      <ConsentModal open={Boolean(profile && !profile.consentAt)} onAgreed={handleConsentAgreed} />
    </StudentShell>
  )
}

function Count({ value, label, tone }) {
  return (
    <div className={`st-count st-tone-${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function SectionHead({ kicker, title, note, count }) {
  return (
    <div className="st-section-head">
      <div className="st-section-text">
        <p className="mg-script st-kicker">{kicker}</p>
        <h2 className="mg-display st-h2">{title}</h2>
        <p>{note}</p>
      </div>
      {count && <span className="st-count-chip">{count}</span>}
    </div>
  )
}

// Funds show as a sheet of stickers only; hovering (or keyboard focus) pops up
// the name and the action. Every detail lives on the wizard's Fund step.
const TILTS = [-8, 6, -4, 9, -7, 5, -10, 7]

function FundSticker({ index, name, look, to, search, action, actionIcon: ActionIcon, soon = false }) {
  const body = (
    <>
      <span className="st-sticker-blob" />
      <span className="sticker-art st-sticker-img">
        <StickerArt name={look.sticker} />
      </span>
      {soon && <span className="st-sticker-soon">Soon</span>}
      <span className="st-sticker-name">{name}</span>
      <span className="st-sticker-pop" aria-hidden="true">
        <strong>{name}</strong>
        <span className="st-sticker-pop-cta">
          {action}
          <ActionIcon />
        </span>
      </span>
    </>
  )
  const style = { '--tilt': `${TILTS[index % TILTS.length]}deg` }
  const className = `st-sticker-link st-tone-${look.tone} ${soon ? 'st-sticker-disabled' : ''}`

  return (
    <motion.div className="st-sticker-cell" {...reveal(index)}>
      {soon ? (
        <div className={className} style={style} tabIndex={0} aria-label={`${name}: ${action}`}>
          {body}
        </div>
      ) : (
        <Link to={to} search={search} className={className} style={style} aria-label={`${name}: ${action}`}>
          {body}
        </Link>
      )}
    </motion.div>
  )
}
