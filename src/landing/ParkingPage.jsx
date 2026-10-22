import { Link } from '@tanstack/react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import './LandingPage.css'
import './UnitPage.css'

const PARKING_STEPS = [
  {
    title: 'Submit vehicle info',
    detail: 'Provide basic vehicle details such as plate number, make, model, and color.',
  },
  {
    title: 'Reviewed by CL staff',
    detail: 'Any Campus Lifestyle staff member can review and approve your request.',
  },
  {
    title: 'Sticker issued',
    detail: 'Once approved, your parking sticker is valid for one year from approval.',
  },
  {
    title: 'Renew yearly',
    detail: 'Submit a renewal request each year to keep your sticker valid.',
  },
]

function FlowCard({ title, steps }) {
  return (
    <div className="flow-card flow-card-parking">
      <span className="flow-title">
        <Icon name="ticket" /> {title}
      </span>
      <div className="flow-ticket-row">
        {steps.map((step, index) => (
          <div className="flow-ticket-step" key={step.title}>
            <span className="flow-ticket-index">{index + 1}</span>
            <strong>{step.title}</strong>
            <span>{step.detail}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ParkingPage() {
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
            <Link to="/cl" className="unit-breadcrumb">
              Campus Lifestyle (CL)
            </Link>
            <h1 className="hero-title page-hero-title">
              Request <span className="accent">Parking Sticker</span>
            </h1>
            <p className="hero-sub">
              Register your vehicle for campus parking. Approved by any CL staff member, valid for
              one year, renewed annually.
            </p>
          </div>
        </section>

        <section className="module-section module-section-parking">
          <div className="container">
            <Reveal as="div" className="module-head module-head-parking">
              <span className="eyebrow">
                <Icon name="car" /> Request Parking Sticker
              </span>
              <h2>Register your vehicle for campus parking</h2>
              <p>
                Submit your vehicle details for review by any Campus Lifestyle staff member.
                Approval is valid for one year and must be renewed annually.
              </p>
              <div className="module-badge-row">
                <span className="badge-pill">Approved by any CL staff</span>
                <span className="badge-pill badge-pill-info">Valid for 1 year — renew annually</span>
              </div>
            </Reveal>

            <div className="module-grid">
              <Reveal as="div" className="module-copy module-copy-parking">
                <p>
                  Fill in basic vehicle information such as plate number, make, model, and color.
                  Once a Campus Lifestyle staff member approves your request, your parking sticker
                  is active for one year.
                </p>
                <p>
                  Before your sticker expires, you&apos;ll need to submit a renewal request to keep
                  parking access for the next year.
                </p>
                <Link to="/login" className="btn btn-primary btn-lg">
                  Apply via Student Login
                  <Icon name="arrow-right" />
                </Link>
              </Reveal>

              <Reveal as="div" delay={100}>
                <FlowCard title="Approval flow" steps={PARKING_STEPS} />
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <BackToTop />
      <Footer />
    </div>
  )
}
