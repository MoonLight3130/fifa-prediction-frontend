import { useEffect, useState } from 'react'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Flag from './Flag'
import PredictionCountdown from './PredictionCountdown'
import { useAsync } from '../hooks/useAsync'
import { fetchNextMatch } from '../lib/api/matches'
import { isFlagCode } from '../lib/flags'
import type { FlagCode } from '../lib/flags'
import { getPredictionStatus } from '../lib/matchValidation'

function useKickoffCountdown(kickoffAt?: string | null) {
  const target = kickoffAt ? new Date(kickoffAt).getTime() : null
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!target) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [target])

  return useMemo(() => {
    if (!target) return { hours: 0, minutes: 0, seconds: 0 }
    const diff = Math.max(0, target - now)
    return {
      hours: Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }, [target, now])
}

export default function NextMatchCard() {
  const { data: match, loading, error } = useAsync(fetchNextMatch, [])
  const { hours, minutes, seconds } = useKickoffCountdown(match?.kickoffAt)

  if (loading) {
    return (
      <div className="glass-card flex min-h-[340px] flex-1 items-center justify-center rounded-[20px]">
        <p className="text-sm text-white/50">Loading next match...</p>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="glass-card flex min-h-[340px] flex-1 items-center justify-center rounded-[20px] px-6 text-center">
        <p className="text-sm text-white/50">{error ?? 'No upcoming matches scheduled.'}</p>
      </div>
    )
  }

  const homeCodeStr = match.homeTeam.code || match.homeTeam.name
  const awayCodeStr = match.awayTeam.code || match.awayTeam.name
  const homeCode = isFlagCode(homeCodeStr) ? homeCodeStr : undefined
  const awayCode = isFlagCode(awayCodeStr) ? awayCodeStr : undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="glass-card flex min-h-[340px] flex-1 flex-col rounded-[20px] px-7 py-7 sm:px-8 sm:py-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-white sm:text-lg">Next Match</h2>
        <PredictionCountdown 
          deadline={match.predictionDeadline} 
          kickoffAt={match.kickoffAt} 
          homeTeamName={match.homeTeam.name}
          awayTeamName={match.awayTeam.name}
          isClosed={!match.predictionsOpen || match.resultPublished}
        />
      </div>

      <div className="mt-8 flex flex-1 flex-col justify-center">
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col items-center gap-3">
            {homeCode ? <Flag code={homeCode} size="lg" /> : <div className="h-12 w-12 rounded-full bg-white/10" />}
            <span className="text-center text-[11px] font-bold tracking-[0.14em] text-white sm:text-xs">
              {match.homeTeam.name.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 px-2">
            <span className="text-2xl font-bold text-white sm:text-[1.65rem]">VS</span>
            <span className="text-[10px] font-medium text-white/45 sm:text-[11px]">
              {match.stageLabel}
            </span>
          </div>

          <div className="flex flex-col items-center gap-3">
            {awayCode ? <Flag code={awayCode} size="lg" /> : <div className="h-12 w-12 rounded-full bg-white/10" />}
            <span className="text-center text-[11px] font-bold tracking-[0.14em] text-white sm:text-xs">
              {match.awayTeam.name.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mt-9 flex items-start justify-center gap-1 sm:gap-2">
          {[
            { value: String(hours).padStart(2, '0'), label: 'HOURS' },
            { value: String(minutes).padStart(2, '0'), label: 'MINUTES' },
            { value: String(seconds).padStart(2, '0'), label: 'SECONDS' },
          ].map((unit, i) => (
            <div key={unit.label} className="flex items-start">
              <div className="min-w-[60px] text-center sm:min-w-[68px]">
                <p className="text-[2.1rem] font-bold tabular-nums leading-none text-white sm:text-[2.35rem]">
                  {unit.value}
                </p>
                <p className="mt-2 text-[9px] font-medium tracking-[0.16em] text-white/35 sm:text-[10px]">
                  {unit.label}
                </p>
              </div>
              {i < 2 && (
                <span className="mt-1 px-1 text-xl font-light text-white/25 sm:px-2 sm:text-2xl">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] text-white/40 sm:text-xs">
        {match.date} · {match.time}
        {match.venue ? ` · ${match.venue}` : ''}
      </p>

      <div className="mt-5">
        {(() => {
          const status = getPredictionStatus(
            match.homeTeam.name,
            match.awayTeam.name,
            match.predictionDeadline,
            match.kickoffAt,
            match.predictionsOpen,
            match.resultPublished
          )
          if (status === 'open') {
            return (
              <Link
                to="/predict"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-grass-500 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-grass-600 shadow-[0_4px_20px_rgba(34,197,94,0.35)]"
              >
                Predict Now
              </Link>
            )
          } else if (status === 'coming-soon') {
            return (
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 py-3 text-[13px] font-semibold text-yellow-500/70 cursor-not-allowed"
              >
                Coming Soon
              </button>
            )
          } else {
            return (
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 py-3 text-[13px] font-semibold text-red-400/60 cursor-not-allowed"
              >
                Prediction Closed
              </button>
            )
          }
        })()}
      </div>
    </motion.div>
  )
}
