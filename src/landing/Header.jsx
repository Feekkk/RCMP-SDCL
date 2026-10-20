import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import logo from '../assets/unikl-official.png'

const NAV_LINKS = [
  { label: 'Features', to: '/', hash: 'features', id: 'features' },
  { label: 'Blog', to: '/blog', id: 'blog' },
]

export default function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isBlog = location.pathname.startsWith('/blog')

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [activeSection, setActiveSection] = useState('top')

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
    if (!isHome) return undefined

    const sectionIds = ['top', 'features', 'trust']
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isHome])

  const isLinkActive = (link) => {
    if (link.id === 'blog') return isBlog
    return isHome && activeSection === link.id
  }

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
              hash={link.hash}
              className={isLinkActive(link) ? 'nav-link-active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a href="#login" className="btn btn-primary">
            Student Login
          </a>
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
