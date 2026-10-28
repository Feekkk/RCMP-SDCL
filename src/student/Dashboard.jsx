import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  HandCoins,
  Stethoscope,
  Car,
  Ticket,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Inbox,
} from 'lucide-react'
import NavBar from './NavBar.jsx'
import ConsentModal from './ConsentModal.jsx'
import { STATUS } from './applicationStatus.js'
import { useRoleGuard } from '@/lib/useRoleGuard'
import { logout } from '@/lib/useAuth'
import { Button } from '@/components/ui/button'

// Unit/module summary from CLAUDE.md. Welfare and Medical have an application
// engine (categories, documents) now; Parking Sticker and Food Coupon don't
// yet (build order step 4), so they still link out to their info page.
const MODULES = [
  {
    key: 'welfare',
    title: 'Student Welfare',
    unit: 'Student Development',
    accent: 'welfare',
    icon: HandCoins,
    description:
      'Financial help for living costs, study gadgets, meals, medical aids, bereavement and more.',
    highlights: ['Up to RM1,500 learning aid', 'Up to RM500 living / accommodation', 'Bereavement & Disaster relief'],
    href: '/student/welfare/apply',
  },
  {
    key: 'medical',
    title: 'Medical Outpatient',
    unit: 'Student Development',
    accent: 'medical',
    icon: Stethoscope,
    description: 'Claim back outpatient treatment costs such as clinic visits and prescribed medication.',
    highlights: ['RM100 per year', 'Submit within 1 month of visit', 'Staff review and approval'],
    href: '/student/medical/apply',
  },
  {
    key: 'parking',
    title: 'Parking Sticker',
    unit: 'Campus Lifestyle',
    accent: 'parking',
    icon: Car,
    description: 'Get a parking sticker approved for your vehicle on campus.',
    highlights: ['Submit basic vehicle info', 'Approval by SDCL staff', 'Valid for one year, renewable'],
    href: '/cl/parking',
    comingSoon: true,
  },
  {
    key: 'food-coupon',
    title: 'Food Coupon',
    unit: 'Campus Lifestyle',
    accent: 'food',
    icon: Ticket,
    description: 'Request a food coupon you can claim and redeem on campus.',
    highlights: ['One-time approval', 'Digital coupon to claim', 'Staff redeem it on use'],
    href: '/cl/food-coupon',
    comingSoon: true,
  },
]

