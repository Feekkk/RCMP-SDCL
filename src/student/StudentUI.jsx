import { AlertCircle } from 'lucide-react'
import StickerArt from '../landing/StickerArt.jsx'
import { STATUS } from './applicationStatus.js'
import '../landing/LandingPage.css'
import '../landing/Home.css'
import './Student.css'

export function StudentLoading() {
  return (
    <div className="st-loading" role="status">
      <span className="sticker-art st-loading-sticker">
        <StickerArt name="grad-cap" />
      </span>
      <p className="mg-script">just a sec…</p>
    </div>
  )
}

export function StatusPill({ status }) {
  const info = STATUS[status] ?? STATUS.PENDING
  const StatusIcon = info.icon
  return (
    <span className={`st-status st-tone-${info.tone}`}>
      <StatusIcon />
      {info.label}
    </span>
  )
}

export function ErrorNote({ children }) {
  return (
    <div className="st-error" role="alert">
      <AlertCircle />
      <span>{children}</span>
    </div>
  )
}

export function formatDate(value) {
  return value
    ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'
}
