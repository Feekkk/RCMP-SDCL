import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import StudentShell from './StudentShell.jsx'
import { StudentLoading, StatusPill, ErrorNote, formatDate } from './StudentUI.jsx'
import { fundLook } from './funds.js'
import { isInReview } from './applicationStatus.js'
import StickerArt from '../landing/StickerArt.jsx'
import { useRoleGuard } from '@/lib/useRoleGuard'

const MODULE_LABEL = { WELFARE: 'Student Welfare', MEDICAL: 'Medical Outpatient' }

const FILTERS = [
  { key: 'all', label: 'All', tone: 'white', match: () => true },
  { key: 'review', label: 'In review', tone: 'butter', match: (a) => isInReview(a.status) },
  { key: 'approved', label: 'Approved', tone: 'mint', match: (a) => a.status === 'APPROVED' },
  { key: 'rejected', label: 'Rejected', tone: 'pink', match: (a) => a.status === 'REJECTED' },
]

// Approval flows from CLAUDE.md: Welfare goes through an SD staff
// recommendation before the Board decides; Medical goes straight to the board.
const TRACKS = {
  WELFARE: ['Submitted', 'SD recommended', 'Board decision'],
  MEDICAL: ['Submitted', 'Board decision'],
}

function trackPosition(app) {
  const steps = TRACKS[app.module] ?? TRACKS.MEDICAL
  if (app.status === 'APPROVED' || app.status === 'REJECTED') return steps.length - 1
  if (app.status === 'RECOMMENDED') return 1
  return 0
}

export default function MyApplications() {
  const { user, ready } = useRoleGuard(['STUDENT'])
  const [applications, setApplications] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!ready) return
    fetch('/api/students/me/applications', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setApplications)
      .catch(() => setLoadError('Could not load your applications. Please try again.'))
  }, [ready])

  if (!ready || (!applications && !loadError)) {
    return <StudentLoading />
  }

  const activeFilter = FILTERS.find((f) => f.key === filter) ?? FILTERS[0]
  const visible = (applications ?? []).filter(activeFilter.match)

  return (
    <StudentShell user={user}>
      <section className="st-page-banner st-tone-pink">
        <span className="sticker-art st-page-banner-sticker">
          <StickerArt name="coupon" />
        </span>
        <div>
          <p className="mg-script st-kicker">track everything you&rsquo;ve sent</p>
          <h1 className="mg-display st-page-title">My applications</h1>
        </div>
      </section>

      {loadError && <ErrorNote>{loadError}</ErrorNote>}

      {applications &&
        (applications.length === 0 ? (
          <section className="st-panel st-empty">
            <span className="sticker-art st-empty-sticker">
              <StickerArt name="bubble" />
            </span>
            <h2 className="mg-display st-h2">Nothing here yet</h2>
            <p>Once you submit an application, you&apos;ll be able to track it right here.</p>
            <Link to="/student" hash="funds" className="pill pill-orange">
              Browse funds
              <ArrowRight />
            </Link>
          </section>
        ) : (
          <>
            <div className="st-filters" role="tablist" aria-label="Filter applications">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.key}
                  className={`pill pill-sm st-filter st-tone-${f.tone} ${filter === f.key ? 'pill-active' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  <span className="st-filter-count">{applications.filter(f.match).length}</span>
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <p className="mg-script st-empty-note">no applications here right now</p>
            ) : (
              <div className="st-app-list">
                {visible.map((app, index) => (
                  <motion.article
                    key={app.id}
                    className="st-app"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 20, delay: Math.min(index, 6) * 0.05 }}
                  >
                    <span className="sticker-art st-app-sticker">
                      <StickerArt name={fundLook(app.categoryCode).sticker} />
                    </span>

                    <div className="st-app-main">
                      <span className="st-mono">{app.applicationNo}</span>
                      <h3 className="mg-display">{app.categoryName}</h3>
                      <span className="st-app-module">{MODULE_LABEL[app.module] ?? app.module}</span>
                    </div>

                    <ApplicationTrack app={app} />

                    <div className="st-app-side">
                      <StatusPill status={app.status} />
                      <dl className="st-app-dates">
                        <div>
                          <dt>Submitted</dt>
                          <dd>{formatDate(app.submittedAt)}</dd>
                        </div>
                        <div>
                          <dt>Decided</dt>
                          <dd>{formatDate(app.decidedAt)}</dd>
                        </div>
                      </dl>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        ))}
    </StudentShell>
  )
}

function ApplicationTrack({ app }) {
  const steps = TRACKS[app.module] ?? TRACKS.MEDICAL
  const position = trackPosition(app)
  const decided = app.status === 'APPROVED' || app.status === 'REJECTED'

  return (
    <ol className="st-track" aria-label="Progress">
      {steps.map((label, index) => {
        let state = index < position || (index === position && decided) ? 'done' : 'todo'
        if (index === position && !decided) state = 'current'
        if (decided && index === steps.length - 1) state = app.status === 'APPROVED' ? 'approved' : 'rejected'
        return (
          <li key={label} className={`st-track-step st-track-${state}`}>
            <span className="st-track-dot" />
            <span className="st-track-label">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
