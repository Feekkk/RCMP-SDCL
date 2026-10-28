import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

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
        className="sm:max-w-lg"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractionOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center justify-center gap-4">
            <img src="/unikl-official.png" alt="UniKL" className="h-10 w-auto" />
            <div className="h-8 w-px bg-border" />
            <img src="/sdcl-logo.png" alt="SDCL" className="h-10 w-auto" />
          </div>
          <DialogTitle className="mt-2 text-center">Welcome to SDCL Student Portal </DialogTitle>
          <DialogDescription className="text-center">
            Before we get started, here&apos;s how we take care of your information.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-56 overflow-y-auto rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          <p>
            To help with your welfare, medical, parking, or food coupon requests, SDCL needs a few
            details from you like your program, phone number, and bank account.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
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

        <label className="flex items-start gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-primary"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          I understand and agree to the terms.
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button disabled={!checked || submitting} onClick={handleAgree}>
            {submitting ? 'Just a sec…' : "Let's go"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
