import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import StickerArt from '../landing/StickerArt.jsx'
import { ErrorNote } from './StudentUI.jsx'

// Shown on a student's first use, before they can do anything else
// (CLAUDE.md: log the first time they agree, no versioning needed). Cannot
// be dismissed without agreeing.
export default function ConsentModal({ open, onAgreed }) {
  const [checked, setChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleAgree = async () => {
    if (!checked) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/students/me/consent', {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      onAgreed(data.consentAt)
    } catch {
      setError("Hmm, that didn't go through. Mind trying again?")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="st-dialog sm:max-w-lg"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="st-dialog-head">
          <span className="sticker-art st-dialog-sticker">
            <StickerArt name="grad-cap" />
          </span>
          <p className="mg-script st-kicker">selamat datang!</p>
          <DialogTitle className="mg-display st-dialog-title">Welcome to SDCL OnePortal</DialogTitle>
          <DialogDescription className="st-dialog-desc">
            Before we get started, here&apos;s how we take care of your information.
          </DialogDescription>
        </DialogHeader>

        <div className="st-dialog-body">
          <p>
            To help with your welfare, medical, parking, or food coupon requests, SDCL needs a few
            details from you like your program, phone number, and bank account.
          </p>
          <ul>
            <li>
              Your <strong>phone number, bank account, and any dependants&apos; IC numbers</strong>{' '}
              are kept safe and private, and we only use them to help with your requests.
            </li>
            <li>
              We keep your request history for <strong>4 years</strong>, just in case you or the
              school need to look back on it.
            </li>
          </ul>
        </div>

        <label className="st-check">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          I understand and agree to the terms.
        </label>

        {error && <ErrorNote>{error}</ErrorNote>}

        <DialogFooter>
          <button type="button" className="pill pill-orange" disabled={!checked || submitting} onClick={handleAgree}>
            {submitting ? 'Just a sec…' : "Let's go"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
