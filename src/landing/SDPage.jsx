import { Link } from '@tanstack/react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import PageHero from './PageHero.jsx'
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
    <div className="landing mg-page">
      <Header />

      <main id="top">
        <PageHero
          tone="lilac"
          kicker="student development"
          title="Welfare & medical guides"
          sub="Learn how Student Welfare and Medical Outpatient applications are reviewed and approved before you apply through your student dashboard."
          stickers={[
            { name: 'cash', label: 'welfare aid', x: '12%', y: '50%', size: 130, rotate: -6 },
            { name: 'medicine', label: 'clinic visit', x: '88%', y: '50%', size: 100, rotate: 8 },
          ]}
        />

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
