import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineArrowRight,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlineStar,
  HiOutlineTrendingUp,
  HiOutlineUserCircle,
} from 'react-icons/hi'
import Flag from '../components/Flag'
import { useAuth } from '../context/AuthContext'
import { formatRank } from '../lib/api/types'
import { fetchMatchResults } from '../lib/api/matches'
import { fetchMyPredictions } from '../lib/api/predictions'
import { fetchNextMatch } from '../lib/api/matches'
import { useAsync } from '../hooks/useAsync'
import type { Prediction, MatchResult } from '../lib/api/types'
import type { FlagCode } from '../lib/flags'
import heroBg from '../assets/hero-bg.png'
import { getPredictionStatus } from '../lib/matchValidation'

function SidebarCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

interface MatchInfo {
  label: string
  homeCode?: FlagCode
  awayCode?: FlagCode
}

function buildMatchLookup(results: MatchResult[], nextMatch?: { id: string; homeTeam: { name: string; code?: string }; awayTeam: { name: string; code?: string } } | null): Record<string, MatchInfo> {
  const lookup: Record<string, MatchInfo> = {}

  for (const r of results) {
    lookup[r.matchId] = {
      label: `${r.home.name} vs ${r.away.name}`,
      homeCode: r.home.code as FlagCode | undefined,
      awayCode: r.away.code as FlagCode | undefined,
    }
  }

  if (nextMatch) {
    lookup[nextMatch.id] = {
      label: `${nextMatch.homeTeam.name} vs ${nextMatch.awayTeam.name}`,
      homeCode: nextMatch.homeTeam.code as FlagCode | undefined,
      awayCode: nextMatch.awayTeam.code as FlagCode | undefined,
    }
  }

  return lookup
}

