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
  { value: '3,200+', label: 'Active Students', icon: 'users', tone: 'navy' },
  { value: '12,000+', label: 'Forms Processed', icon: 'form', tone: 'orange' },
  { value: '48h', label: 'Avg. Fund Review', icon: 'clock', tone: 'gold' },
  { value: '100%', label: 'Digital & Paperless', icon: 'leaf', tone: 'green' },
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
              Your one-stop gateway to student services, campus opportunities, financial
              requests, and a vibrant university experience.
            </p>

            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">
                <Icon name="user" />
                Student Login
                <Icon name="arrow-right" />
              </Link>
              <a href="#blog" className="btn btn-ghost btn-lg">
                Explore the Blog
                <Icon name="external-link" />
              </a>
            </div>
          </div>

          <div className="container hero-stats-wrap">
            <div className="hero-stats-card">
              {STATS.map((stat) => (
                <div className="hero-stat" key={stat.label}>
                  <span className={`hero-stat-icon hero-stat-icon-${stat.tone}`}>
                    <Icon name={stat.icon} />
                  </span>
                  <div className="hero-stat-body">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a href="#blog" className="scroll-cue" aria-label="Scroll to campus blog">
            <span>Scroll to explore</span>
            <Icon name="arrow-down" />
          </a>
        </section>

        <section id="blog" className="home-blog">
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
