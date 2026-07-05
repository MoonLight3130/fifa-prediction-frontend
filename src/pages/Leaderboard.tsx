import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  HiOutlineInformationCircle,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineUserCircle,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
} from 'react-icons/hi'
import { GiTrophyCup } from 'react-icons/gi'
import { useAuth } from '../context/AuthContext'
import MedalBadge, { getMedalType } from '../components/leaderboard/MedalBadge'
import { formatRank, type LeaderboardEntry } from '../lib/api/types'
import { fetchLeaderboard } from '../lib/api/stats'
import { useAsync } from '../hooks/useAsync'
import { ErrorState, LoadingState } from '../components/ui/DataStates'
import heroBg from '../assets/hero-bg.png'

type Tab = 'top10' | 'all'

function SidebarCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

function RankCell({ rank }: { rank: number }) {
  const medal = getMedalType(rank)
  if (medal) return <MedalBadge type={medal} />
  return <span className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-white/70">{rank}</span>
}

/** Mobile card row for each leaderboard entry */
function MobileEntryRow({ entry, isYou }: { entry: LeaderboardEntry; isYou?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
        isYou ? 'border border-grass-500/25 bg-grass-500/5' : 'border border-transparent hover:bg-white/[0.03]'
      }`}
    >
      {/* Rank badge */}
      <div className="shrink-0">
        <RankCell rank={entry.rank} />
      </div>

      {/* Name + roll */}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[13px] font-semibold leading-tight ${isYou ? 'text-grass-400' : 'text-white/90'}`}>
          {entry.name}
          {isYou && <span className="ml-1.5 text-[10px] font-bold text-grass-500 uppercase tracking-wide">(You)</span>}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <span className="text-[11px] text-white/40">{entry.rollNumber}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="shrink-0 text-right">
        <p className="text-[15px] font-bold tabular-nums text-grass-500">{entry.totalPoints} <span className="text-[10px] font-medium text-white/40">pts</span></p>
        <div className="mt-0.5 flex items-center justify-end gap-2">
          <span className="text-[10px] text-white/40">✓{entry.correctWinners}</span>
          <span className="text-[10px] text-white/40">🎯{entry.exactScores}</span>
        </div>
      </div>
    </div>
  )
}

