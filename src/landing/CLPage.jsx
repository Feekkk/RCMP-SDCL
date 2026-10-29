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
    <div className="landing mg-page">
      <Header />

      <main id="top">
        <PageHero
          tone="mint"
          kicker="campus lifestyle"
          title="Parking & food coupon guides"
          sub="See how parking sticker requests and food coupons are approved and used before you apply through your student dashboard."
          stickers={[
            { name: 'car', label: 'parking sorted', x: '12%', y: '52%', size: 140, rotate: -4 },
            { name: 'coupon', label: 'free makan', x: '88%', y: '50%', size: 130, rotate: 8 },
          ]}
        />

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
