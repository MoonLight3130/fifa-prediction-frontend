import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroBg from '../assets/hero-bg.png'
import { fetchSettings } from '../lib/api/settings'
import { useAsync } from '../hooks/useAsync'

const confettiPieces = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  delay: `${(i % 7) * 0.45}s`,
  duration: `${4 + (i % 5)}s`,
  size: i % 3 === 0 ? 6 : i % 3 === 1 ? 4 : 5,
  rotate: (i * 37) % 360,
}))

export default function Hero() {
  const { data: settings } = useAsync(fetchSettings, [])
  const tournamentTitle = settings?.tournamentName || 'FIFA World Cup Prediction League'
  const [titleMain, titleAccent] = tournamentTitle.includes(' ')
    ? [tournamentTitle.split(' ').slice(0, -2).join(' ') || 'FIFA World Cup', tournamentTitle.split(' ').slice(-2).join(' ') || 'Prediction League']
    : [tournamentTitle, 'Prediction League']
  const bannerText = settings?.homepageBanner || settings?.announcementBanner
  const subtitle = bannerText || 'Predict the results. Earn points. Climb the leaderboard.'

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-navy-950">
      {/* Stadium background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="h-full w-full scale-105 object-cover object-[60%_30%] lg:object-[55%_25%]"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/50 to-transparent" />
        <div className="hero-overlay-bottom absolute inset-0" />
      </div>

      {/* Golden confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {confettiPieces.map((piece) => (
          <span
            key={piece.id}
            className="hero-confetti absolute rounded-sm bg-gold-400/80"
            style={{
              left: piece.left,
              top: '-12px',
              width: piece.size,
              height: piece.size * 1.6,
              transform: `rotate(${piece.rotate}deg)`,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
            }}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-5 pb-44 pt-28 sm:px-8 lg:px-10 lg:pb-52 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[560px] text-center lg:text-left"
        >
            <h1 className="text-[3rem] font-extrabold uppercase leading-[1.06] tracking-tight sm:text-5xl lg:text-[4rem]">
              <span className="block text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
                {titleMain || 'FIFA World Cup'}
              </span>
              <span className="mt-1 block bg-gradient-to-r from-gold-400 via-gold-500 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
                {titleAccent || 'Prediction League'}
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/75 sm:text-base lg:mx-0 lg:mt-6">
              {subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:mt-9 lg:justify-start lg:gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/predict"
                  className="inline-flex min-w-[148px] items-center justify-center rounded-lg bg-grass-500 px-7 py-3.5 text-[13px] font-semibold text-white shadow-[0_4px_24px_rgba(34,197,94,0.4)] transition-all duration-300 hover:bg-grass-600"
                >
                  Predict Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/leaderboard"
                  className="inline-flex min-w-[168px] items-center justify-center rounded-lg border border-white/60 bg-white/5 px-7 py-3.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
                >
                  View Leaderboard
                </Link>
              </motion.div>
            </div>
          </motion.div>
      </div>

      {/* Curve into white section */}
      <div className="pointer-events-none absolute -bottom-px left-0 right-0 z-[2]">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 100V55C180 95 360 15 540 35C720 55 900 10 1080 25C1260 40 1350 20 1440 40V100H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
