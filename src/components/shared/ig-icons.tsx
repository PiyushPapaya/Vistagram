// Pixel-accurate Instagram SVG icons (matched from Instagram's web app source)

export function IgHome({ filled, size = 24 }: { filled?: boolean; size?: number }) {
  if (filled) return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"/>
    </svg>
  )
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.005 16.545a2.717 2.717 0 0 1 2.715-2.717 2.717 2.717 0 0 1 2.715 2.717v3.67H9.005v-3.67zm3.044-13.39L2.5 9.703V23.5H8.44v-6.82a4.217 4.217 0 0 1 4.26-4.217 4.217 4.217 0 0 1 4.26 4.217V23.5H23.5V9.703L12.049 3.155z" fillRule="evenodd"/>
    </svg>
  )
}

export function IgSearch({ filled, size = 24, className }: { filled?: boolean; size?: number; className?: string }) {
  if (filled) return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path clipRule="evenodd" d="M10.5 0C4.694 0 0 4.694 0 10.5S4.694 21 10.5 21a10.459 10.459 0 0 0 6.841-2.538l4.598 4.598a1.5 1.5 0 0 0 2.121-2.121l-4.598-4.598A10.459 10.459 0 0 0 21 10.5C21 4.694 16.306 0 10.5 0Zm-7.5 10.5a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Z" fillRule="evenodd"/>
    </svg>
  )
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"/>
      <line x1="16.511" y1="16.511" x2="22" y2="22"/>
    </svg>
  )
}

export function IgExplore({ filled, size = 24 }: { filled?: boolean; size?: number }) {
  if (filled) return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="m13.941 13.953-2.36 1.598L8.295 10.69l-1.598 2.36L12 2.004l5.297 11.046-2.36-1.598-1.598 2.36-.001.14zm1.46-2.667-.001-.001c.001 0 0 0 0 0l-3.401 2.302 2.302-3.401L12 2.004l-4.75 9.907 3.401-2.302L8.349 13.01l3.651 5.39 3.651-5.39-2.302 3.401 3.401-2.302L21.996 2.004l-6.595 9.282Z"/>
      <path clipRule="evenodd" d="M12 1a11 11 0 1 0 0 22A11 11 0 0 0 12 1Zm0 2a9 9 0 1 1 0 18A9 9 0 0 1 12 3Z" fillRule="evenodd"/>
    </svg>
  )
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953"/>
      <polygon fillRule="evenodd" fill="currentColor" stroke="none" points="10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056"/>
      <circle cx="12.001" cy="12.005" r="10.5"/>
    </svg>
  )
}

export function IgReels({ filled, size = 24 }: { filled?: boolean; size?: number }) {
  if (filled) return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.908.908 0 0 1-.91 0Z"/>
      <path clipRule="evenodd" d="M2 3.872A1.872 1.872 0 0 1 3.872 2h16.256A1.872 1.872 0 0 1 22 3.872v16.256A1.872 1.872 0 0 1 20.128 22H3.872A1.872 1.872 0 0 1 2 20.128V3.872ZM13.53 4h-3.06l1.5 3h3.06l-1.5-3Zm-5 0H7.207a1.872 1.872 0 0 0-1.32.547L4 6.435V7h2.03L8.53 4ZM4 9v9.128c0 .484.392.872.872.872h14.256A.872.872 0 0 0 20 18.128V9H4Zm16-2h-2.03l-1.5-3h1.658a.872.872 0 0 1 .872.872V7Z" fillRule="evenodd"/>
    </svg>
  )
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2">
      <line x1="2.049" y1="7.002" x2="21.95" y2="7.002"/>
      <line x1="13.504" y1="2.001" x2="16.362" y2="7.002"/>
      <line x1="7.207" y1="2.001" x2="10.002" y2="7.002"/>
      <path d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.703 2 8.552Z" strokeLinecap="round"/>
      <path d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.908.908 0 0 1-.91 0Z" fill="currentColor" stroke="none" fillRule="evenodd"/>
    </svg>
  )
}

