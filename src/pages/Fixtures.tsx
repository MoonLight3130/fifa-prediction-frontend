import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineInformationCircle,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
} from 'react-icons/hi'
import { GiTrophyCup } from 'react-icons/gi'
import Flag from '../components/Flag'
import PredictionCountdown from '../components/PredictionCountdown'
import { isFlagCode } from '../lib/flags'
import { filterFixtureGroups } from '../lib/filterFixtures'
import type { Fixture } from '../lib/api/types'
import { fetchFixtureGroups } from '../lib/api/matches'
import { useAsync } from '../hooks/useAsync'
import { getPredictionStatus } from '../lib/matchValidation'
import { ErrorState, LoadingState } from '../components/ui/DataStates'
import heroBg from '../assets/hero-bg.png'
import trophyLogo from '../assets/trophy-logo.png'

function StatusBadge({ status }: { status: Fixture['status'] }) {
  if (status === 'live') {
    return (
      <span className="rounded-md bg-grass-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
        Live
      </span>
    )
  }
  if (status === 'finished') {
    return (
      <span className="rounded-md border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/50">
        Finished
      </span>
    )
  }
  return (
    <span className="rounded-md border border-blue-400/40 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-300">
      Upcoming
    </span>
  )
}

function TeamDisplay({
  team,
  align,
  score,
}: {
  team: Fixture['home']
  align: 'left' | 'right'
  score?: number
}) {
  const hasFlag = team.code && isFlagCode(team.code)

  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3 ${
        align === 'right' ? 'flex-row-reverse justify-start' : 'justify-end'
      }`}
    >
      <span
        className={`truncate text-[13px] font-semibold text-white sm:text-sm ${
          align === 'right' ? 'text-right' : 'text-left'
        }`}
      >
        {team.name}
      </span>
      {score !== undefined && (
        <span className="shrink-0 text-lg font-bold tabular-nums text-white/90 lg:hidden">{score}</span>
      )}
      {hasFlag ? (
        <Flag code={team.code!} size="md" className="shrink-0" />
      ) : (
        <span className="flex h-7 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-[9px] font-bold text-white/30">
          TBD
        </span>
      )}
    </div>
  )
}

function FixtureRow({ fixture }: { fixture: Fixture }) {
  const showScore = fixture.status === 'finished' && fixture.homeScore != null && fixture.awayScore != null

  return (
    <div className="border-b border-white/[0.06] px-4 py-4 last:border-b-0 sm:px-5 sm:py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        {/* Date / time / match code */}
        <div className="flex shrink-0 flex-row gap-4 lg:w-[140px] lg:flex-col lg:gap-2">
          {fixture.matchCode && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-grass-500/80">
              {fixture.matchCode}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-[11px] text-white/50">
            <HiOutlineCalendar className="h-3.5 w-3.5 text-grass-500" />
            {fixture.date}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-white/50">
            <HiOutlineClock className="h-3.5 w-3.5 text-grass-500" />
            {fixture.time}
          </span>
        </div>

        {/* Matchup */}
        <div className="flex flex-1 items-center gap-2 sm:gap-4">
          <TeamDisplay team={fixture.home} align="right" score={showScore ? fixture.homeScore ?? undefined : undefined} />

          <div className="flex shrink-0 flex-col items-center px-1">
            {showScore ? (
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <span className="text-lg font-bold tabular-nums text-white">{fixture.homeScore}</span>
                <span className="text-sm text-white/30">-</span>
                <span className="text-lg font-bold tabular-nums text-white">{fixture.awayScore}</span>
              </div>
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[10px] font-bold text-white/70">
                VS
              </span>
            )}
            {fixture.group && (
              <span className="mt-1 max-w-[72px] truncate text-center text-[9px] text-white/35">
                {fixture.group}
              </span>
            )}
          </div>

          <TeamDisplay team={fixture.away} align="left" score={showScore ? fixture.awayScore ?? undefined : undefined} />
        </div>

        {/* Status */}
        <div className="flex shrink-0 flex-col items-end gap-2 lg:w-[120px]">
          <StatusBadge status={fixture.status} />
          {fixture.status === 'upcoming' && (
            <>
              <PredictionCountdown 
                deadline={fixture.kickoffAt ? new Date(fixture.kickoffAt).toISOString() : null}
                kickoffAt={fixture.kickoffAt}
                homeTeamName={fixture.home.name}
                awayTeamName={fixture.away.name}
                isClosed={!fixture.predictionsOpen}
                className="text-[10px]"
              />
              {(() => {
                const status = getPredictionStatus(
                  fixture.home.name,
                  fixture.away.name,
                  fixture.kickoffAt ? new Date(fixture.kickoffAt).toISOString() : null,
                  fixture.kickoffAt,
                  fixture.predictionsOpen !== false,
                  false
                )
                if (status === 'open') {
                  return (
                    <Link
                      to="/predict"
                      className="mt-1 inline-flex items-center justify-center gap-1 rounded-md bg-grass-500 px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-grass-600 shadow-[0_2px_10px_rgba(34,197,94,0.2)]"
                    >
                      Predict
                    </Link>
                  )
                } else if (status === 'coming-soon') {
                  return (
                    <span className="mt-1 inline-flex items-center justify-center rounded-md bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 text-[11px] font-semibold text-yellow-500/70">
                      Coming Soon
                    </span>
                  )
                } else {
                  return (
                    <span className="mt-1 inline-flex items-center justify-center rounded-md bg-red-500/10 border border-red-500/20 px-3 py-1 text-[11px] font-semibold text-red-400/60">
                      Closed
                    </span>
                  )
                }
              })()}
            </>
          )}
        </div>
      </div>

      {fixture.venue && (
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/40 lg:pl-[164px]">
          <HiOutlineLocationMarker className="h-3.5 w-3.5 shrink-0 text-grass-500" />
          {fixture.venue}
        </p>
      )}
    </div>
  )
}

export default function Fixtures() {
  const { data: groupsData, loading, error } = useAsync(fetchFixtureGroups, [])
  const groups = groupsData ?? []

  const visibleGroups = useMemo(
    () => filterFixtureGroups(groups, 'all', 'all', 'all'),
    [groups],
  )

  return (
    <div className="relative min-h-screen bg-navy-950 pt-[72px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img src={heroBg} alt="" className="h-full w-full object-cover opacity-[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/80 to-navy-950" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Main content */}
        <main>
            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1628]/80">
              <img
                src={heroBg}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/40" />
              <div className="relative flex items-center justify-between gap-4 px-6 py-8 sm:px-8 sm:py-10">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grass-500">
                    FIFA World Cup 2026
                  </p>
                  <h1 className="mt-1 text-2xl font-bold uppercase tracking-wide text-white sm:text-[1.75rem]">
                    Fixtures
                  </h1>
                  <p className="mt-2 text-[13px] text-white/50">
                    Never miss a match. Predict and earn points!
                  </p>
                </div>
                <img
                  src={trophyLogo}
                  alt=""
                  aria-hidden
                  className="hidden h-24 w-auto object-contain opacity-90 drop-shadow-lg sm:block lg:h-28"
                />
              </div>
            </div>

            {/* Fixture sections */}
            <div className="mt-6 space-y-5">
              {loading ? (
                <LoadingState message="Loading fixtures..." />
              ) : error ? (
                <ErrorState message={error} />
              ) : visibleGroups.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 px-6 py-12 text-center">
                  <p className="text-sm text-white/50">No fixtures match your filters.</p>
                </div>
              ) : (
                visibleGroups.map((group) => (
                  <section
                    key={group.stage}
                    className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-4 sm:px-5">
                      <div className="flex items-center gap-2.5">
                        {group.icon === 'trophy' ? (
                          <GiTrophyCup className="h-4 w-4 text-gold-400" />
                        ) : (
                          <HiOutlineUserGroup className="h-4 w-4 text-grass-500" />
                        )}
                        <h2 className="text-[14px] font-semibold text-white">{group.title}</h2>
                      </div>
                      <button
                        type="button"
                        className="text-[11px] font-semibold text-grass-500 hover:text-grass-400"
                      >
                        {group.viewLink}
                      </button>
                    </div>

                    <div>
                      {group.fixtures.map((fixture) => (
                        <FixtureRow key={fixture.id} fixture={fixture} />
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-[12px] text-white/40">
              <HiOutlineInformationCircle className="h-4 w-4" />
              All times are shown in your local timezone
            </p>
          </main>
      </div>
    </div>
  )
}
