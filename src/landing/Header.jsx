import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import logo from '../assets/unikl-official.png'
import Icon from './Icon.jsx'

const UNITS = [
  {
    id: 'sd',
    label: 'Student Development',
    to: '/sd',
    services: [
      { label: 'Student Welfare Application', to: '/sd/welfare' },
      { label: 'Medical Outpatient Application', to: '/sd/medical' },
    ],
  },
  {
    id: 'cl',
    label: 'Campus Lifestyle',
    to: '/cl',
    services: [
      { label: 'Request Parking Sticker', to: '/cl/parking' },
      { label: 'Food Coupon', to: '/cl/food-coupon' },
    ],
  },
  {
    id: 'srd',
    label: 'Student Residential',
    to: '/srd',
    soon: true,
    services: [{ label: 'Hostel Listings', to: '/srd' }],
  },
]

export default function Header() {
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const [openUnit, setOpenUnit] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const navRef = useRef(null)

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

  useEffect(() => {
    const onClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenUnit(null)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const isUnitActive = (unit) => location.pathname.startsWith(unit.to)
  const isHomeActive = location.pathname === '/'

  return (
    <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <div className="container header-row">
        <Link to="/" className="brand">
          <img src={logo} alt="UniKL Royal College of Medicine Perak" className="brand-logo" />
        </Link>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`} ref={navRef}>
          <Link to="/" className={isHomeActive ? 'nav-link-active' : ''} onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {UNITS.map((unit) => (
            <div className={`nav-unit ${openUnit === unit.id ? 'nav-unit-open' : ''}`} key={unit.id}>
              <button
                type="button"
                className={`nav-unit-trigger ${isUnitActive(unit) ? 'nav-link-active' : ''}`}
                aria-expanded={openUnit === unit.id}
                onClick={() => setOpenUnit((current) => (current === unit.id ? null : unit.id))}
              >
                {unit.label}
                {unit.soon && <span className="nav-unit-soon">Soon</span>}
                <Icon name="chevron-down" />
              </button>

              <div className="nav-dropdown">
                {unit.services.map((service) => (
                  <Link key={service.to} to={service.to} onClick={() => setMenuOpen(false)}>
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>
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
