import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { HandCoins, Stethoscope, Car, Ticket, Inbox, ClipboardList } from 'lucide-react'
import NavBar from './NavBar.jsx'
import ConsentModal from './ConsentModal.jsx'
import { useRoleGuard } from '@/lib/useRoleGuard'
import { logout } from '@/lib/useAuth'
import { Button } from '@/components/ui/button'

// Unit/module summary from CLAUDE.md. Application submission isn't built yet
// (build order step 2-4), so these link out to each module's info page and
// show "Coming soon" instead of a broken Apply action.
const MODULES = [
  {
    key: 'welfare',
    title: 'Student Welfare',
    icon: HandCoins,
    description: 'Get financial help, reviewed by SD staff and approved by the Board.',
    infoHref: '/sd/welfare',
  },
  {
    key: 'medical',
    title: 'Medical Outpatient',
    icon: Stethoscope,
    description: 'Request outpatient treatment, approved by the HOD and DD.',
    infoHref: '/sd/medical',
  },
  {
    key: 'parking',
    title: 'Parking Sticker',
    icon: Car,
    description: 'Get your parking sticker approved, renewed once a year.',
    infoHref: '/cl/parking',
  },
  {
    key: 'food-coupon',
    title: 'Food Coupon',
    icon: Ticket,
    description: 'Get a coupon approved, then claim and redeem it on campus.',
    infoHref: '/cl/food-coupon',
  },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user, ready } = useRoleGuard(['STUDENT'])
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState(false)

  useEffect(() => {
    if (!ready) return
    fetch('/api/students/me/profile', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setProfile)
      .catch(() => setProfileError(true))
  }, [ready])

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  const handleConsentAgreed = (consentAt) => {
    setProfile((p) => (p ? { ...p, consentAt } : p))
  }

  if (!ready || (!profile && !profileError)) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">Loading…</div>
    )
  }

  const missingFields = profile
    ? [
        !profile.program && 'Program',
        !profile.currentSemester && 'Semester',
        !profile.contactNumber && 'Phone number',
        !(profile.bankName && profile.bankNumber) && 'Bank account',
      ].filter(Boolean)
    : []
  const profileComplete = profile ? missingFields.length === 0 : false

  return (
    <div className="flex min-h-screen bg-background">
      <NavBar user={user} onLogout={handleLogout} />

      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mt-2 text-2xl font-semibold text-foreground">
            Hi, {profile?.name ?? user.name ?? 'there'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s where you&apos;ll apply for and track your SDCL requests.
          </p>

          {profileError && (
            <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              We couldn&apos;t load your profile. Try refreshing the page.
            </div>
          )}

          {profile && !profileComplete && (
            <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-primary/15 bg-primary/5 p-6 sm:flex-row sm:items-start">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <ClipboardList className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Finish setting up your profile</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  You&apos;ll need to add these before you can apply for anything:
                </p>
                <div className="mt-3 flex flex-wrap gap-2 pb-1">
                  {missingFields.map((field) => (
                    <span
                      key={field}
                      className="rounded-full border border-primary/20 bg-background px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="shrink-0 sm:self-center"
                asChild
              >
                <Link to="/student/profile">Complete profile</Link>
              </Button>
            </div>
          )}

          <h2 className="mt-12 text-sm font-semibold text-foreground">Quick actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {MODULES.map(({ key, title, icon: ModuleIcon, infoHref }) => (
              <Link
                key={key}
                to={infoHref}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-4 py-6 text-center transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ModuleIcon className="size-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <span className="text-[11px] font-medium text-muted-foreground">Coming soon</span>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-sm font-semibold text-foreground">My applications</h2>
            <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
              <Inbox className="size-6 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Nothing here yet</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Once applications open up, you&apos;ll be able to see and track them right here.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ConsentModal open={Boolean(profile && !profile.consentAt)} onAgreed={handleConsentAgreed} />
    </div>
  )
}
