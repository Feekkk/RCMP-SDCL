import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { MotionConfig } from 'motion/react'
import { LayoutGrid, ClipboardList, UserRound, LogOut } from 'lucide-react'
import '@fontsource/bowlby-one'
import '@fontsource/nothing-you-could-do'
import logo from '@/assets/unikl-official.png'
import { logout } from '@/lib/useAuth'
import '../landing/LandingPage.css'
import '../landing/Home.css'
import './Student.css'

const LINKS = [
  { to: '/student', label: 'Dashboard', short: 'Dashboard', icon: LayoutGrid, tone: 'lilac' },
  { to: '/student/applications', label: 'My applications', short: 'Applications', icon: ClipboardList, tone: 'pink' },
  { to: '/student/profile', label: 'My profile', short: 'Profile', icon: UserRound, tone: 'mint' },
]

const initials = (name) =>
  (name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?'

// Top-bar layout shared by every student page (no sidebar). Apply pages count
// as part of the dashboard, since that is where students start them from.
export default function StudentShell({ user, children }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  const isActive = (to) =>
    to === '/student'
      ? location.pathname === '/student' || location.pathname.endsWith('/apply')
      : location.pathname.startsWith(to)

  return (
    <div className="st-page">
      <header className="st-header">
        <div className="st-header-row">
          <Link to="/student" className="st-brand">
            <img src={logo} alt="UniKL Royal College of Medicine Perak" />
          </Link>

          <nav className="st-nav" aria-label="Student">
            {LINKS.map(({ to, label, short, icon: LinkIcon, tone }) => {
              const active = isActive(to)
              return (
                <Link
                  key={to}
                  to={to}
                  className={`pill pill-${tone} st-nav-pill ${active ? 'pill-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <LinkIcon />
                  <span className="st-nav-long">{label}</span>
                  <span className="st-nav-short">{short}</span>
                </Link>
              )
            })}
          </nav>

          <div className="st-user">
            <Link to="/student/profile" className="st-avatar" title={user?.name ?? 'My profile'}>
              {initials(user?.name)}
            </Link>
            <button type="button" className="pill pill-white st-logout" onClick={handleLogout}>
              <LogOut />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      <MotionConfig reducedMotion="user">
        <main className="st-main">{children}</main>
      </MotionConfig>
      <footer className="st-footer">Student Development Campus Lifestyle Department · UNIKL Royal College of Medicine Perak</footer>
    </div>
  )
}
