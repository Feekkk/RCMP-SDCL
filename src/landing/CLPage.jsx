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
    to: '/cl/parking',
    title: 'Request Parking Sticker',
    description:
      'Submit basic vehicle info for review by any CL staff member. Approval is valid for one year and renewed annually.',
    badges: ['Approved by any CL staff', 'Valid 1 year'],
  },
  {
    to: '/cl/food-coupon',
    title: 'Food Coupon',
    description:
      'One-time approval unlocks a digital coupon for you to claim and redeem on campus. Unclaimed coupons never expire.',
    badges: ['Approved by any CL staff', 'One-time approval'],
  },
]

export default function CLPage() {
  return (
    <div className="landing">
      <Header />

      <main id="top">
        <section className="page-hero page-hero-parking">
          <div className="hero-bg" aria-hidden="true">
            <div className="hero-dotgrid" />
            <div className="hero-blob hero-blob-orange" />
            <div className="hero-blob hero-blob-navy" />
          </div>

          <div className="container page-hero-content">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Campus Lifestyle (CL)
            </span>
            <h1 className="hero-title page-hero-title">
              Parking sticker &amp; <span className="accent">food coupon guides</span>
            </h1>
            <p className="hero-sub">
              See how parking sticker requests and food coupons are approved and used before you
              apply through your student dashboard.
            </p>
          </div>
        </section>

        <section className="module-section">
          <div className="container">
            <Reveal as="div" className="module-head">
              <span className="eyebrow">Services</span>
              <h2>Choose a service</h2>
              <p>Each service has its own approval flow and lifecycle.</p>
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
