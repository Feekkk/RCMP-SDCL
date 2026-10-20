import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import trustIllustration from '../assets/trust-illustration.svg'
import './LandingPage.css'

const FEATURES = [
  {
    icon: 'form',
    tag: '01',
    title: 'Digital Forms',
    description:
      'Fill up and submit official student forms online — no more printing, queueing, or chasing signatures across departments.',
    bullets: ['Pre-filled with your student profile', 'Submit and sign digitally', 'Full submission history'],
    visual: 'form',
  },
  {
    icon: 'fund',
    tag: '02',
    title: 'Fund Request',
    description:
      'Check your eligibility and apply for financial assistance in a few clicks, with real-time status tracking from submission to approval.',
    bullets: ['Instant eligibility check', 'Upload supporting documents', 'Track approval in real time'],
    visual: 'fund',
  },
  {
    icon: 'blog',
    tag: '03',
    title: 'Campus Blog',
    description:
      'Stay in the loop with announcements, events, and updates broadcast directly by the Student Development & Campus Lifestyle Department.',
    bullets: ['Official SDCL announcements', 'Event highlights & deadlines', 'New post notifications'],
    visual: 'blog',
  },
]

const STATS = [
  { value: '3,200+', label: 'Active Students' },
  { value: '12,000+', label: 'Forms Processed' },
  { value: '48h', label: 'Avg. Fund Review' },
  { value: '100%', label: 'Digital & Paperless' },
]

const TRUST_FEATURES = [
  {
    icon: 'lock',
    title: 'Encrypted by default',
    description: 'Every form and fund request is encrypted in transit and at rest — bank-grade security on every submission.',
  },
  {
    icon: 'shield',
    title: 'Role-based access only',
    description: 'Only the verified SDCL staff handling your case can view your records. No one else sees them.',
  },
  {
    icon: 'user',
    title: 'You stay in control',
    description: 'Review, update, or request removal of your personal data anytime from your dashboard.',
  },
  {
    icon: 'eye-off',
    title: 'Never sold, never shared',
    description: 'Your information stays within UniKL RCMP — it is never shared or sold to third parties.',
  },
]

