import { Clock, CheckCircle2, XCircle } from 'lucide-react'

export const STATUS = {
  PENDING: { label: 'Pending', icon: Clock, className: 'bg-amber-500/10 text-amber-600' },
  RECOMMENDED: { label: 'Recommended', icon: Clock, className: 'bg-amber-500/10 text-amber-600' },
  APPROVED: { label: 'Approved', icon: CheckCircle2, className: 'bg-emerald-500/10 text-emerald-600' },
  REJECTED: { label: 'Rejected', icon: XCircle, className: 'bg-destructive/10 text-destructive' },
}
