// Visual identity for each fund category. Categories themselves are data
// (CLAUDE.md), so a category added later without an entry here still renders
// with the fallback look.
const FUND_LOOK = {
  'living-allowance': { sticker: 'cash', tone: 'lilac' },
  'learning-aid': { sticker: 'laptop', tone: 'sky' },
  umi: { sticker: 'nasi-lemak', tone: 'butter' },
  'medical-support-supply': { sticker: 'glasses', tone: 'pink' },
  bereavement: { sticker: 'lily', tone: 'aqua' },
  'travel-assistance-bereavement': { sticker: 'bus', tone: 'mint' },
  'natural-disasters': { sticker: 'storm', tone: 'peach' },
  others: { sticker: 'bubble', tone: 'cream' },
  'medical-outpatient': { sticker: 'medicine', tone: 'pink' },
}

const FALLBACK_LOOK = { sticker: 'grad-cap', tone: 'cream' }

export const fundLook = (code) => FUND_LOOK[code] ?? FALLBACK_LOOK

export const FUND_MODULES = [
  {
    key: 'WELFARE',
    applyPath: '/student/welfare/apply',
    title: 'Student Welfare',
    kicker: 'student development',
    flow: 'Reviewed and recommended by SD staff, then approved by the Board Committee.',
    sticker: 'cash',
  },
  {
    key: 'MEDICAL',
    applyPath: '/student/medical/apply',
    title: 'Medical Outpatient',
    kicker: 'student development',
    flow: 'Reviewed by the HOD / DD approval board. Every approver must approve.',
    sticker: 'medicine',
  },
]

export const moduleInfo = (key) => FUND_MODULES.find((m) => m.key === key) ?? FUND_MODULES[0]

// Campus Lifestyle modules have no application engine yet (build order step 4).
export const COMING_SOON = [
  {
    key: 'parking',
    name: 'Parking Sticker',
    sticker: 'car',
    tone: 'mint',
    amount: 'Valid for one year',
    notes: 'Register your vehicle for campus parking. Renewed every year.',
  },
  {
    key: 'food-coupon',
    name: 'Food Coupon',
    sticker: 'coupon',
    tone: 'butter',
    amount: 'One-time approval',
    notes: 'Get a digital coupon you can claim and redeem on campus.',
  },
]

// The profile is completed before any application (CLAUDE.md).
export const profileChecklist = (profile) => [
  { label: 'Programme', done: Boolean(profile?.program) },
  { label: 'Semester', done: Boolean(profile?.currentSemester) },
  { label: 'Phone number', done: Boolean(profile?.contactNumber) },
  { label: 'Bank account', done: Boolean(profile?.bankName && profile?.bankNumber) },
]
