import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
// import CollegeLogo from './CollegeLogo'
import heroBg from '../../assets/hero-bg.png'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      {/* Stadium background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="h-full w-full scale-110 object-cover object-center blur-[3px]"
        />
        <div className="absolute inset-0 bg-[#020617]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-transparent to-[#020617]/90" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Header branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-7 text-center"
        >
          {/* <div className="flex justify-center">
            <CollegeLogo />
          </div> */}

          <h1 className="mt-5 text-[1.65rem] font-extrabold uppercase leading-tight tracking-wide text-white sm:text-[1.85rem]">
            World Cup
          </h1>
          <p className="text-[1.65rem] font-extrabold uppercase leading-tight tracking-wide text-gold-400 sm:text-[1.85rem]">
            Prediction League
          </p>

          <p className="mt-2.5 text-[12px] text-white/70 sm:text-[13px]">
            Predict the matches. Earn points. Climb the leaderboard.
          </p>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-xs">
            MES Institute of Technology
          </p>

          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-grass-500/70" />
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/50 sm:text-[11px]">
              Chathannoor, Kollam
            </span>
            <span className="h-px w-10 bg-grass-500/70" />
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="auth-card rounded-2xl px-7 py-8 sm:px-8 sm:py-9"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
