// PAYMENTS / SOCIAL NOTE:
// The PDF only shows social icons in the footer (TikTok, Facebook,
// Instagram, X) — there's no payment section in the client's design.
// If the client wants payment badges (Visa/Mastercard/M-Pesa/PayPal etc.)
// shown site-wide, this is the natural place to add them: drop an
// <img> row under .footer__social, or add a "We accept" line.
const SOCIAL_LINKS = [
  { label: 'TikTok', href: '#', icon: 'tiktok' },
  { label: 'Facebook', href: '#', icon: 'facebook' },
  { label: 'Instagram', href: '#', icon: 'instagram' },
  { label: 'X', href: '#', icon: 'x' },
]

function SocialIcon({ icon }) {
  // Simple inline SVGs standing in for brand icons. Swap for an icon
  // library (e.g. react-icons) or the client's exact icon set if needed.
  switch (icon) {
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M16.6 5.82a4.28 4.28 0 0 1-3.15-1.42v9.9a5.16 5.16 0 1 1-4.44-5.11v2.5a2.66 2.66 0 1 0 1.86 2.54V2h2.58a4.28 4.28 0 0 0 3.15 3.82z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.55c0-.86.24-1.44 1.47-1.44h1.57V4.46c-.27-.04-1.2-.12-2.28-.12-2.25 0-3.8 1.37-3.8 3.89v2.17H8V13.4h2.46V21z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2zm0 5.94a2.34 2.34 0 1 1 0-4.68 2.34 2.34 0 0 1 0 4.68zM16.95 6.8a.84.84 0 1 1-1.68 0 .84.84 0 0 1 1.68 0zM21 7.34c-.06-1.25-.34-2.35-1.24-3.25-.9-.9-2-1.18-3.25-1.24C15.24 2.8 8.76 2.8 7.49 2.85c-1.25.06-2.34.34-3.25 1.24-.9.9-1.18 2-1.24 3.25C2.94 8.76 2.94 15.24 3 16.51c.06 1.25.34 2.35 1.24 3.25.9.9 2 1.18 3.25 1.24 1.27.06 8.75.06 10.02 0 1.25-.06 2.35-.34 3.25-1.24.9-.9 1.18-2 1.24-3.25.06-1.27.06-8.74 0-10.17zm-1.8 12.32a3.16 3.16 0 0 1-1.78 1.78c-1.23.49-4.15.37-5.42.37s-4.2.12-5.42-.37a3.16 3.16 0 0 1-1.78-1.78c-.49-1.22-.37-4.15-.37-5.42s-.12-4.2.37-5.42A3.16 3.16 0 0 1 6.58 4.5c1.22-.49 4.15-.37 5.42-.37s4.2-.12 5.42.37a3.16 3.16 0 0 1 1.78 1.78c.49 1.22.37 4.15.37 5.42s.12 4.2-.37 5.42z" />
        </svg>
      )
    case 'x':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M18.24 3h2.86l-6.24 7.13L22 21h-5.75l-4.5-5.89L6.5 21H3.63l6.68-7.63L3 3h5.9l4.07 5.38zm-1 16.2h1.58L7.83 4.7H6.13z" />
        </svg>
      )
    default:
      return null
  }
}

export default function Footer() {
  return (
    <footer className="bg-ink text-paper py-10 px-5 flex flex-col items-center text-center">
      <div className="flex gap-[3px] font-display font-extrabold text-2xl">
        <span>E</span>
        <span>L</span>
      </div>
      <p className="text-[0.55rem] tracking-[0.2em] font-semibold text-mist-300 mt-1 mb-5">
        Eliud Okwomi
      </p>

      <ul className="flex gap-3.5">
        {SOCIAL_LINKS.map((s) => (
          <li key={s.label}>
            {/* TODO: point these at the client's real social profiles */}
            <a
              href={s.href}
              aria-label={s.label}
              className="w-8 h-8 rounded-full bg-paper text-ink flex items-center justify-center transition hover:-translate-y-0.5 hover:opacity-85"
            >
              <SocialIcon icon={s.icon} />
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )
}
