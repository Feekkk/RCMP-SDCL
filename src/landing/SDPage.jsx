import { Link } from '@tanstack/react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import './LandingPage.css'
import './UnitPage.css'

const SERVICES = [
  {
    to: '/sd/welfare',
    title: 'Student Welfare Application',
    description:
      'Financial assistance for students facing hardship. Recommended by SD staff and approved in-system by the Board Committee.',
    badges: ['Recommended by SD staff', 'Approved by Board'],
  },
  {
    to: '/sd/medical',
    title: 'Medical Outpatient Application',
    description:
      'Outpatient medical support reviewed by the HOD / DD approval board. Every approver must approve, or the application is rejected.',
    badges: ['HOD / DD approval board', 'One rejection rejects all'],
  },
]

export default function SDPage() {
  return (
    <div className="landing">
      <Header />

      <main id="top">
        <section className="page-hero page-hero-welfare">
          <div className="hero-bg" aria-hidden="true">
            <div className="hero-dotgrid" />
            <div className="hero-blob hero-blob-orange" />
            <div className="hero-blob hero-blob-navy" />
          </div>

          <div className="container page-hero-content">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Student Development (SD)
            </span>
            <h1 className="hero-title page-hero-title">
              Welfare &amp; Medical <span className="accent">application guides</span>
            </h1>
            <p className="hero-sub">
              Learn how Student Welfare and Medical Outpatient applications are reviewed and
              approved before you apply through your student dashboard.
            </p>
          </div>
        </section>

        <section className="module-section">
          <div className="container">
            <Reveal as="div" className="module-head">
              <span className="eyebrow">Services</span>
              <h2>Choose a service</h2>
              <p>Each service has its own approval flow and required categories.</p>
            </Reveal>

            <div className="unit-service-grid">
              {SERVICES.map((service, index) => (
                <Reveal as={Link} to={service.to} className="unit-service-card" key={service.to} delay={index * 90}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className="module-badge-row">
                    {service.badges.map((badge) => (
                      <span className="badge-pill" key={badge}>
                        {badge}
                      </span>
                    ))}
                  </div>
                  <span className="unit-service-cta">
                    View guide
                    <Icon name="arrow-right" />
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <BackToTop />
      <Footer />
    </div>
  )
}
