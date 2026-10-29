import { Link } from '@tanstack/react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import PageHero from './PageHero.jsx'
import FundCategoryGrid from './FundCategoryGrid.jsx'
import './LandingPage.css'
import './UnitPage.css'

const WELFARE_CATEGORIES = [
  {
    icon: 'fund',
    title: 'Living Allowance / Accommodation',
    amount: 'Up to RM500',
    summary: 'One-off assistance for basic living or accommodation expenses.',
    documents: 'Bank account / Statement',
  },
  {
    icon: 'laptop',
    title: 'Learning Aid',
    amount: 'Up to RM1,500 per study period',
    summary: 'For a laptop or study-related gadgets. Mobile phones and entertainment devices are not covered.',
    documents: 'Bank account / Statement',
    note: 'You must not already be receiving related financial aid, loans, or sponsorship from external sponsors.',
  },
  {
    icon: 'utensils',
    title: 'UniKL Meal Initiative (UMI)',
    amount: 'Basic meal support',
    summary: 'Covers basic meals only — not for non-essential food expenses.',
    documents: 'Bank account / Statement',
  },
  {
    icon: 'cross',
    title: 'Medical Support & Supply',
    amount: 'Up to RM200',
    summary: 'One-time support during your studies for non-cosmetic medical aids, such as crutches, arm slings, back supports, or prescription glasses.',
    documents: 'Health report from a Certified Doctor',
  },
  {
    icon: 'heart',
    title: 'Bereavement',
    amount: 'RM1,000 / RM200',
    summary: 'RM1,000 to the next of kin upon the death of a registered UniKL student, or RM200 upon the death of a parent or spouse (each). Next-of-kin priority: spouse, then parent(s).',
    documents: 'Death certificate + Proof of relationship',
  },
  {
    icon: 'map-pin',
    title: 'Travel Assistance (Bereavement)',
    amount: 'RM50 / RM300',
    summary: 'One-off travel assistance to return to your hometown due to the death of a parent or spouse. RM50 within Peninsular Malaysia, RM300 between East and Peninsular Malaysia.',
    documents: 'Death certificate + Proof of relationship',
  },
  {
    icon: 'storm',
    title: 'Natural Disasters',
    amount: 'RM200 per accident',
    summary: 'For eligible accidents in Malaysia during active study — floods, storms, thunderstorms, landslides, building collapse, fallen trees, or fires.',
    documents: 'Photos of the disaster + Police report',
  },
  {
    icon: 'info',
    title: 'Others',
    amount: 'Case-by-case',
    summary: "For matters not covered by the categories above but that significantly affect your safety, well-being, or ability to study. Explain your case clearly.",
    documents: 'As requested by the committee',
  },
]

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
    <div className="landing mg-page">
      <Header />

      <main id="top">
        <PageHero
          tone="lilac"
          back={{ to: '/sd', label: 'Student Development' }}
          kicker="for when life gets heavy"
          title="Student welfare application"
          sub="Financial assistance for students facing hardship, recommended by SD staff and approved in-system by the Board Committee."
          stickers={[
            { name: 'cash', label: 'welfare aid', x: '12%', y: '55%', size: 130, rotate: -6 },
            { name: 'laptop', label: 'learning aid', x: '88%', y: '50%', size: 130, rotate: 7 },
          ]}
        />

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
                <Link to="/login" className="pill pill-orange pill-lg">
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

        <section className="module-section module-section-alt">
          <div className="container">
            <Reveal as="div" className="fund-section-head">
              <span className="eyebrow">What you can apply for</span>
              <h2>8 welfare categories, each with its own amount and documents</h2>
              <p>
                Pick the category that matches your situation when you apply. The amount,
                frequency, and required documents below are a guide — the application form will
                confirm exactly what you need to submit.
              </p>
            </Reveal>

            <Reveal as="div" delay={100}>
              <FundCategoryGrid categories={WELFARE_CATEGORIES} />
            </Reveal>
          </div>
        </section>
      </main>

      <BackToTop />
      <Footer />
    </div>
  )
}
