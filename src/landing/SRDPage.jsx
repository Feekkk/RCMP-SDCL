import { useState } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog.jsx'
import './LandingPage.css'
import './UnitPage.css'

const HOSTELS = [
  {
    id: 'anggerik',
    name: 'Anggerik Residence',
    type: 'Female',
    media: 'hostel-media-a',
    capacity: '4 students / room',
    roomType: 'Quad-sharing',
    rate: 'RM 220 / semester',
    tags: ['Wi-Fi', 'Study Lounge', '24h Security', 'Laundry'],
    address: 'Block D, UniKL RCMP Campus',
    facilities: [
      'Air-conditioned rooms with study desks',
      'Shared kitchenette on every floor',
      'CCTV-monitored common areas',
      'Walking distance to the main lecture halls',
    ],
  },
  {
    id: 'cempaka',
    name: 'Cempaka Residence',
    type: 'Male',
    media: 'hostel-media-b',
    capacity: '2 students / room',
    roomType: 'Twin-sharing',
    rate: 'RM 280 / semester',
    tags: ['Wi-Fi', 'Gym Access', '24h Security'],
    address: 'Block E, UniKL RCMP Campus',
    facilities: [
      'En-suite bathroom in every room',
      'Common lounge with TV and games area',
      'Nearby campus gym and futsal court',
      '24-hour security patrol and card access',
    ],
  },
  {
    id: 'seroja',
    name: 'Seroja Residence',
    type: 'Mixed',
    media: 'hostel-media-c',
    capacity: '1 student / room',
    roomType: 'Single occupancy',
    rate: 'RM 420 / semester',
    tags: ['Wi-Fi', 'Study Lounge', 'Laundry', '24h Security'],
    address: 'Block F, UniKL RCMP Campus',
    facilities: [
      'Private room with attached study area',
      'Dedicated quiet floor for final-year students',
      'On-site laundry room with card payment',
      'Shuttle bus stop right outside the block',
    ],
  },
]

export default function SRDPage() {
  const [selected, setSelected] = useState(null)

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
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Student Residential (SRD) &middot; Coming Soon
            </span>
            <h1 className="hero-title page-hero-title">
              Explore hostel <span className="accent">blocks &amp; room details</span>
            </h1>
            <p className="hero-sub">
              Browse available hostel blocks and room details below. Online booking and
              maintenance requests (CRM) are launching soon — this page currently previews sample
              listings.
            </p>
          </div>
        </section>

        <section className="module-section">
          <div className="container">
            <Reveal as="div" className="module-head">
              <span className="eyebrow">Hostel Listings</span>
              <h2>Available hostel blocks</h2>
              <p>
                Details shown here are sample listings while the Student Residential Unit is being
                set up. Tap a block to see more room details.
              </p>
            </Reveal>

            <div className="hostel-grid">
              {HOSTELS.map((hostel, index) => (
                <Reveal
                  as="article"
                  className="hostel-card"
                  key={hostel.id}
                  delay={index * 80}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(hostel)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelected(hostel)
                    }
                  }}
                >
                  <div className={`hostel-media ${hostel.media}`}>
                    <span className="hostel-type-badge">{hostel.type}</span>
                    <Icon name="bed" />
                  </div>
                  <div className="hostel-body">
                    <h3>{hostel.name}</h3>
                    <div className="hostel-meta-row">
                      <span>
                        <Icon name="users" /> {hostel.capacity}
                      </span>
                      <span>
                        <Icon name="bed" /> {hostel.roomType}
                      </span>
                    </div>
                    <div className="hostel-tags">
                      {hostel.tags.map((tag) => (
                        <span className="hostel-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="hostel-rate">{hostel.rate}</div>
                    <div className="hostel-card-footer">
                      View details
                      <Icon name="arrow-right" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="callout callout-info">
              <span className="callout-icon">
                <Icon name="info" />
              </span>
              <p>
                Online booking, room assignment, and complaint/maintenance requests (CRM) are not
                open yet. This page will be updated once the Student Residential Unit launches.
              </p>
            </div>
          </div>
        </section>
      </main>

      <BackToTop />
      <Footer />

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="hostel-dialog">
          {selected && (
            <>
              <DialogHeader>
                <span className="hostel-tag">{selected.type}</span>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>
                  <span className="hostel-dialog-meta">
                    <span className="badge-pill">
                      <Icon name="map-pin" /> {selected.address}
                    </span>
                    <span className="badge-pill">
                      <Icon name="users" /> {selected.capacity}
                    </span>
                    <span className="badge-pill">
                      <Icon name="bed" /> {selected.roomType}
                    </span>
                  </span>
                </DialogDescription>
              </DialogHeader>
              <ul className="hostel-dialog-list">
                {selected.facilities.map((facility) => (
                  <li key={facility}>{facility}</li>
                ))}
              </ul>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
