import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineInformationCircle,
  HiOutlineLocationMarker,
  HiOutlineStar,
  HiOutlineXCircle,
} from 'react-icons/hi'
import Flag from '../components/Flag'
import { useAuth } from '../context/AuthContext'
import { resultFilters, type ResultFilterId } from '../lib/filterFixtures'
import type { MatchResult } from '../lib/api/types'
import { fetchMatchResults } from '../lib/api/matches'
import { fetchMyPredictions } from '../lib/api/predictions'
import { useAsync } from '../hooks/useAsync'
import { ErrorState, LoadingState } from '../components/ui/DataStates'
import heroBg from '../assets/hero-bg.png'

function SidebarCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

function StatItem({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  accent?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
        <Icon className={`h-4 w-4 ${accent ? 'text-grass-500' : 'text-white/50'}`} />
      </div>
      <div>
        <p className="text-[11px] text-white/40">{label}</p>
        <p className={`text-lg font-bold ${accent ? 'text-grass-500' : 'text-white'}`}>{value}</p>
      </div>
    </div>
  )
}

function PointsBadge({ points, label }: { points: number; label: string }) {
  if (points === 0) {
    return (
      <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-white/35">
        {label}
      </span>
    )
  }
  return (
    <span className="rounded-md border border-grass-500/30 bg-grass-500/10 px-2.5 py-1 text-[10px] font-semibold text-grass-400">
      +{points} pts · {label}
    </span>
  )
}

import type { Prediction } from '../lib/api/types'

