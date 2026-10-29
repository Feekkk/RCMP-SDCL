// Hand-drawn SVG stickers for the landing page. Each one is flat-colored with a navy
// outline; the white die-cut border and drop shadow come from `.sticker-art` in Home.css.

const INK = '#11155A'

function Laptop() {
  return (
    <svg viewBox="0 0 140 106" aria-hidden="true">
      <rect x="22" y="8" width="96" height="68" rx="9" fill="#3A42B8" stroke={INK} strokeWidth="4" />
      <rect x="30" y="16" width="80" height="52" rx="4" fill="#C9E8FF" />
      <path d="M50 76h40" stroke={INK} strokeWidth="4" />
      <path d="M44 47V38" stroke="#F7941D" strokeWidth="3" strokeLinecap="round" />
      <path d="M57 41v9c0 4 26 4 26 0v-9" fill={INK} />
      <path d="M70 26 92 35 70 44 48 35Z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="44" cy="49" r="2.6" fill="#F7941D" />
      <path d="M8 78h124l-8 16q-2 6-8 6H24q-6 0-8-6Z" fill="#D9DCF5" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="57" y="84" width="26" height="5" rx="2.5" fill={INK} opacity=".3" />
    </svg>
  )
}

function Cash() {
  return (
    <svg viewBox="0 0 150 120" aria-hidden="true">
      <g transform="rotate(-10 70 50)">
        <rect x="12" y="20" width="112" height="60" rx="8" fill="#8FD9A8" stroke={INK} strokeWidth="4" />
        <rect x="22" y="30" width="92" height="40" rx="5" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="4 4" opacity=".45" />
        <circle cx="68" cy="50" r="14" fill="#E9FBEF" stroke={INK} strokeWidth="3" />
        <text x="68" y="55" textAnchor="middle" fontFamily="'Bowlby One', sans-serif" fontSize="12" fill={INK}>RM</text>
        <text x="30" y="47" fontFamily="'Bowlby One', sans-serif" fontSize="12" fill={INK}>50</text>
        <text x="94" y="66" fontFamily="'Bowlby One', sans-serif" fontSize="12" fill={INK}>50</text>
      </g>
      <circle cx="86" cy="94" r="16" fill="#F4C430" stroke={INK} strokeWidth="4" />
      <circle cx="116" cy="84" r="20" fill="#F4C430" stroke={INK} strokeWidth="4" />
      <circle cx="116" cy="84" r="13" fill="none" stroke="#C98F00" strokeWidth="3" />
      <text x="116" y="89" textAnchor="middle" fontFamily="'Bowlby One', sans-serif" fontSize="12" fill={INK}>RM</text>
    </svg>
  )
}

function Medicine() {
  return (
    <svg viewBox="0 0 130 132" aria-hidden="true">
      <rect x="24" y="30" width="64" height="88" rx="12" fill="#F7941D" stroke={INK} strokeWidth="4" />
      <rect x="24" y="54" width="64" height="40" fill="#FFF6E8" stroke={INK} strokeWidth="4" />
      <path d="M56 62v24M44 74h24" stroke="#E5484D" strokeWidth="8" strokeLinecap="round" />
      <rect x="30" y="10" width="52" height="22" rx="5" fill="#fff" stroke={INK} strokeWidth="4" />
      <path d="M40 15v12M50 15v12M60 15v12M70 15v12" stroke={INK} strokeWidth="2.5" strokeLinecap="round" opacity=".35" />
      <g transform="rotate(-35 100 104)">
        <rect x="80" y="95" width="40" height="18" rx="9" fill="#fff" />
        <path d="M100 95h11a9 9 0 0 1 0 18h-11Z" fill="#FF8FB1" />
        <rect x="80" y="95" width="40" height="18" rx="9" fill="none" stroke={INK} strokeWidth="4" />
        <path d="M100 95v18" stroke={INK} strokeWidth="3" />
      </g>
    </svg>
  )
}

function NasiLemak() {
  return (
    <svg viewBox="0 0 130 130" aria-hidden="true">
      <circle cx="65" cy="65" r="57" fill="#fff" stroke={INK} strokeWidth="4" />
      <circle cx="65" cy="65" r="45" fill="none" stroke="#DCE3F0" strokeWidth="3" />
      <path d="M26 54Q60 10 106 50Q104 100 62 106Q22 100 26 54Z" fill="#3FAE5A" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M36 92 96 40" stroke="#2C8A45" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 64q2-26 26-26t24 26q-2 18-24 18t-26-18Z" fill="#FFFDF5" stroke={INK} strokeWidth="3" />
      <path d="M52 52h4M62 48h4M70 56h4M56 62h4M66 66h4" stroke="#E6DFC8" strokeWidth="3" strokeLinecap="round" />
      <path d="M76 72q14-6 19 6 2 13-12 13-13 0-7-19Z" fill="#E5484D" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="47" cy="88" rx="13" ry="10" fill="#fff" stroke={INK} strokeWidth="3" />
      <circle cx="47" cy="88" r="5.5" fill="#FFB321" />
      <circle cx="91" cy="48" r="7" fill="#C6EE9B" stroke="#2F8F4E" strokeWidth="3" />
      <circle cx="99" cy="61" r="6" fill="#C6EE9B" stroke="#2F8F4E" strokeWidth="3" />
      <ellipse cx="66" cy="94" rx="3.5" ry="2.5" fill="#C98A4B" />
      <ellipse cx="73" cy="98" rx="3.5" ry="2.5" fill="#C98A4B" />
      <ellipse cx="62" cy="100" rx="3.5" ry="2.5" fill="#C98A4B" />
    </svg>
  )
}

