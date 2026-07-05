import { GiTrophyCup } from 'react-icons/gi'

interface TrophyPlaceholderProps {
  className?: string
}

export default function TrophyPlaceholder({ className = '' }: TrophyPlaceholderProps) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 280" fill="none" className="h-full w-full drop-shadow-2xl">
        <defs>
          <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="30%" stopColor="#facc15" />
            <stop offset="60%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="trophyShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Cup body */}
        <path
          d="M60 30 C60 10 140 10 140 30 L135 120 C135 145 115 160 100 160 C85 160 65 145 65 120 Z"
          fill="url(#trophyGold)"
          filter="url(#glow)"
        />
        <path
          d="M60 30 C60 10 140 10 140 30 L135 120 C135 145 115 160 100 160 C85 160 65 145 65 120 Z"
          fill="url(#trophyShine)"
        />

        {/* Left handle */}
        <path
          d="M60 45 C20 45 15 80 25 100 C35 115 50 110 60 100"
          stroke="url(#trophyGold)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />

        {/* Right handle */}
        <path
          d="M140 45 C180 45 185 80 175 100 C165 115 150 110 140 100"
          stroke="url(#trophyGold)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />

        {/* Stem */}
        <rect x="88" y="160" width="24" height="40" rx="2" fill="url(#trophyGold)" />

        {/* Base */}
        <rect x="65" y="200" width="70" height="12" rx="3" fill="url(#trophyGold)" />
        <rect x="55" y="212" width="90" height="14" rx="4" fill="url(#trophyGold)" />
        <rect x="45" y="226" width="110" height="18" rx="5" fill="url(#trophyGold)" />

        {/* Globe detail on cup */}
        <circle cx="100" cy="80" r="22" stroke="#ca8a04" strokeWidth="1.5" fill="none" opacity="0.5" />
        <ellipse cx="100" cy="80" rx="22" ry="8" stroke="#ca8a04" strokeWidth="1" fill="none" opacity="0.4" />
        <line x1="78" y1="80" x2="122" y2="80" stroke="#ca8a04" strokeWidth="1" opacity="0.4" />
      </svg>

      <GiTrophyCup className="sr-only" aria-hidden="true" />
    </div>
  )
}
