import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import logo from '../assets/unikl-official.png'

const NAV_LINKS = [
  { label: 'Home', to: '/', id: 'home' },
  { label: 'Welfare & Medical', to: '/sd', id: 'sd' },
  { label: 'Parking & Coupons', to: '/cl', id: 'cl' },
  { label: 'Hostel', to: '/srd', id: 'srd' },
]

export default function Header() {
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(scrollTop > 8)
      setScrollPct(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  const isLinkActive = (link) =>
    link.id === 'home' ? location.pathname === '/' : location.pathname.startsWith(link.to)

  return (
    <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <div className="container header-row">
        <Link to="/" className="brand">
          <img src={logo} alt="UniKL Royal College of Medicine Perak" className="brand-logo" />
        </Link>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.to}
              className={isLinkActive(link) ? 'nav-link-active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
