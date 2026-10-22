import { Link } from '@tanstack/react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import './LandingPage.css'
import './UnitPage.css'

const MEDICAL_STEPS = [
  {
    title: 'Complete your student profile',
    detail: 'First-time applicants fill in their SSO details, program, contact, and bank information, and accept the consent form.',
  },
  {
    title: 'Choose a medical category',
    detail: 'Select the outpatient category that applies. Required details and documents vary by category and are shown as you apply.',
  },
  {
    title: 'Submit for approval',
    detail: 'Your application is routed to the HOD / DD approval board.',
  },
  {
    title: 'Every approver reviews',
    detail: 'Each board approver must review and approve your application individually.',
  },
  {
    title: 'Track and get notified',
    detail: 'Follow the status on your dashboard and receive an email update once a decision is made.',
  },
]

function FlowCard({ title, steps }) {
  return (
    <div className="flow-card">
      <span className="flow-title">{title}</span>
      <ol className="flow-steps">
        {steps.map((step, index) => (
          <li className="flow-step" key={step.title}>
            <span className="flow-step-index">{index + 1}</span>
            <div className="flow-step-body">
              <strong>{step.title}</strong>
              <span>{step.detail}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function MedicalPage() {
  return (
    <div className="landing">
      <Header />

      <main id="top">
        <section className="page-hero">
          <div className="hero-bg" aria-hidden="true">
            <div className="hero-dotgrid" />
            <div className="hero-blob hero-blob-orange" />
            <div className="hero-blob hero-blob-navy" />
          </div>

          <div className="container page-hero-content">
            <Link to="/sd" className="unit-breadcrumb">
              Student Development (SD)
            </Link>
            <h1 className="hero-title page-hero-title">
              Medical Outpatient <span className="accent">Application</span>
            </h1>
            <p className="hero-sub">
              Outpatient medical support reviewed by the HOD / DD approval board, where every
              approver must sign off.
            </p>
          </div>
        </section>

        <section className="module-section">
          <div className="container">
            <Reveal as="div" className="module-head">
              <span className="eyebrow">Medical Outpatient Application</span>
              <h2>Outpatient medical support reviewed by the approval board</h2>
              <p>
                Apply for outpatient medical support. Applications go to the HOD / DD approval
                board, and every approver must sign off before it is approved.
              </p>
              <div className="module-badge-row">
                <span className="badge-pill">HOD / DD approval board</span>
                <span className="badge-pill badge-pill-warning">One rejection rejects the whole application</span>
              </div>
            </Reveal>

            <div className="module-grid">
              <Reveal as="div" className="module-copy">
                <p>
                  Unlike Welfare applications, Medical Outpatient applications require every
                  assigned approver to individually approve the request. If any approver rejects
                  it, the entire application is automatically rejected.
                </p>
                <p>
                  As with Welfare, the required details and documents depend on the medical
                  category you select when applying.
                </p>
                <div className="callout">
                  <span className="callout-icon">
                    <Icon name="alert" />
                  </span>
                  <p>
                    A single rejection from any HOD / DD approver automatically rejects the whole
                    application — there is no partial approval.
                  </p>
                </div>
                <Link to="/login" className="btn btn-primary btn-lg">
                  Apply via Student Login
                  <Icon name="arrow-right" />
                </Link>
              </Reveal>

              <Reveal as="div" delay={100}>
                <FlowCard title="Approval flow" steps={MEDICAL_STEPS} />
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
