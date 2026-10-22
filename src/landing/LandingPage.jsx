import { Link } from '@tanstack/react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { POSTS, categoryTone } from '../blog/posts.js'
import './LandingPage.css'

const LATEST_POSTS = POSTS.slice(0, 3)
const [FEATURED_POST, ...SIDE_POSTS] = LATEST_POSTS

const STATS = [
  { value: '3,200+', label: 'Active Students' },
  { value: '12,000+', label: 'Forms Processed' },
  { value: '48h', label: 'Avg. Fund Review' },
  { value: '100%', label: 'Digital & Paperless' },
]

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
              <Link to="/login" className="btn btn-primary btn-lg">
                Student Login
              </Link>
              <a href="#blog" className="btn btn-ghost btn-lg">
                Explore the Blog
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

          <a href="#blog" className="scroll-cue" aria-label="Scroll to campus blog">
            <span>Scroll to explore</span>
            <Icon name="arrow-down" />
          </a>
        </section>

        <section id="blog" className="home-blog">
          <div className="hero-bg" aria-hidden="true">
            <div className="hero-blob hero-blob-orange home-blog-blob-orange" />
            <div className="hero-blob hero-blob-navy home-blog-blob-navy" />
          </div>

          <div className="container home-blog-head">
            <Reveal as="div">
              <span className="home-blog-live">
                <span className="home-blog-live-dot" />
                Live from SDCL
              </span>
              <h2>Campus Blog</h2>
              <p>Announcements, events, and deadlines broadcast directly by the Student Development &amp; Campus Lifestyle Department.</p>
            </Reveal>

            <Reveal as="div" delay={80}>
              <Link to="/blog" className="btn btn-ghost home-blog-head-cta">
                View all posts
                <Icon name="arrow-right" />
              </Link>
            </Reveal>
          </div>

          <div className="container home-blog-layout">
            <Reveal as={Link} to="/blog" className="home-blog-featured">
              <div className={`post-card-media home-blog-featured-media ${categoryTone(FEATURED_POST.category)}`}>
                <Icon name={FEATURED_POST.category === 'Event' ? 'calendar' : 'blog'} />
              </div>
              <div className="home-blog-featured-body">
                <span className={`post-tag ${categoryTone(FEATURED_POST.category)}`}>{FEATURED_POST.category}</span>
                <h3>{FEATURED_POST.title}</h3>
                <p>{FEATURED_POST.excerpt}</p>
                <div className="post-card-footer">
                  <span className="post-date">{FEATURED_POST.date}</span>
                  <span className="post-read-more">
                    Read more
                    <Icon name="arrow-right" />
                  </span>
                </div>
              </div>
            </Reveal>

            <div className="home-blog-side">
              {SIDE_POSTS.map((post, index) => (
                <Reveal as={Link} to="/blog" className="home-blog-side-item" key={post.title} delay={(index + 1) * 90}>
                  <div className={`post-card-media home-blog-side-icon ${categoryTone(post.category)}`}>
                    <Icon name={post.category === 'Event' ? 'calendar' : 'blog'} />
                  </div>
                  <div className="home-blog-side-body">
                    <span className={`post-tag ${categoryTone(post.category)}`}>{post.category}</span>
                    <h4>{post.title}</h4>
                    <span className="post-date">{post.date}</span>
                  </div>
                  <Icon name="arrow-right" />
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