// Each module gets its own accent rather than sharing one color per unit, so
// the grid reads as a palette rather than a single repeated tone.
const ACCENT = {
  welfare: {
    chip: 'bg-primary/10 text-primary',
    check: 'text-primary/70',
    ring: 'hover:border-primary/30 hover:shadow-primary/5',
  },
  medical: {
    chip: 'bg-sky-500/10 text-sky-600',
    check: 'text-sky-500/80',
    ring: 'hover:border-sky-500/30 hover:shadow-sky-500/5',
  },
  parking: {
    chip: 'bg-amber-500/10 text-amber-600',
    check: 'text-amber-500/80',
    ring: 'hover:border-amber-500/30 hover:shadow-amber-500/5',
  },
  food: {
    chip: 'bg-rose-500/10 text-rose-600',
    check: 'text-rose-500/80',
    ring: 'hover:border-rose-500/30 hover:shadow-rose-500/5',
  },
}

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user, ready } = useRoleGuard(['STUDENT'])
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState(false)
  const [applications, setApplications] = useState(null)

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
  }, [ready])

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  const handleConsentAgreed = (consentAt) => {
    setProfile((p) => (p ? { ...p, consentAt } : p))
  }

  const fieldChecklist = useMemo(
    () => [
      { label: 'Program', done: Boolean(profile?.program) },
      { label: 'Semester', done: Boolean(profile?.currentSemester) },
      { label: 'Phone number', done: Boolean(profile?.contactNumber) },
      { label: 'Bank account', done: Boolean(profile?.bankName && profile?.bankNumber) },
    ],
    [profile],
  )
  const missingFields = fieldChecklist.filter((f) => !f.done).map((f) => f.label)
  const profileComplete = profile ? missingFields.length === 0 : false
  const profileProgress = profile
    ? Math.round(((fieldChecklist.length - missingFields.length) / fieldChecklist.length) * 100)
    : 0

  const counts = useMemo(() => {
    const list = applications ?? []
    return {
      total: list.length,
      pending: list.filter((a) => a.status === 'PENDING' || a.status === 'RECOMMENDED').length,
      approved: list.filter((a) => a.status === 'APPROVED').length,
    }
  }, [applications])

  const firstName = (profile?.name ?? user?.name ?? 'there').split(' ')[0]

  if (!ready || (!profile && !profileError)) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">Loading…</div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <NavBar user={user} onLogout={handleLogout} />

      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-8 text-primary-foreground sm:px-10 sm:py-10">
            <Sparkles className="pointer-events-none absolute -top-6 right-6 size-28 text-white/10" />
            <Sparkles className="pointer-events-none absolute bottom-2 right-28 size-10 text-white/10" />
            <img src="/sdcl-light.png" alt="SDCL" className="absolute right-6 top-6 h-12 w-auto sm:right-10 sm:top-10 sm:h-16" />
            <p className="text-sm font-medium text-white/70">{greeting()},</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white!">{firstName}</h1>
            <p className="mt-2 max-w-md text-sm text-white/80">
              Need a hand? Apply for financial aid, medical claims, parking or a food coupon in just a few
              clicks, We are here to support you.
            </p>

            {applications && applications.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
                <HeroStat label="Total" value={counts.total} dotClassName="bg-white" />
                <HeroStat label="In review" value={counts.pending} dotClassName="bg-amber-300" />
                <HeroStat label="Approved" value={counts.approved} dotClassName="bg-emerald-300" />
              </div>
            )}
          </div>

          {profileError && (
            <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              We couldn&apos;t load your profile. Try refreshing the page.
            </div>
          )}

          {profile && !profileComplete && (
            <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-[var(--orange)]/20 bg-[var(--orange)]/5 p-6 sm:flex-row sm:items-center">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--orange)]/15 text-[var(--orange-dark)]">
                <ClipboardList className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">You&apos;re {profileProgress}% set up</p>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--orange)]/15">
                  <div
                    className="h-full rounded-full bg-[var(--orange)] transition-all"
                    style={{ width: `${profileProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add these to your profile so you can start applying:
                </p>
                <div className="mt-3 flex flex-wrap gap-2 pb-1">
                  {missingFields.map((field) => (
                    <span
                      key={field}
                      className="rounded-full border border-[var(--orange)]/25 bg-background px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              <Button size="sm" variant="secondary" className="shrink-0 sm:self-center" asChild>
                <Link to="/student/profile">Complete profile</Link>
              </Button>
            </div>
          )}

          {/* Recent activity */}
          {applications && applications.length > 0 && (
            <div className="mt-8 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
                <Link
                  to="/student/applications"
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  View all
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
              <div className="mt-3 divide-y divide-border">
                {applications.slice(0, 3).map((app) => {
                  const status = STATUS[app.status] ?? STATUS.PENDING
                  const StatusIcon = status.icon
                  return (
                    <div key={app.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <p className="truncate text-sm text-foreground">{app.categoryName}</p>
                      <span
                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                      >
                        <StatusIcon className="size-3.5" />
                        {status.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {applications && applications.length === 0 && profileComplete && (
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Inbox className="size-5" />
              </div>
              <p className="text-sm text-muted-foreground">
                You haven&apos;t applied for anything yet. Take a look at what&apos;s available below — it only
                takes a few minutes.
              </p>
            </div>
          )}

          <br></br>
          <h2 className="mt-10 text-lg font-semibold text-foreground">What would you like help with?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a fund below, fill in a short form, and we&apos;ll take it from there.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {MODULES.map(({ key, title, unit, accent, icon: ModuleIcon, description, highlights, href, comingSoon }) => (
              <div
                key={key}
                className={`group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${ACCENT[accent].ring}`}
              >
                {comingSoon && (
                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <Clock className="size-3" />
                    Coming soon
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${ACCENT[accent].chip}`}>
                    <ModuleIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{unit}</p>
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">{description}</p>

                <ul className="mt-3 space-y-1.5">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className={`mt-0.5 size-3.5 shrink-0 ${ACCENT[accent].check}`} />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 border-t border-border pt-4">
                  {comingSoon ? (
                    <Button size="sm" variant="secondary" disabled className="w-full">
                      Coming Soon !
                    </Button>
                  ) : (
                    <Button size="sm" className="w-full text-white! hover:text-white!" asChild>
                      <Link to={href}>
                        Apply now
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-2 mt-10 flex items-center gap-4 rounded-2xl border border-[var(--gold)]/25 bg-[var(--gold)]/10 px-5 py-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--orange-dark)]">
              <Sparkles className="size-4" />
            </div>
            <p className="text-sm text-foreground/80">
              Not sure what to apply for, or need help with your submission? Reach out to the SDCL office and
              we&apos;ll guide you through it.
            </p>
          </div>
        </div>
      </main>

      <ConsentModal open={Boolean(profile && !profile.consentAt)} onAgreed={handleConsentAgreed} />
    </div>
  )
}

function HeroStat({ label, value, dotClassName }) {
  return (
    <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
      <p className="text-lg font-semibold leading-none">{value}</p>
      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/70">
        <span className={`size-1.5 shrink-0 rounded-full ${dotClassName}`} />
        {label}
      </p>
    </div>
  )
}
