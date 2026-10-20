import { useState } from 'react'
import Header from '../landing/Header.jsx'
import Footer from '../landing/Footer.jsx'
import BackToTop from '../landing/BackToTop.jsx'
import Reveal from '../landing/Reveal.jsx'
import Icon from '../landing/Icon.jsx'
import './BlogPage.css'

const CATEGORIES = ['All', 'Announcement', 'Event', 'Deadline', 'Health', 'Academic']

const FEATURED_POST = {
  category: 'Deadline',
  title: 'Semester 2 Financial Aid Applications Close 15 November',
  excerpt:
    'Students who wish to apply for the Zakat Fund, PTPTN top-up, or SDCL emergency assistance for the upcoming semester must submit their applications before the deadline. Late submissions will not be entertained.',
  date: 'Oct 18, 2026',
  author: 'SDCL Department',
}

const POSTS = [
  {
    category: 'Announcement',
    title: 'Campus Clinic Operating Hours Updated for the Semester',
    excerpt: 'The student health clinic will now operate from 8am to 9pm on weekdays to better serve RCMP students during exam season.',
    date: 'Oct 15, 2026',
  },
  {
    category: 'Event',
    title: 'Mental Health Awareness Week: Free Counselling Sessions',
    excerpt: 'SDCL is organizing a full week of workshops, talks, and free one-on-one counselling sessions for all students. Register via the portal.',
    date: 'Oct 12, 2026',
  },
  {
    category: 'Deadline',
    title: 'PTPTN Loan Disbursement Form Submission Reminder',
    excerpt: 'Students receiving PTPTN loans this semester must submit their disbursement confirmation forms by the end of this month.',
    date: 'Oct 10, 2026',
  },
  {
    category: 'Academic',
    title: 'Clinical Attachment Schedule for Year 3 Students Released',
    excerpt: 'The updated clinical rotation timetable for Year 3 MBBS students is now available for download on the student portal.',
    date: 'Oct 8, 2026',
  },
  {
    category: 'Health',
    title: 'Free Health Screening Booth This Friday at Main Hall',
    excerpt: 'Blood pressure, BMI, and basic health screenings will be available for all students, staff, and faculty members this Friday.',
    date: 'Oct 5, 2026',
  },
  {
    category: 'Event',
    title: 'RCMP Sports Carnival 2026 Registration Now Open',
    excerpt: 'Sign up your team for football, badminton, futsal, and more. Registration closes two weeks before the carnival date.',
    date: 'Oct 2, 2026',
  },
  {
    category: 'Announcement',
    title: 'New Student Lounge Opens at Block C',
    excerpt: 'A new air-conditioned student lounge with study pods and charging stations is now open for use on Level 2, Block C.',
    date: 'Sep 29, 2026',
  },
  {
    category: 'Academic',
    title: 'Library Extended Hours During Final Exam Period',
    excerpt: 'The library will remain open until midnight throughout the final examination period to support student revision.',
    date: 'Sep 25, 2026',
  },
]

function categoryTone(category) {
  switch (category) {
    case 'Deadline':
      return 'tone-deadline'
    case 'Event':
      return 'tone-event'
    case 'Health':
      return 'tone-health'
    case 'Academic':
      return 'tone-academic'
    default:
      return 'tone-announcement'
  }
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const visiblePosts =
    activeCategory === 'All' ? POSTS : POSTS.filter((post) => post.category === activeCategory)

  return (
    <div className="landing">
      <Header />

      <main id="top">
        <section className="blog-hero">
          <div className="hero-bg" aria-hidden="true">
            <div className="hero-dotgrid" />
            <div className="hero-blob hero-blob-orange" />
            <div className="hero-blob hero-blob-navy" />
          </div>

          <div className="container blog-hero-content">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Student Development &amp; Campus Lifestyle Department
            </span>
            <h1 className="hero-title blog-hero-title">
              Campus <span className="accent">Announcements</span> &amp; Blog
            </h1>
            <p className="hero-sub">
              Official updates, deadlines, and events broadcast directly by SDCL — stay informed
              so you never miss what matters.
            </p>
          </div>
        </section>

        <section className="blog-content">
          <div className="container">
            <Reveal as="article" className="featured-post">
              <span className={`post-tag ${categoryTone(FEATURED_POST.category)}`}>{FEATURED_POST.category}</span>
              <h2>{FEATURED_POST.title}</h2>
              <p>{FEATURED_POST.excerpt}</p>
              <div className="featured-post-meta">
                <span>{FEATURED_POST.author}</span>
                <span className="meta-dot" />
                <span>{FEATURED_POST.date}</span>
              </div>
            </Reveal>

            <div className="blog-filters">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`filter-pill ${activeCategory === category ? 'filter-pill-active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="post-grid">
              {visiblePosts.map((post, index) => (
                <Reveal as="article" className="post-card" key={post.title} delay={(index % 4) * 70}>
                  <div className={`post-card-media ${categoryTone(post.category)}`}>
                    <Icon name={post.category === 'Event' ? 'calendar' : 'blog'} />
                  </div>
                  <div className="post-card-body">
                    <span className={`post-tag ${categoryTone(post.category)}`}>{post.category}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="post-card-footer">
                      <span className="post-date">{post.date}</span>
                      <span className="post-read-more">
                        Read more
                        <Icon name="arrow-right" />
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {visiblePosts.length === 0 && (
              <p className="post-empty">No posts in this category yet. Check back soon.</p>
            )}
          </div>
        </section>
      </main>

      <BackToTop />
      <Footer />
    </div>
  )
}
