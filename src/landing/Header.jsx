import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import '@fontsource/bowlby-one'
import logo from '../assets/unikl-official.png'
import Icon from './Icon.jsx'

const UNITS = [
  {
    id: 'sd',
    label: 'Student Dev',
    fullLabel: 'Student Development',
    to: '/sd',
    tone: 'lilac',
    services: [
      { label: 'Student Welfare Application', to: '/sd/welfare' },
      { label: 'Medical Outpatient Application', to: '/sd/medical' },
    ],
  },
  {
    id: 'cl',
    label: 'Campus Life',
    fullLabel: 'Campus Lifestyle',
    to: '/cl',
    tone: 'pink',
    services: [
      { label: 'Request Parking Sticker', to: '/cl/parking' },
      { label: 'Food Coupon', to: '/cl/food-coupon' },
    ],
  },
  {
    id: 'srd',
    label: 'Residential',
    fullLabel: 'Student Residential',
    to: '/srd',
    tone: 'butter',
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
  const headerRef = useRef(null)

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
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenUnit(null)
        setMenuOpen(false)
      }
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenUnit(null)
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const closeMenus = () => {
    setMenuOpen(false)
    setOpenUnit(null)
  }

  const isUnitActive = (unit) => location.pathname.startsWith(unit.to)
  const isBlogActive = location.pathname.startsWith('/blog')

  return (
    <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`} ref={headerRef}>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <div className="container header-row">
        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Units">
          <Link to="/" className="nav-mobile-link" onClick={closeMenus}>
            Home
          </Link>

          {UNITS.map((unit) => (
            <div className={`nav-unit ${openUnit === unit.id ? 'nav-unit-open' : ''}`} key={unit.id}>
              <button
                type="button"
                className={`pill pill-${unit.tone} nav-unit-trigger ${isUnitActive(unit) ? 'pill-active' : ''}`}
                aria-expanded={openUnit === unit.id}
                aria-label={unit.fullLabel}
                onClick={() => setOpenUnit((current) => (current === unit.id ? null : unit.id))}
              >
                {unit.label}
                {unit.soon && <span className="nav-unit-soon">Soon</span>}
                <Icon name="chevron-down" />
              </button>

              <div className="nav-dropdown">
                <span className="nav-dropdown-title">{unit.fullLabel}</span>
                <Link to={unit.to} onClick={closeMenus}>
                  Overview
                </Link>
                {unit.services
                  .filter((service) => service.to !== unit.to)
                  .map((service) => (
                    <Link key={service.to} to={service.to} onClick={closeMenus}>
                      {service.label}
                    </Link>
                  ))}
              </div>
            </div>
          ))}

          <Link to="/blog" className="nav-mobile-link" onClick={closeMenus}>
            Campus Blog
          </Link>
        </nav>

        <Link to="/" className="brand" onClick={closeMenus}>
          <img src={logo} alt="UniKL Royal College of Medicine Perak" className="brand-logo" />
        </Link>

        <div className="header-actions">
          <Link to="/blog" className={`pill pill-mint header-blog ${isBlogActive ? 'pill-active' : ''}`}>
            Blog
          </Link>
          <Link to="/login" className="pill pill-white">
            Login
          </Link>
          <button
            type="button"
            className="pill pill-white menu-toggle"
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