export default function Leaderboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('top10')
  const [searchRoll, setSearchRoll] = useState('')
  const [searchResult, setSearchResult] = useState<LeaderboardEntry | null | 'not-found'>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const { data, loading, error } = useAsync(fetchLeaderboard, [])

  const leaderboardEntries = data?.entries ?? []
  const topPredictor = leaderboardEntries[0]

  const visibleEntries = useMemo(() => {
    return activeTab === 'top10' ? leaderboardEntries.slice(0, 10) : leaderboardEntries
  }, [activeTab, leaderboardEntries])

  const yourEntry = useMemo(() => {
    if (!user) return undefined
    return leaderboardEntries.find((entry) => entry.rollNumber === user.rollNumber.toUpperCase())
  }, [user, leaderboardEntries])

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    const found = leaderboardEntries.find(
      (entry) => entry.rollNumber === searchRoll.trim().toUpperCase(),
    )
    setSearchResult(found ?? 'not-found')
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-navy-950 pt-[72px]">
        <LoadingState message="Loading leaderboard..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-navy-950 pt-[72px]">
        <ErrorState message={error} />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-navy-950 pt-[72px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img src={heroBg} alt="" className="h-full w-full object-cover opacity-[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/80 to-navy-950" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

        {/* Page title */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-[1.65rem]">
            Leaderboard
          </h1>
          <div className="mt-2 h-0.5 w-12 rounded-full bg-grass-500" />
        </div>

        {/* ─── Mobile: Your rank quick-banner ─── */}
        {yourEntry && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-grass-500/20 bg-grass-500/5 px-4 py-3 lg:hidden">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-grass-500">Your Rank</p>
              <p className="mt-0.5 text-xl font-bold text-white">{formatRank(yourEntry.rank)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Points</p>
              <p className="mt-0.5 text-xl font-bold text-grass-500">{yourEntry.totalPoints}</p>
            </div>
          </div>
        )}

        {/* ─── Mobile: Collapsible stats strip ─── */}
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            onClick={() => setShowSidebar((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3.5"
          >
            <div className="flex items-center gap-2">
              <GiTrophyCup className="h-4 w-4 text-gold-400" />
              <span className="text-[13px] font-semibold text-white">
                Top Predictor:{' '}
                <span className="text-grass-400">{topPredictor?.name ?? '—'}</span>
                <span className="ml-2 text-grass-500">{topPredictor?.totalPoints ?? 0} pts</span>
              </span>
            </div>
            {showSidebar
              ? <HiOutlineChevronUp className="h-4 w-4 text-white/50" />
              : <HiOutlineChevronDown className="h-4 w-4 text-white/50" />
            }
          </button>

          {showSidebar && (
            <div className="border-t border-white/[0.08] px-4 pb-4 pt-3">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Exact Score</dt>
                  <dd className="mt-1 text-[12px] text-white/70">Highest points</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Correct Winner</dt>
                  <dd className="mt-1 text-[12px] text-white/70">Second tier</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Last Updated</dt>
                  <dd className="mt-1 text-[12px] text-white/70">
                    {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : '—'}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* ─── Desktop Sidebar ─── */}
          <aside className="hidden flex-col gap-5 lg:flex">
            <SidebarCard>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <GiTrophyCup className="h-4 w-4 text-gold-400" />
                    <span className="text-[13px] font-semibold text-grass-500">Top Predictor</span>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-white">{topPredictor?.name ?? '—'}</p>
                  <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-white/40">
                    Total Points
                  </p>
                  <p className="text-3xl font-bold text-grass-500">{topPredictor?.totalPoints ?? 0}</p>
                </div>
                <MedalBadge type="gold" size="lg" />
              </div>
            </SidebarCard>

            <SidebarCard>
              <div className="flex items-center gap-2">
                <HiOutlineUserCircle className="h-4 w-4 text-grass-500" />
                <span className="text-[13px] font-semibold text-grass-500">Your Rank</span>
              </div>
              {yourEntry ? (
                <>
                  <p className="mt-3 text-2xl font-bold text-white">{formatRank(yourEntry.rank)}</p>
                  <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-white/40">
                    Total Points
                  </p>
                  <p className="text-3xl font-bold text-grass-500">{yourEntry.totalPoints}</p>
                  <p className="mt-4 text-[12px] leading-relaxed text-white/45">
                    Keep predicting and climb the leaderboard!
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm text-white/50">No rank data available yet.</p>
              )}
            </SidebarCard>

            <SidebarCard>
              <div className="flex items-center gap-2">
                <HiOutlineInformationCircle className="h-4 w-4 text-grass-500" />
                <span className="text-[13px] font-semibold text-white">Leaderboard Info</span>
              </div>
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-[13px] font-semibold text-white">Total Points</dt>
                  <dd className="mt-0.5 text-[12px] text-white/45">Overall points earned.</dd>
                </div>
                <div>
                  <dt className="text-[13px] font-semibold text-white">Correct Winners</dt>
                  <dd className="mt-0.5 text-[12px] text-white/45">
                    Number of matches with correct winning team.
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] font-semibold text-white">Exact Scores</dt>
                  <dd className="mt-0.5 text-[12px] text-white/45">
                    Number of matches with exact score predictions.
                  </dd>
                </div>
              </dl>
              <p className="mt-5 border-t border-white/[0.06] pt-4 text-[11px] text-white/35">
                Last Updated:{' '}
                {data?.lastUpdated
                  ? new Date(data.lastUpdated).toLocaleString()
                  : '—'}
              </p>
            </SidebarCard>
          </aside>

          {/* ─── Main content ─── */}
          <main className="min-w-0">
            {/* Tabs */}
            <div className="flex gap-5 border-b border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveTab('top10')}
                className={`relative pb-3 text-[13px] font-semibold transition-colors ${
                  activeTab === 'top10' ? 'text-grass-500' : 'text-white/45 hover:text-white/70'
                }`}
              >
                Top 10
                {activeTab === 'top10' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-grass-500" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`relative pb-3 text-[13px] font-semibold transition-colors ${
                  activeTab === 'all' ? 'text-grass-500' : 'text-white/45 hover:text-white/70'
                }`}
              >
                All Participants
                {activeTab === 'all' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-grass-500" />
                )}
              </button>
            </div>

            {/* ─── Desktop: Table ─── */}
            <div className="mt-5 hidden overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 backdrop-blur-sm sm:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-left">
                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/40">Rank</th>
                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/40">Name</th>
                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/40">Total Points</th>
                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/40">Correct Winners</th>
                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/40">Exact Scores</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEntries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-white/50">
                        No participants on the leaderboard yet. Register and start predicting!
                      </td>
                    </tr>
                  ) : (
                    visibleEntries.map((entry, i) => {
                      const isYou = user?.rollNumber?.toUpperCase() === entry.rollNumber
                      return (
                        <tr
                          key={entry.rollNumber}
                          className={`border-b border-white/[0.05] transition-colors hover:bg-white/[0.03] ${
                            i === visibleEntries.length - 1 ? 'border-b-0' : ''
                          } ${isYou ? 'bg-grass-500/[0.04]' : ''}`}
                        >
                          <td className="px-5 py-3.5">
                            <RankCell rank={entry.rank} />
                          </td>
                          <td className="px-5 py-3.5 text-[14px] font-medium text-white/90">
                            {entry.name}
                            {isYou && (
                              <span className="ml-2 rounded-full bg-grass-500/15 px-1.5 py-0.5 text-[10px] font-bold text-grass-500 uppercase tracking-wide">
                                You
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-[14px] font-semibold text-grass-500">{entry.totalPoints}</td>
                          <td className="px-5 py-3.5 text-[14px] text-white/75">{entry.correctWinners}</td>
                          <td className="px-5 py-3.5 text-[14px] text-white/75">{entry.exactScores}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ─── Mobile: Card list ─── */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 backdrop-blur-sm sm:hidden">
              {/* Mobile column labels */}
              <div className="grid grid-cols-[auto_1fr_auto] border-b border-white/[0.08] px-3 py-2">
                <span className="w-8 text-[10px] font-semibold uppercase tracking-wider text-white/30">#</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Name</span>
                <span className="text-right text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Pts · ✓W · 🎯
                </span>
              </div>

              {visibleEntries.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-white/50">
                  No participants on the leaderboard yet.
                </p>
              ) : (
                <div className="divide-y divide-white/[0.04] px-1 py-1">
                  {visibleEntries.map((entry) => {
                    const isYou = user?.rollNumber?.toUpperCase() === entry.rollNumber
                    return (
                      <MobileEntryRow key={entry.rollNumber} entry={entry} isYou={isYou} />
                    )
                  })}
                </div>
              )}
            </div>

            <p className="mt-4 flex items-center gap-2 text-[12px] text-white/40">
              <HiOutlineInformationCircle className="h-4 w-4 shrink-0" />
              Leaderboard updates in real-time as predictions are submitted.
            </p>
          </main>
        </div>

        {/* ─── Find Your Rank ─── */}
        <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-4 backdrop-blur-sm sm:mt-8 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-grass-500/15">
                <HiOutlineUser className="h-4 w-4 text-grass-500" />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-white">Find Your Rank</h2>
                <p className="mt-0.5 text-[12px] text-white/45">
                  Enter your roll number to see your current rank and stats.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto"
            >
              <input
                type="text"
                value={searchRoll}
                onChange={(e) => setSearchRoll(e.target.value)}
                placeholder="Enter Roll Number"
                className="w-full rounded-lg border border-white/10 bg-[#050d1a]/80 px-4 py-2.5 text-[13px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-grass-500/50 focus:ring-1 focus:ring-grass-500/30 sm:w-60"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-grass-500 px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_2px_12px_rgba(34,197,94,0.25)] transition-colors hover:bg-grass-600"
              >
                <HiOutlineSearch className="h-4 w-4" />
                Search
              </button>
            </form>
          </div>

          {searchResult && searchResult !== 'not-found' && (
            <div className="mt-4 rounded-xl border border-grass-500/20 bg-grass-500/5 px-4 py-3">
              <p className="text-[13px] text-white/80">
                <span className="font-semibold text-white">{searchResult.name}</span> — Rank{' '}
                <span className="font-semibold text-grass-500">{formatRank(searchResult.rank)}</span>
                , {searchResult.totalPoints} pts ({searchResult.correctWinners} correct winners,{' '}
                {searchResult.exactScores} exact scores)
              </p>
            </div>
          )}

          {searchResult === 'not-found' && (
            <p className="mt-4 text-[13px] text-red-300">
              No participant found with that roll number.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
