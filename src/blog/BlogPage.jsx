import { useState } from 'react'
import Header from '../landing/Header.jsx'
import Footer from '../landing/Footer.jsx'
import BackToTop from '../landing/BackToTop.jsx'
import Reveal from '../landing/Reveal.jsx'
import Icon from '../landing/Icon.jsx'
import PageHero from '../landing/PageHero.jsx'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog.jsx'
import { CATEGORIES, FEATURED_POST, POSTS, categoryTone } from './posts.js'
import './BlogPage.css'

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedPost, setSelectedPost] = useState(null)

  const visiblePosts =
    activeCategory === 'All' ? POSTS : POSTS.filter((post) => post.category === activeCategory)

  return (
    <div className="landing mg-page">
      <Header />

      <main id="top">
        <PageHero
          tone="sky"
          kicker="live from SDCL"
          title="Campus announcements & blog"
          sub="Official updates, deadlines, and events broadcast directly by SDCL — stay informed so you never miss what matters."
          stickers={[
            { name: 'laptop', label: 'stay updated', x: '12%', y: '50%', size: 130, rotate: -6 },
            { name: 'grad-cap', label: "don't miss out", x: '88%', y: '52%', size: 130, rotate: 6 },
          ]}
        />

        <section className="blog-content">
          <div className="container">
            <Reveal
              as="article"
              className="featured-post"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedPost(FEATURED_POST)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setSelectedPost(FEATURED_POST)
                }
              }}
            >
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
                <Reveal
                  as="article"
                  className="post-card"
                  key={post.title}
                  delay={(index % 4) * 70}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPost(post)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedPost(post)
                    }
                  }}
                >
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

      <Dialog open={Boolean(selectedPost)} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="blog-post-dialog">
          {selectedPost && (
            <>
              <DialogHeader>
                <span className={`post-tag ${categoryTone(selectedPost.category)}`}>
                  {selectedPost.category}
                </span>
                <DialogTitle>{selectedPost.title}</DialogTitle>
                <DialogDescription>{selectedPost.excerpt}</DialogDescription>
              </DialogHeader>
              <div className="featured-post-meta">
                {selectedPost.author && (
                  <>
                    <span>{selectedPost.author}</span>
                    <span className="meta-dot" />
                  </>
                )}
                <span>{selectedPost.date}</span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