export function IgMessages({ filled, size = 24, className }: { filled?: boolean; size?: number; className?: string }) {
  if (filled) return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.005 1.196a1.016 1.016 0 0 0-1.394-.137L1.05 15.321a1 1 0 0 0 .543 1.783l4.907.654 1.885 5.318a1.001 1.001 0 0 0 1.803-.036l2.33-5.887 8.223 1.098a1 1 0 0 0 1.085-1.24l-3.82-15.815z"/>
    </svg>
  )
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.003 1.161a1.016 1.016 0 0 0-1.392-.135L1.05 15.296a1 1 0 0 0 .54 1.786l4.907.655L8.37 23.05a1.001 1.001 0 0 0 1.803-.036l2.332-5.887 8.222 1.098a1 1 0 0 0 1.085-1.24L22.003 1.161ZM9.902 21.098l-1.49-4.199 8.392-8.386-9.8 6.816-.962-.128L18.848 3.374l2.887 11.936-11.833-1.58z"/>
    </svg>
  )
}

export function IgNotifications({ filled, size = 24 }: { filled?: boolean; size?: number }) {
  if (filled) return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938"/>
    </svg>
  )
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"/>
    </svg>
  )
}

export function IgCreate({ size = 24 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.908.938 2.067 1.608 4.946 1.608h6.896c2.878 0 4.037-.67 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.387 2.67 18.228 2 15.35 2H8.552c-2.878 0-4.037.67-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"/>
      <line x1="6.545" y1="12.001" x2="17.455" y2="12.001"/>
      <line x1="12.003" y1="6.545" x2="12.003" y2="17.455"/>
    </svg>
  )
}

export function IgMore({ size = 24 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <line x1="3" y1="4" x2="21" y2="4"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="20" x2="21" y2="20"/>
    </svg>
  )
}

// Post action icons
export function IgHeart({ filled, size = 24, className }: { filled?: boolean; size?: number; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#ed4956' : 'none'} className={className}>
      {filled ? (
        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938"/>
      ) : (
        <path stroke="currentColor" strokeWidth="1.75" d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"/>
      )}
    </svg>
  )
}

export function IgComment({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.75" className={className}>
      <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"/>
    </svg>
  )
}

export function IgShare({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.75" className={className}>
      <line x1="22" y1="3" x2="9.218" y2="10.083"/>
      <polygon points="11.698 20.334 22 3.001 2 9.671 9.218 10.083 11.698 20.334"/>
    </svg>
  )
}

export function IgBookmark({ filled, size = 24, className }: { filled?: boolean; size?: number; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" className={className}>
      <polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"/>
    </svg>
  )
}

export function IgEmoji({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  )
}

export function IgEllipsis({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="1.5"/>
      <circle cx="6" cy="12" r="1.5"/>
      <circle cx="18" cy="12" r="1.5"/>
    </svg>
  )
}

// Instagram wordmark SVG
export function IgWordmark({ className }: { className?: string }) {
  return (
    <svg
      aria-label="Instagram"
      className={className}
      viewBox="0 0 103 30"
      fill="currentColor"
      height="29"
      role="img"
    >
      {/* "Instagram" in Billabong-style script — approximated with path */}
      <text
        x="0" y="26"
        fontFamily="'Grand Hotel', 'Pacifico', 'Dancing Script', cursive"
        fontSize="28"
        fontWeight="400"
        fill="currentColor"
      >
        Instagram
      </text>
    </svg>
  )
}

export function IgVerified({ size = 14 }: { size?: number }) {
  return (
    <svg aria-label="Verified" width={size} height={size} viewBox="0 0 40 40" fill="#0095f6">
      <path d="M19.998 3.094L14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v6.354h6.234L14.638 40l5.36-3.094L25.358 40l2.972-5.15h6.234v-6.354L40 25.359 36.905 20 40 14.64l-5.432-3.137V5.15h-6.234L25.358 0z" fillRule="evenodd"/>
      <path d="M17.477 27.977L9 19.5l2.121-2.121 6.356 6.356 11.356-11.356L30.955 14.5z" fill="#fff"/>
    </svg>
  )
}
