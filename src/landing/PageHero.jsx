import { Link } from '@tanstack/react-router'
import { MotionConfig, motion } from 'motion/react'
import '@fontsource/nothing-you-could-do'
import Icon from './Icon.jsx'
import Sticker from './Sticker.jsx'
import './Home.css'

// Pastel hero panel shared by the public unit, service and blog pages.
export default function PageHero({ tone = 'aqua', back, kicker, title, sub, stickers = [] }) {
  return (
    <MotionConfig reducedMotion="user">
      <section className={`mg-panel mg-page-hero mg-bg-${tone}`}>
        <div className="mg-page-hero-stickers">
          {stickers.map((sticker, index) => (
            <Sticker key={sticker.name} {...sticker} delay={0.25 + index * 0.1} />
          ))}
        </div>

        <motion.div
          className="container mg-page-hero-content"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        >
          {back && (
            <Link to={back.to} className="pill pill-white pill-sm mg-page-hero-back">
              <Icon name="arrow-right" />
              {back.label}
            </Link>
          )}
          {kicker && <p className="mg-script mg-page-hero-kicker">{kicker}</p>}
          <h1 className="mg-display mg-page-hero-title">{title}</h1>
          {sub && <p className="mg-page-hero-sub">{sub}</p>}
        </motion.div>
      </section>
    </MotionConfig>
  )
}
