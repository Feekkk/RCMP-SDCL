import { Link } from '@tanstack/react-router'
import logo from '../assets/unikl-white.png'

const FOOTER_LINKS = [
  { label: 'Student Development', to: '/sd', tone: 'lilac' },
  { label: 'Campus Lifestyle', to: '/cl', tone: 'pink' },
  { label: 'Residential', to: '/srd', tone: 'butter' },
  { label: 'Blog', to: '/blog', tone: 'mint' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <p className="footer-signoff">
            Student life,
            <br />
            sorted.
          </p>
          <nav className="footer-links" aria-label="Footer">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className={`pill pill-${link.tone} pill-sm`}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-row">
          <div className="footer-brand">
            <img src={logo} alt="UniKL Royal College of Medicine Perak" className="footer-logo" />
            <p>
              Student Development &amp; Campus Lifestyle Department
              <br />
              UniKL Royal College of Medicine Perak
            </p>
          </div>
          <p className="footer-copy">&copy; {new Date().getFullYear()} UniKL RCMP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