function FeatureVisual({ type }) {
  if (type === 'form') {
    return (
      <div className="fvisual fvisual-form">
        <div className="fvisual-topbar">
          <span className="fvisual-dot" />
          <span className="fvisual-dot" />
          <span className="fvisual-dot" />
        </div>
        <div className="fvisual-body">
          <div className="fv-field">
            <span className="fv-label">Full Name</span>
            <span className="fv-value">Nur Aisyah binti Rahman</span>
          </div>
          <div className="fv-field">
            <span className="fv-label">Form Type</span>
            <span className="fv-value">Leave of Absence</span>
          </div>
          <div className="fv-row">
            <span className="fv-check">✓</span>
            <span>Supporting document attached</span>
          </div>
          <button type="button" className="fv-submit">
            Submit Form
          </button>
        </div>
      </div>
    )
  }

  if (type === 'fund') {
    return (
      <div className="fvisual fvisual-fund">
        <div className="fv-ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" className="fv-ring-track" />
            <circle cx="60" cy="60" r="50" className="fv-ring-progress" />
          </svg>
          <div className="fv-ring-label">
            <strong>Eligible</strong>
            <span>82% match</span>
          </div>
        </div>
        <div className="fv-fund-details">
          <div className="fv-fund-row">
            <span>Requested amount</span>
            <strong>RM 1,200</strong>
          </div>
          <div className="fv-fund-row">
            <span>Status</span>
            <span className="fv-badge">Under Review</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fvisual fvisual-blog">
      <div className="fv-post">
        <span className="fv-post-tag">Announcement</span>
        <div className="fv-post-line fv-post-line-title" />
        <div className="fv-post-line" />
        <span className="fv-post-date">2 days ago</span>
      </div>
      <div className="fv-post fv-post-alt">
        <span className="fv-post-tag fv-post-tag-alt">Event</span>
        <div className="fv-post-line fv-post-line-title" />
        <div className="fv-post-line fv-post-line-short" />
        <span className="fv-post-date">5 days ago</span>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="landing">
      <Header />

      <main id="top">
        <section className="hero">
          <div className="hero-bg" aria-hidden="true">
            <div className="hero-dotgrid" />
            <div className="hero-blob hero-blob-orange" />
            <div className="hero-blob hero-blob-navy" />
          </div>

          <div className="container hero-content">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Student Development &amp; Campus Lifestyle Department
            </span>

            <h1 className="hero-title">
              One portal for every
              <br />
              <span className="accent">student need.</span>
            </h1>

            <p className="hero-sub">
              Submit official forms, request financial assistance, and keep up with campus
              announcements — all in one place, built for UniKL RCMP students.
            </p>

            <div className="hero-actions">
              <a href="#login" className="btn btn-primary btn-lg">
                Student Login
              </a>
              <a href="#features" className="btn btn-ghost btn-lg">
                Explore Features
              </a>
            </div>

            <div className="hero-stats">
              {STATS.map((stat) => (
                <div className="hero-stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="container">
            <div className="hero-showcase">
              <div className="dashboard-mock">
                <div className="dm-topbar">
                  <div className="dm-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="dm-url">portal.unikl-rcmp.edu.my/dashboard</div>
                </div>

                <div className="dm-body">
                  <aside className="dm-sidebar">
                    <span className="dm-nav-item dm-nav-active">
                      <Icon name="home" />
                    </span>
                    <span className="dm-nav-item">
                      <Icon name="form" />
                    </span>
                    <span className="dm-nav-item">
                      <Icon name="fund" />
                    </span>
                    <span className="dm-nav-item">
                      <Icon name="blog" />
                    </span>
                    <span className="dm-nav-item dm-nav-item-bottom">
                      <Icon name="user" />
                    </span>
                  </aside>

                  <main className="dm-main">
                    <div className="dm-header">
                      <div>
                        <div className="dm-welcome">Welcome back, Aisyah</div>
                        <div className="dm-welcome-sub">Here&apos;s what&apos;s happening today</div>
                      </div>
                      <span className="dm-bell">
                        <Icon name="bell" />
                      </span>
                    </div>

                    <div className="dm-cards">
                      <div className="dm-card">
                        <Icon name="form" />
                        <div>
                          <strong>2 Forms</strong>
                          <span>Pending review</span>
                        </div>
                      </div>
                      <div className="dm-card">
                        <Icon name="fund" />
                        <div>
                          <strong>RM 1,200</strong>
                          <span>Fund approved</span>
                        </div>
                      </div>
                      <div className="dm-card">
                        <Icon name="blog" />
                        <div>
                          <strong>3 Posts</strong>
                          <span>New this week</span>
                        </div>
                      </div>
                    </div>

                    <div className="dm-activity">
                      <div className="dm-activity-line dm-activity-line-wide" />
                      <div className="dm-activity-line" />
                      <div className="dm-activity-line dm-activity-line-short" />
                    </div>
                  </main>
                </div>
              </div>

              <div className="float-card hero-float-1">
                <span className="fv-check">✓</span>
                <span>Form Approved</span>
              </div>
              <div className="float-card hero-float-2">
                <Icon name="blog" />
                <span>New Announcement</span>
              </div>
            </div>
          </div>

          <a href="#features" className="scroll-cue" aria-label="Scroll to features">
            <span>Scroll to explore</span>
            <Icon name="arrow-down" />
          </a>
        </section>

        <section id="features" className="features">
          <div className="container">
            <Reveal as="div" className="section-heading">
              <span className="eyebrow">What you can do</span>
              <h2>Everything handled in one dashboard</h2>
              <p>From paperwork to funding to campus news, the portal brings every student service together.</p>
            </Reveal>

            <div className="feature-rows">
              {FEATURES.map((feature, index) => (
                <Reveal
                  as="div"
                  className={`feature-row ${index % 2 === 1 ? 'feature-row-reverse' : ''}`}
                  key={feature.title}
                >
                  <div className="feature-row-copy">
                    <span className="feature-tag">{feature.tag}</span>
                    <div className="feature-icon">
                      <Icon name={feature.icon} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <ul className="feature-bullets">
                      {feature.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="feature-row-visual">
                    <FeatureVisual type={feature.visual} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="trust" className="trust-section">
          <div className="container trust-top">
            <Reveal as="div" className="trust-copy">
              <span className="eyebrow">Security &amp; Privacy</span>
              <h2>
                Your records.
                <br />
                <span className="accent">Secured, not shared.</span>
              </h2>
              <p>
                Every form, fund request, and document you submit is protected end-to-end —
                visible only to the department that needs it, never sold or shared beyond
                UniKL RCMP.
              </p>
              <a href="#login" className="btn btn-primary btn-lg">
                Student Login
                <Icon name="arrow-right" />
              </a>
            </Reveal>

            <Reveal as="div" className="trust-illustration" delay={120}>
              <img
                src={trustIllustration}
                alt="Illustration of a shield protecting a student ID card"
                width="400"
                height="400"
              />
            </Reveal>
          </div>

          <div className="container">
            <div className="trust-grid">
              {TRUST_FEATURES.map((feature, index) => (
                <Reveal as="div" className="trust-item" key={feature.title} delay={index * 80}>
                  <div className="trust-item-icon">
                    <Icon name={feature.icon} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
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
