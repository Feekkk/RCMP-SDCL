import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

export default function BackToTop() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className={`back-to-top ${showTop ? 'back-to-top-visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <Icon name="arrow-up" />
    </button>
  )
}