function ResultCard({
  result,
  prediction,
}: {
  result: MatchResult
  prediction?: Prediction
}) {
  const outcome = prediction
    ? { points: prediction.pointsEarned, label: prediction.pointsLabel || 'No Points' }
    : null

  return (
    <article className="border-b border-white/[0.06] px-4 py-5 last:border-b-0 sm:px-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/45">
          <span className="rounded-md bg-white/[0.05] px-2 py-0.5 font-medium text-white/60">
            {result.stageLabel}
          </span>
          {result.group && <span>{result.group}</span>}
          <span className="flex items-center gap-1">
            <HiOutlineCalendar className="h-3 w-3 text-grass-500" />
            {result.date}
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineClock className="h-3 w-3 text-grass-500" />
            {result.time}
          </span>
        </div>
        {outcome && <PointsBadge points={outcome.points} label={outcome.label} />}
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2.5 sm:gap-3">
          <span className="truncate text-right text-sm font-semibold text-white">{result.home.name}</span>
          <Flag code={result.home.code ?? ''} size="md" />
        </div>

        <div className="flex shrink-0 flex-col items-center">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2">
            <span className="text-xl font-bold tabular-nums text-white">{result.homeScore}</span>
            <span className="text-sm text-white/30">-</span>
            <span className="text-xl font-bold tabular-nums text-white">{result.awayScore}</span>
          </div>
          <span className="mt-1 text-[9px] font-medium uppercase tracking-wider text-white/30">
            Full Time
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          <Flag code={result.away.code ?? ''} size="md" />
          <span className="truncate text-sm font-semibold text-white">{result.away.name}</span>
        </div>
      </div>

      {prediction ? (
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/35">
            Your Prediction
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/70">
            <span>
              Score:{' '}
              <span className="font-semibold text-white">
                {prediction.homeScore} - {prediction.awayScore}
              </span>
            </span>
            <span>
              Winner:{' '}
              <span className="font-semibold text-white">
                {prediction.winner === 'home'
                  ? result.home.name
                  : prediction.winner === 'away'
                    ? result.away.name
                    : 'Draw'}
              </span>
            </span>
            {outcome && outcome.points > 0 ? (
              <span className="flex items-center gap-1 text-grass-500">
                <HiOutlineCheckCircle className="h-4 w-4" />
                Earned {outcome.points} points
              </span>
            ) : (
              <span className="flex items-center gap-1 text-white/40">
                <HiOutlineXCircle className="h-4 w-4" />
                No points earned
              </span>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-[12px] text-white/35">
          No prediction submitted.{' '}
          <Link to="/predict" className="text-grass-500 hover:text-grass-400">
            Predict upcoming matches →
          </Link>
        </p>
      )}

      {result.venue && (
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/35">
          <HiOutlineLocationMarker className="h-3.5 w-3.5 text-grass-500" />
          {result.venue}
        </p>
      )}
    </article>
  )
}

export default function Results() {
  const { user } = useAuth()
  const [filter, setFilter] = useState<ResultFilterId>('all')
  const { data: matchResultsData, loading: resultsLoading, error: resultsError } = useAsync(
    fetchMatchResults,
    [],
  )
  const { data: userPredictionsData, loading: predictionsLoading } = useAsync(
    () => (user ? fetchMyPredictions() : Promise.resolve([])),
    [user?.rollNumber],
  )
  const matchResults = matchResultsData ?? []
  const userPredictions = userPredictionsData ?? []

  const stats = useMemo(() => {
    let totalPoints = 0
    let correctWinners = 0
    let exactScores = 0
    let predictedCount = 0

    for (const result of matchResults) {
      const prediction = userPredictions.find((p) => p.matchId === result.matchId)
      if (!prediction) continue
      predictedCount++
      totalPoints += prediction.pointsEarned
      if (prediction.pointsLabel === 'Exact Score') exactScores++
      if (prediction.pointsEarned >= 10) correctWinners++
    }

    return { totalPoints, correctWinners, exactScores, predictedCount }
  }, [userPredictions, matchResults])

  const visibleResults = useMemo(() => {
    return matchResults.filter((result) => {
      if (filter === 'group') return result.stage === 'group'
      if (filter === 'knockout') return result.stage === 'knockout'
      return true
    })
  }, [filter, userPredictions, matchResults])

  const predictionMap = useMemo(
    () => new Map(userPredictions.map((prediction) => [prediction.matchId, prediction])),
    [userPredictions],
  )

  const loading = resultsLoading || predictionsLoading

  return (
    <div className="relative min-h-screen bg-navy-950 pt-[72px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img src={heroBg} alt="" className="h-full w-full object-cover opacity-[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/80 to-navy-950" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
          <aside className="flex flex-col gap-4">
            <SidebarCard>
              <h3 className="text-[13px] font-semibold text-white">Your Results</h3>
              <div className="mt-4 space-y-4">
                <StatItem icon={HiOutlineStar} label="Points Earned" value={stats.totalPoints} accent />
                <StatItem icon={HiOutlineCheckCircle} label="Correct Winners" value={stats.correctWinners} />
                <StatItem icon={HiOutlineChartBar} label="Exact Scores" value={stats.exactScores} />
                <StatItem
                  icon={HiOutlineInformationCircle}
                  label="Matches Predicted"
                  value={`${stats.predictedCount}/${matchResults.length}`}
                />
              </div>
            </SidebarCard>

            <SidebarCard>
              <h3 className="text-[13px] font-semibold text-white">Filter</h3>
              <ul className="mt-3 space-y-0.5">
                {resultFilters.map((option) => {
                  const selected = filter === option.id
                  return (
                    <li key={option.id}>
                      <button
                        type="button"
                        onClick={() => setFilter(option.id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] transition-colors ${
                          selected
                            ? 'bg-grass-500/10 font-medium text-grass-500'
                            : 'text-white/55 hover:bg-white/[0.04] hover:text-white/80'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full border ${
                            selected ? 'border-grass-500 bg-grass-500' : 'border-white/25'
                          }`}
                        />
                        {option.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </SidebarCard>

            <SidebarCard>
              <p className="text-[12px] font-semibold text-gold-400">Scoring Reminder</p>
              <ul className="mt-2 space-y-1.5 text-[11px] text-white/45">
                <li>Exact Score — 20 pts</li>
                <li>Correct Winner — 10 pts</li>
                <li>Correct Goal Difference — 5 pts</li>
              </ul>
              <Link
                to="/rules"
                className="mt-3 inline-block text-[11px] font-semibold text-grass-500 hover:text-grass-400"
              >
                View full rules →
              </Link>
            </SidebarCard>
          </aside>

          <main>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1628]/80">
              <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/50" />
              <div className="relative px-6 py-8 sm:px-8 sm:py-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grass-500">
                  Match Outcomes
                </p>
                <h1 className="mt-1 text-2xl font-bold uppercase tracking-wide text-white sm:text-[1.75rem]">
                  Results
                </h1>
                <p className="mt-2 max-w-lg text-[13px] text-white/50">
                  Review final scores and see how your predictions performed.
                </p>
              </div>
            </div>

            <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-4 sm:px-5">
                <h2 className="text-[14px] font-semibold text-white">
                  Completed Matches
                  <span className="ml-2 text-[12px] font-normal text-white/40">
                    ({visibleResults.length})
                  </span>
                </h2>
                <Link
                  to="/fixtures"
                  className="text-[11px] font-semibold text-grass-500 hover:text-grass-400"
                >
                  View Fixtures →
                </Link>
              </div>

              {loading ? (
                <LoadingState message="Loading results..." />
              ) : resultsError ? (
                <ErrorState message={resultsError} />
              ) : visibleResults.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm text-white/50">No results match this filter.</p>
                </div>
              ) : (
                visibleResults.map((result) => (
                  <ResultCard
                    key={result.matchId}
                    result={result}
                    prediction={predictionMap.get(result.matchId)}
                  />
                ))
              )}
            </section>

            <p className="mt-6 flex items-center justify-center gap-2 text-[12px] text-white/40">
              <HiOutlineInformationCircle className="h-4 w-4" />
              Results update automatically after each match ends
            </p>
          </main>
        </div>
      </div>
    </div>
  )
}
