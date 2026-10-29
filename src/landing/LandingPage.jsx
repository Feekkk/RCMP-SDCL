import { Link } from '@tanstack/react-router'
import { MotionConfig, motion, useMotionValue, useSpring } from 'motion/react'
import '@fontsource/nothing-you-could-do'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import Icon from './Icon.jsx'
import Sticker from './Sticker.jsx'
import StickerArt from './StickerArt.jsx'
import './LandingPage.css'
import './Home.css'

const HERO_WORDS = "Our portal aims to lighten student's mental load".split(' ')
const UNDERLINED_FROM = HERO_WORDS.indexOf('mental')

const HERO_STICKERS = [
  { name: 'laptop', label: 'learning aid', x: '12%', y: '24%', size: 150, rotate: -8, depth: 18 },
  { name: 'cash', label: 'welfare aid', x: '8%', y: '52%', size: 140, rotate: 6, depth: 30 },
  { name: 'grad-cap', label: 'stay in class', x: '15%', y: '79%', size: 150, rotate: -6, depth: 12 },
  { name: 'nasi-lemak', label: 'makan time', x: '86%', y: '25%', size: 136, rotate: 8, depth: 24 },
  { name: 'medicine', label: 'clinic visit', x: '92%', y: '53%', size: 108, rotate: -10, depth: 16 },
  { name: 'car', label: 'parking sorted', x: '84%', y: '80%', size: 160, rotate: 4, depth: 28 },
]

const MARQUEE = ['Welfare aid', 'Clinic claims', 'Parking stickers', 'Food coupons', 'Hostels soon']

const STACK_STICKERS = [
  { name: 'teh-tarik', label: 'teh tarik break', x: '7%', y: '10%', size: 96, rotate: -10 },
  { name: 'coupon', label: 'free makan', x: '90%', y: '10%', size: 150, rotate: 9 },
  { name: 'key', label: 'room 3B?', x: '92%', y: '80%', size: 112, rotate: -6 },
]

const SERVICES = [
  { to: '/sd/welfare', title: 'Claim welfare aid', note: 'living, learning & emergency aid', sticker: 'cash', tone: 'lilac' },
  { to: '/sd/medical', title: 'Get clinic visits covered', note: 'RM100 a year, outpatient', sticker: 'medicine', tone: 'pink' },
  { to: '/cl/parking', title: 'Renew parking stickers', note: 'approved once a year', sticker: 'car', tone: 'mint' },
  { to: '/cl/food-coupon', title: 'Grab a food coupon', note: "unclaimed coupons don't expire", sticker: 'coupon', tone: 'sky' },
  { to: '/srd', title: 'Find a hostel room', note: 'coming soon', sticker: 'key', tone: 'peach', soon: true },
]

const wordReveal = {
  hidden: { y: '110%' },
  shown: (index) => ({ y: '0%', transition: { type: 'spring', stiffness: 140, damping: 18, delay: 0.15 + index * 0.06 } }),
}

function HeroWord({ word, index }) {
  return (
    <span className="mg-word" aria-hidden="true">
      <motion.span custom={index} variants={wordReveal} initial="hidden" animate="shown">
        {word}
      </motion.span>
    </span>
  )
}

function Hero() {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const pointer = {
    x: useSpring(pointerX, { stiffness: 60, damping: 18 }),
    y: useSpring(pointerY, { stiffness: 60, damping: 18 }),
  }

  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2)
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2)
  }

  return (
    <section className="mg-panel mg-hero" onPointerMove={onPointerMove}>
      <div className="mg-hero-stickers">
        {HERO_STICKERS.map((sticker, index) => (
          <Sticker key={sticker.name} {...sticker} pointer={pointer} delay={0.5 + index * 0.08} />
        ))}
      </div>

      <div className="container mg-hero-content">
        <motion.p
          className="mg-script mg-hero-hello"
          initial={{ opacity: 0, rotate: -12, y: 10 }}
          animate={{ opacity: 1, rotate: -4, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Welcome to SDCL OnePortal
        </motion.p>

        <h1 className="mg-display mg-hero-title" aria-label={HERO_WORDS.join(' ')}>
          {HERO_WORDS.slice(0, UNDERLINED_FROM).map((word, index) => (
            <HeroWord word={word} index={index} key={index} />
          ))}
          <span className="mg-underlined" aria-hidden="true">
            {HERO_WORDS.slice(UNDERLINED_FROM).map((word, index) => (
              <HeroWord word={word} index={UNDERLINED_FROM + index} key={word} />
            ))}
            <svg className="mg-squiggle" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
              <motion.path
                d="M4 16C40 6 70 22 106 12s68 8 104-2 60 6 86-2"
                fill="none"
                stroke="var(--orange)"
                strokeWidth="7"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.1, duration: 0.7, ease: 'easeInOut' }}
              />
            </svg>
          </span>
        </h1>

        <motion.p
          className="mg-display mg-hero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          Because asking for help shouldn&rsquo;t feel like another assignment.
        </motion.p>

        <motion.div
          className="mg-hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05 }}
        >
          <Link to="/login" className="pill pill-orange pill-lg">
            Student login
            <Icon name="arrow-right" />
          </Link>
          <a href="#services" className="pill pill-white pill-lg">
            See what&rsquo;s inside
            <Icon name="arrow-down" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function Marquee() {
  const items = [...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE]
  return (
    <div className="mg-marquee" aria-hidden="true">
      <div className="mg-marquee-track">
        {items.map((item, index) => (
          <span className="mg-marquee-item" key={index}>
            {item}
            <svg viewBox="0 0 24 24">
              <path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}

function ServiceStack() {
  return (
    <section id="services" className="mg-panel mg-stack">
      <div className="mg-stack-stickers">
        {STACK_STICKERS.map((sticker, index) => (
          <Sticker key={sticker.name} {...sticker} delay={index * 0.12} />
        ))}
      </div>

      <div className="container mg-stack-content">
        <motion.h2
          className="mg-display mg-stack-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          Get help faster than the caf&eacute; runs out of nasi lemak.
          <span className="mg-script mg-stack-aside">you&rsquo;re welcome!</span>
        </motion.h2>

        <p className="mg-display mg-can-label">With SDCL you can:</p>

        <ul className="mg-can-list">
          {SERVICES.map((service, index) => (
            <motion.li
              key={service.to}
              initial={{ opacity: 0, x: index % 2 ? 60 : -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: 'spring', stiffness: 140, damping: 20 }}
            >
              <Link to={service.to} className={`mg-can-row mg-tone-${service.tone}`}>
                <span className="mg-can-sticker sticker-art">
                  <StickerArt name={service.sticker} />
                </span>
                <span className="mg-can-text">
                  <span className="mg-display mg-can-title">
                    {service.title}
                    {service.soon && <span className="mg-soon">Soon</span>}
                  </span>
                  <span className="mg-script mg-can-note">{service.note}</span>
                </span>
                <span className="mg-can-arrow">
                  <Icon name="arrow-right" />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>

        <div className="mg-stack-cta">
          <p className="mg-script">ready when you are</p>
          <Link to="/login" className="pill pill-orange pill-lg">
            Log in to apply
            <Icon name="arrow-right" />
          </Link>
          <span>Use your UniKL student account to start an application.</span>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="landing mg-home">
        <Header />

        <main id="top">
          <Hero />
          <Marquee />
          <ServiceStack />
        </main>

        <BackToTop />
        <Footer />
      </div>
    </MotionConfig>
  )
}