function PredictionRow({
  prediction,
  matchInfo,
}: {
  prediction: Prediction
  matchInfo?: MatchInfo
}) {
  const outcome =
    prediction.pointsEarned > 0 || prediction.pointsLabel
      ? { points: prediction.pointsEarned, label: prediction.pointsLabel || 'No Points' }
      : null

  return (
    <div className="flex flex-col gap-3 border-b border-white/[0.06] px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        {matchInfo?.homeCode && matchInfo?.awayCode ? (
          <div className="flex shrink-0 -space-x-1">
            <Flag code={matchInfo.homeCode} size="sm" className="ring-2 ring-[#0a1628]" />
            <Flag code={matchInfo.awayCode} size="sm" className="ring-2 ring-[#0a1628]" />
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-white">
            {matchInfo?.label ?? prediction.matchId}
          </p>
          <p className="mt-0.5 text-[11px] text-white/40">
            Predicted {prediction.homeScore}-{prediction.awayScore} ·{' '}
            {formatDate(prediction.submittedAt)}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {outcome && prediction.pointsLabel ? (
          outcome.points > 0 ? (
            <span className="rounded-md border border-grass-500/30 bg-grass-500/10 px-2.5 py-1 text-[11px] font-semibold text-grass-400">
              +{outcome.points} pts
            </span>
          ) : (
            <span className="rounded-md border border-white/10 px-2.5 py-1 text-[11px] text-white/35">
              0 pts
            </span>
          )
        ) : (
          <span className="rounded-md border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-300">
            Pending
          </span>
        )}
      </div>
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Dashboard() {
  const { user } = useAuth()
  const { data: matchResultsData } = useAsync(fetchMatchResults, [])
  const { data: nextMatch } = useAsync(fetchNextMatch, [])
  const { data: predictionsData } = useAsync(
    () => (user ? fetchMyPredictions() : Promise.resolve([])),
    [user?.rollNumber],
  )
  const matchResults = matchResultsData ?? []
  const predictions = predictionsData ?? []

  const matchLookup = useMemo(
    () => buildMatchLookup(matchResults, nextMatch),
    [matchResults, nextMatch],
  )

  const stats = useMemo(() => {
    const earnedPoints = predictions.reduce((sum, p) => sum + (p.pointsEarned ?? 0), 0)
    const correctWinners = predictions.filter((p) => p.pointsEarned >= 10).length
    const exactScores = predictions.filter((p) => p.pointsLabel === 'Exact Score').length

    return {
      earnedPoints,
      correctWinners,
      exactScores,
      predictionsCount: predictions.length,
      rank: user?.rank,
      totalPoints: user?.totalPoints ?? earnedPoints,
    }
  }, [predictions, user])

  const recentPredictions = [...predictions]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5)

  const hasPredictedCurrent = nextMatch
    ? predictions.some((p) => p.matchId === nextMatch.id)
    : false

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
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <HiOutlineUserCircle className="h-10 w-10 text-white/30" />
                </div>
                <p className="mt-3 text-[15px] font-semibold text-white">{user?.fullName}</p>
                <p className="text-[12px] text-grass-500">{user?.rollNumber}</p>
                <p className="mt-1 text-[11px] text-white/40">{user?.department}</p>
                <p className="text-[11px] text-white/40">{user?.year}</p>
              </div>
            </SidebarCard>

            <SidebarCard>
              <h3 className="text-[13px] font-semibold text-white">Quick Actions</h3>
              <div className="mt-3 flex flex-col gap-2">
                {[
                  { to: '/predict', label: 'Make Prediction', icon: HiOutlineClipboardList },
                  { to: '/fixtures', label: 'View Fixtures', icon: HiOutlineCalendar },
                  { to: '/leaderboard', label: 'Leaderboard', icon: HiOutlineTrendingUp },
                  { to: '/results', label: 'Match Results', icon: HiOutlineCheckCircle },
                ].map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[12px] font-medium text-white/70 transition-colors hover:border-grass-500/30 hover:bg-grass-500/5 hover:text-grass-500"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </SidebarCard>
          </aside>

          <main>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1628]/80">
              <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/50" />
              <div className="relative px-6 py-8 sm:px-8 sm:py-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grass-500">
                  Welcome back
                </p>
                <h1 className="mt-1 text-2xl font-bold text-white sm:text-[1.75rem]">
                  My Dashboard
                </h1>
                <p className="mt-2 text-[13px] text-white/50">
                  Track your predictions, points, and league progress.
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                {
                  label: 'Your Rank',
                  value: stats.rank ? formatRank(stats.rank) : '—',
                  icon: HiOutlineTrendingUp,
                  accent: true,
                },
                {
                  label: 'Total Points',
                  value: stats.totalPoints,
                  icon: HiOutlineStar,
                  accent: true,
                },
                {
                  label: 'Predictions',
                  value: stats.predictionsCount,
                  icon: HiOutlineClipboardList,
                },
                {
                  label: 'Exact Scores',
                  value: stats.exactScores,
                  icon: HiOutlineChartBar,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 p-4 backdrop-blur-sm sm:p-5"
                >
                  <stat.icon
                    className={`h-5 w-5 ${stat.accent ? 'text-grass-500' : 'text-white/40'}`}
                  />
                  <p
                    className={`mt-3 text-2xl font-bold ${stat.accent ? 'text-grass-500' : 'text-white'}`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Next match CTA */}
            {nextMatch && (
              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-grass-500/20 bg-grass-500/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-1">
                    <Flag code={nextMatch.homeTeam.code as FlagCode} size="md" />
                    <Flag code={nextMatch.awayTeam.code as FlagCode} size="md" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">
                      Next: {nextMatch.homeTeam.name} vs {nextMatch.awayTeam.name}
                    </p>
                    <p className="text-[11px] text-white/45">
                      {nextMatch.stageLabel} · {nextMatch.date}
                    </p>
                  </div>
                </div>
                {(() => {
                  const status = getPredictionStatus(
                    nextMatch.homeTeam.name,
                    nextMatch.awayTeam.name,
                    nextMatch.predictionDeadline,
                    nextMatch.kickoffAt,
                    nextMatch.predictionsOpen,
                    nextMatch.resultPublished
                  )
                  if (status === 'open') {
                    return (
                      <Link
                        to="/predict"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-grass-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-grass-600 shadow-[0_4px_20px_rgba(34,197,94,0.35)]"
                      >
                        {hasPredictedCurrent ? 'Edit Prediction' : 'Predict Now'}
                        <HiOutlineArrowRight className="h-4 w-4" />
                      </Link>
                    )
                  } else if (status === 'coming-soon') {
                    return (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-5 py-2.5 text-[13px] font-semibold text-yellow-500/70 cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    )
                  } else {
                    return (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-5 py-2.5 text-[13px] font-semibold text-red-400/60 cursor-not-allowed"
                      >
                        Prediction Closed
                      </button>
                    )
                  }
                })()}
              </div>
            )}

            {/* Recent predictions */}
            <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-4 sm:px-5">
                <h2 className="text-[14px] font-semibold text-white">Recent Predictions</h2>
                <Link
                  to="/results"
                  className="text-[11px] font-semibold text-grass-500 hover:text-grass-400"
                >
                  View Results →
                </Link>
              </div>

              {recentPredictions.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm text-white/50">You haven&apos;t made any predictions yet.</p>
                  <Link
                    to="/predict"
                    className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold text-grass-500 hover:text-grass-400"
                  >
                    Make your first prediction
                    <HiOutlineArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                recentPredictions.map((prediction) => (
                  <PredictionRow
                    key={`${prediction.matchId}-${prediction.submittedAt}`}
                    prediction={prediction}
                    matchInfo={matchLookup[prediction.matchId]}
                  />
                ))
              )}
            </section>

            {/* Performance summary */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 p-5">
                <h3 className="text-[13px] font-semibold text-white">Performance</h3>
                <dl className="mt-4 space-y-3">
                  <div className="flex justify-between text-[13px]">
                    <dt className="text-white/50">Points from results</dt>
                    <dd className="font-semibold text-grass-500">{stats.earnedPoints}</dd>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <dt className="text-white/50">Correct winners</dt>
                    <dd className="font-semibold text-white">{stats.correctWinners}</dd>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <dt className="text-white/50">Exact scores</dt>
                    <dd className="font-semibold text-white">{stats.exactScores}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 p-5">
                <h3 className="text-[13px] font-semibold text-white">League Standing</h3>
                {user?.rank ? (
                  <dl className="mt-4 space-y-3">
                    <div className="flex justify-between text-[13px]">
                      <dt className="text-white/50">Rank</dt>
                      <dd className="font-semibold text-white">{formatRank(user.rank)}</dd>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <dt className="text-white/50">Leaderboard points</dt>
                      <dd className="font-semibold text-grass-500">{user.totalPoints ?? stats.totalPoints}</dd>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <dt className="text-white/50">Correct winners (season)</dt>
                      <dd className="font-semibold text-white">{user.correctWinnerPredictions ?? stats.correctWinners}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="mt-4 text-[12px] text-white/45">
                    Play more matches to appear on the leaderboard.
                  </p>
                )}
                <Link
                  to="/leaderboard"
                  className="mt-4 inline-block text-[11px] font-semibold text-grass-500 hover:text-grass-400"
                >
                  View full leaderboard →
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
