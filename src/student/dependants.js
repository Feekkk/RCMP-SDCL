export const DEPENDANT_STATUSES = ['Employed', 'Unemployed', 'Self-Employed', 'Study']

export function emptyDependant() {
  return { name: '', icNumber: '', relationship: '', status: '', income: '' }
}

// Malaysian IC: first 6 digits are the birth date (YYMMDD). Used only to
// auto-fill the dependant's age, per FORM.md.
export function ageFromIc(icNumber) {
  const digits = (icNumber ?? '').replace(/\D/g, '')
  if (digits.length < 6) return ''
  const yy = Number(digits.slice(0, 2))
  const mm = Number(digits.slice(2, 4))
  const dd = Number(digits.slice(4, 6))
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return ''

  const today = new Date()
  const currentTwoDigitYear = today.getFullYear() % 100
  const birthYear = (yy <= currentTwoDigitYear ? 2000 : 1900) + yy
  const birthDate = new Date(birthYear, mm - 1, dd)
  if (Number.isNaN(birthDate.getTime())) return ''

  let age = today.getFullYear() - birthYear
  const hadBirthdayThisYear =
    today.getMonth() > mm - 1 || (today.getMonth() === mm - 1 && today.getDate() >= dd)
  if (!hadBirthdayThisYear) age -= 1
  return age >= 0 ? age : ''
}
