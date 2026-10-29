import { Clock, CheckCircle2, XCircle, ThumbsUp } from 'lucide-react'

export const STATUS = {
  PENDING: { label: 'Pending', icon: Clock, tone: 'butter' },
  RECOMMENDED: { label: 'Recommended', icon: ThumbsUp, tone: 'sky' },
  APPROVED: { label: 'Approved', icon: CheckCircle2, tone: 'mint' },
  REJECTED: { label: 'Rejected', icon: XCircle, tone: 'pink' },
}

export const isInReview = (status) => status === 'PENDING' || status === 'RECOMMENDED'
