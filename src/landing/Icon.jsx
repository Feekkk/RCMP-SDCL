export default function Icon({ name }) {
  switch (name) {
    case 'form':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 13h6M9 17h6M9 9h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'fund':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 7v10M14.8 9.4c0-1.1-1.25-2-2.8-2s-2.8.9-2.8 2 1.25 1.8 2.8 1.8 2.8.7 2.8 1.8-1.25 2-2.8 2-2.8-.9-2.8-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'blog':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'home':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'bell':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 18.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'user':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 20c1.2-3.5 4-5.5 7-5.5s5.8 2 7 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'lock':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="5" y="11" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 11V7.5a4 4 0 0 1 8 0V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1.6" fill="currentColor" />
        </svg>
      )
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3.5 19 6v6c0 4.5-3 7.3-7 8.5-4-1.2-7-4-7-8.5V6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="m9 12 2 2 4-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'eye-off':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3.5 12S7 5.5 12 5.5c2 0 3.7.8 5.1 1.9M20.5 12S17 18.5 12 18.5c-2 0-3.7-.8-5.1-1.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'arrow-up':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'arrow-down':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4v15M12 19l-6-6M12 19l6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'arrow-right':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'search':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'alert':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3.5 21 19H3L12 3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M12 10v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="17.3" r="1" fill="currentColor" />
        </svg>
      )
    case 'info':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 11v5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
        </svg>
      )
    case 'car':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 16V11l2-5h12l2 5v5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M4 16h16v2a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M6.5 11h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="7.5" cy="16.5" r="1.1" fill="currentColor" />
          <circle cx="16.5" cy="16.5" r="1.1" fill="currentColor" />
        </svg>
      )
    case 'ticket':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.2a1.6 1.6 0 0 0 0 3.6V15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.2a1.6 1.6 0 0 0 0-3.6V9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 7v10" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2.4 2.4" strokeLinecap="round" />
        </svg>
      )
    case 'bed':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 19v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M3 17h18M3 19v1.5M21 19v1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M5 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M12 10V8.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1V10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      )
    case 'users':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="9" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.5 19c1-3 3-4.7 5.5-4.7s4.5 1.7 5.5 4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M15.5 6.2a3 3 0 0 1 0 5.9M19 19c-.7-2.2-1.9-3.7-3.5-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'map-pin':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="12" cy="9.3" r="2.4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )
    case 'chevron-down':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'wifi':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3.5 9.8a13 13 0 0 1 17 0M6.5 13.2a9 9 0 0 1 11 0M9.7 16.6a4.6 4.6 0 0 1 4.6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="19.2" r="1.1" fill="currentColor" />
        </svg>
      )
    default:
      return null
  }
}
