import { Link } from '@tanstack/react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import './LandingPage.css'
import './UnitPage.css'

const COUPON_STEPS = [
  {
    title: 'Apply for a coupon',
    detail: 'Submit a food coupon request to Campus Lifestyle.',
  },
  {
    title: 'One-time approval',
    detail: 'Any CL staff member reviews and approves the request once.',
  },
  {
    title: 'Coupon appears on your dashboard',
    detail: 'An approved digital coupon is ready for you to claim.',
  },
  {
    title: 'Claim and redeem',
    detail: 'Claim the coupon, then staff redeem it at the point of service. Redeemed coupons cannot be reused.',
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

export default function FoodCouponPage() {
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
            <Link to="/cl" className="unit-breadcrumb">
              Campus Lifestyle (CL)
            </Link>
            <h1 className="hero-title page-hero-title">
              Claim a digital <span className="accent">Food Coupon</span>
            </h1>
            <p className="hero-sub">
              Request a food coupon, get it approved once, then claim and redeem it on campus.
              Unclaimed coupons never expire.
            </p>
          </div>
        </section>

        <section className="module-section">
          <div className="container">
            <Reveal as="div" className="module-head">
              <span className="eyebrow">Food Coupon</span>
              <h2>Claim a digital food coupon</h2>
              <p>
                Request a food coupon, get it approved once, then claim and redeem it on campus.
                Unclaimed coupons never expire.
              </p>
              <div className="module-badge-row">
                <span className="badge-pill">Approved by any CL staff</span>
                <span className="badge-pill badge-pill-info">One-time approval</span>
              </div>
            </Reveal>

            <div className="module-grid">
              <Reveal as="div" className="module-copy">
                <p>
                  After a Campus Lifestyle staff member approves your request, a digital coupon
                  appears on your dashboard. Claim it, then present it to staff to redeem — once
                  redeemed, a coupon cannot be used again.
                </p>
                <div className="state-chain">
                  <span className="state-chip">Issued</span>
                  <span className="state-arrow"><Icon name="arrow-right" /></span>
                  <span className="state-chip">Claimed</span>
                  <span className="state-arrow"><Icon name="arrow-right" /></span>
                  <span className="state-chip state-chip-end">Redeemed</span>
                </div>
                <div className="callout callout-info">
                  <span className="callout-icon">
                    <Icon name="info" />
                  </span>
                  <p>An unclaimed coupon does not expire — it stays available until you claim it.</p>
                </div>
                <Link to="/login" className="btn btn-primary btn-lg">
                  Apply via Student Login
                  <Icon name="arrow-right" />
                </Link>
              </Reveal>

              <Reveal as="div" delay={100}>
                <FlowCard title="Approval flow" steps={COUPON_STEPS} />
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
