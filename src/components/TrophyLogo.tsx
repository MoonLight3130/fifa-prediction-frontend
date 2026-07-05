import trophyLogo from '../assets/trophy-logo.png'

interface TrophyLogoProps {
  className?: string
}

export default function TrophyLogo({ className = 'h-9 w-auto sm:h-10' }: TrophyLogoProps) {
  return (
    <img
      src={trophyLogo}
      alt="World Cup trophy"
      className={`shrink-0 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] ${className}`}
    />
  )
}
