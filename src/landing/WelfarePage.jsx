import { Link } from '@tanstack/react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import './LandingPage.css'
import './UnitPage.css'

const WELFARE_STEPS = [
  {
    title: 'Complete your student profile',
    detail: 'First-time applicants fill in their SSO details, program, contact, and bank information, and accept the consent form.',
  },
  {
    title: 'Choose a welfare category',
    detail: 'Select the type of assistance you need. Required details and supporting documents vary by category and are shown as you apply.',
  },
  {
    title: 'Submit to SD staff',
    detail: 'Your application is reviewed and recommended by Student Development staff before it goes to the Board.',
  },
  {
    title: 'Board Committee decision',
    detail: 'The CEO and Board approve recommended applications in-system during their scheduled meeting.',
  },
  {
    title: 'Track and get notified',
    detail: 'Follow the status on your dashboard and receive an email update once a decision is made.',
  },
]

function FlowCard({ title, steps }) {
  return (
    <div className="flow-card flow-card-welfare">
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

export default function WelfarePage() {
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
            <Link to="/sd" className="unit-breadcrumb">
              Student Development (SD)
            </Link>
            <h1 className="hero-title page-hero-title">
              Student Welfare <span className="accent">Application</span>
            </h1>
            <p className="hero-sub">
              Financial assistance for students facing hardship, recommended by SD staff and
              approved in-system by the Board Committee.
            </p>
          </div>
        </section>

        <section className="module-section module-section-welfare">
          <div className="container">
            <Reveal as="div" className="module-head module-head-welfare">
              <span className="eyebrow">Student Welfare Application</span>
              <h2>Financial assistance for students facing hardship</h2>
              <p>
                Apply for welfare support such as emergency assistance or fund top-ups. Each
                welfare category has its own eligibility rules, required details, and supporting
                documents.
              </p>
              <div className="module-badge-row">
                <span className="badge-pill">Recommended by SD staff</span>
                <span className="badge-pill badge-pill-info">Approved by Board during their meeting</span>
              </div>
            </Reveal>

            <div className="module-grid">
              <Reveal as="div" className="module-copy module-copy-welfare">
                <p>
                  Once submitted, Student Development staff review your application and attach a
                  recommendation. The Board Committee — made up of the CEO and Board members —
                  then approves recommended applications during their scheduled meeting, directly
                  in the system.
                </p>
                <p>
                  Category requirements are configured per category, so the exact fields and
                  documents you need to provide will be shown once you open the application form.
                </p>
                <Link to="/login" className="btn btn-primary btn-lg">
                  Apply via Student Login
                  <Icon name="arrow-right" />
                </Link>
              </Reveal>

              <Reveal as="div" delay={100}>
                <FlowCard title="Approval flow" steps={WELFARE_STEPS} />
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