function Car() {
  return (
    <svg viewBox="0 0 152 96" aria-hidden="true">
      <path
        d="M14 66q0-14 14-16l16-2 14-20q4-4 12-4h30q8 0 12 6l12 18q14 2 14 16v8q0 4-4 4H18q-4 0-4-4Z"
        fill="#F7941D"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M62 47 70 32h14v15Z" fill="#C9E8FF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M90 47V32h14l10 15Z" fill="#C9E8FF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="100" cy="40" r="5.5" fill="#3A42B8" />
      <text x="100" y="43.5" textAnchor="middle" fontFamily="'Bowlby One', sans-serif" fontSize="8" fill="#fff">P</text>
      <path d="M86 56h8" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="134" cy="58" r="3.5" fill="#FFE58A" stroke={INK} strokeWidth="2" />
      <circle cx="42" cy="76" r="13" fill={INK} />
      <circle cx="42" cy="76" r="5" fill="#D9DCF5" />
      <circle cx="112" cy="76" r="13" fill={INK} />
      <circle cx="112" cy="76" r="5" fill="#D9DCF5" />
    </svg>
  )
}

function HostelKey() {
  return (
    <svg viewBox="0 0 130 126" aria-hidden="true">
      <circle cx="44" cy="30" r="17" fill="none" stroke={INK} strokeWidth="9" />
      <circle cx="44" cy="30" r="17" fill="none" stroke="#C7CDD9" strokeWidth="4" />
      <g transform="rotate(-18 44 74)">
        <rect x="39" y="58" width="10" height="56" rx="3" fill="#F4C430" stroke={INK} strokeWidth="4" />
        <path d="M49 92h10v7h-10M49 104h7v7h-7" fill="#F4C430" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <circle cx="44" cy="54" r="15" fill="#F4C430" stroke={INK} strokeWidth="4" />
        <circle cx="44" cy="54" r="5" fill="#fff" stroke={INK} strokeWidth="3" />
      </g>
      <g transform="rotate(14 92 70)">
        <path d="M60 46 74 38" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <rect x="70" y="38" width="50" height="62" rx="8" fill="#FFD1DC" stroke={INK} strokeWidth="4" />
        <circle cx="95" cy="50" r="4" fill="#fff" stroke={INK} strokeWidth="3" />
        <text x="95" y="80" textAnchor="middle" fontFamily="'Bowlby One', sans-serif" fontSize="18" fill={INK}>3B</text>
      </g>
    </svg>
  )
}

function GradCap() {
  return (
    <svg viewBox="0 0 140 110" aria-hidden="true">
      <path d="M32 48v26q38 22 76 0V48L70 64Z" fill="#262D8F" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M70 12 132 38 70 64 8 38Z" fill="#3A42B8" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M70 20 112 38" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".35" />
      <path d="M70 38q30 4 46 8v30" fill="none" stroke="#F7941D" strokeWidth="4" strokeLinecap="round" />
      <path d="M110 74h12l-2 18h-8Z" fill="#F7941D" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="70" cy="38" r="5.5" fill="#F7941D" stroke={INK} strokeWidth="3" />
    </svg>
  )
}

function Coupon() {
  return (
    <svg viewBox="0 0 152 92" aria-hidden="true">
      <path
        d="M20 10h112q8 0 8 8v16a11 11 0 0 0 0 22v16q0 8-8 8H20q-8 0-8-8V56a11 11 0 0 0 0-22V18q0-8 8-8Z"
        fill="#FFE58A"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M106 18v56" stroke={INK} strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" />
      <text x="60" y="48" textAnchor="middle" fontFamily="'Bowlby One', sans-serif" fontSize="19" fill={INK}>MAKAN</text>
      <text x="60" y="66" textAnchor="middle" fontFamily="'Bowlby One', sans-serif" fontSize="10" fill="#D97B06" letterSpacing="2">COUPON</text>
      <path d="M118 34v10a4 4 0 0 0 8 0V34M122 44v16" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function TehTarik() {
  return (
    <svg viewBox="0 0 110 134" aria-hidden="true">
      <path d="M38 14q-6 8 0 14M54 8q-6 10 0 18M70 14q-6 8 0 14" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" opacity=".4" />
      <path d="M20 36h70l-9 86q-1 6-7 6H36q-6 0-7-6Z" fill="#E0B07A" />
      <path d="M20 36h70l-2 18H22Z" fill="#FFF4E0" />
      <path d="M20 36h70l-9 86q-1 6-7 6H36q-6 0-7-6Z" fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M22 54h66" stroke={INK} strokeWidth="2.5" opacity=".35" />
      <path d="M34 64 38 112" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".55" />
    </svg>
  )
}

const ART = {
  laptop: Laptop,
  cash: Cash,
  medicine: Medicine,
  'nasi-lemak': NasiLemak,
  car: Car,
  key: HostelKey,
  'grad-cap': GradCap,
  coupon: Coupon,
  'teh-tarik': TehTarik,
}

export default function StickerArt({ name }) {
  const Art = ART[name]
  return Art ? <Art /> : null
}
