import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineLockClosed,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineUserCircle,
} from 'react-icons/hi'
import { GiSoccerBall } from 'react-icons/gi'
import { FaHandshake } from 'react-icons/fa6'
import { useAuth } from '../context/AuthContext'
import Flag from '../components/Flag'
import PredictionCountdown from '../components/PredictionCountdown'
import { getPredictionStatus as getMatchPredictionStatus } from '../lib/matchValidation'
import { getFlagAbbreviation, isFlagCode, type FlagCode } from '../lib/flags'
import { fetchOpenMatches, fetchPredictionForMatch, submitPrediction } from '../lib/api/predictions'
import { fetchSettings } from '../lib/api/settings'
import { useAsync } from '../hooks/useAsync'
import { ErrorState, LoadingState } from '../components/ui/DataStates'
import TrophyLogo from '../components/TrophyLogo'
import heroBg from '../assets/hero-bg.png'

function SidebarCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

function ScoreInput({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}) {
  function adjust(delta: number) {
    onChange(Math.max(0, Math.min(20, value + delta)))
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-[12px] font-medium text-white/60">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => adjust(-1)}
          disabled={disabled}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Decrease ${label} score`}
        >
          <HiOutlineMinus className="h-4 w-4" />
        </button>
        <input
          type="number"
          min={0}
          max={20}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}
          className="w-16 rounded-lg border border-white/15 bg-[#050d1a]/80 py-2.5 text-center text-xl font-bold text-white outline-none focus:border-grass-500/50 focus:ring-1 focus:ring-grass-500/30 disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => adjust(1)}
          disabled={disabled}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Increase ${label} score`}
        >
          <HiOutlinePlus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function DetailInput({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-white/70">{label}</label>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`rounded-lg border border-white/10 bg-[#050d1a]/80 px-4 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-grass-500/50 focus:ring-1 focus:ring-grass-500/30 ${readOnly ? 'cursor-default text-white/70' : ''}`}
      />
    </div>
  )
}

type WinnerChoice = 'home' | 'draw' | 'away'

export default function Predict() {
  const { user } = useAuth()
  const { data: openMatchesData, loading, error: loadError, refresh } = useAsync(fetchOpenMatches, [])
  const openMatches = openMatchesData ?? []
  const { data: settings } = useAsync(fetchSettings, [])
  const [selectedMatchId, setSelectedMatchId] = useState<string>('')
  const [winner, setWinner] = useState<WinnerChoice>('home')
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [fullName, setFullName] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [existingPredictionId, setExistingPredictionId] = useState<string | null>(null)

  const selectedMatch = openMatches.find((match) => match.id === selectedMatchId) ?? openMatches[0]
  
  const predictionStatus = selectedMatch
    ? getMatchPredictionStatus(
        selectedMatch.homeTeam.name,
        selectedMatch.awayTeam.name,
        selectedMatch.predictionDeadline,
        selectedMatch.kickoffAt,
        selectedMatch.predictionsOpen,
        selectedMatch.resultPublished
      )
    : 'closed'
    
  const isPredictionClosed = predictionStatus === 'closed'
  const isComingSoon = predictionStatus === 'coming-soon'
  const isFormDisabled = isPredictionClosed || isComingSoon

  useEffect(() => {
    if (!selectedMatchId && openMatches[0]) {
      setSelectedMatchId(openMatches[0].id)
    }
  }, [openMatches, selectedMatchId])

  useEffect(() => {
    if (!user) return
    setFullName(user.fullName)
    setRollNumber(user.rollNumber)
    setDepartment(user.department)
    setYear(user.year)
  }, [user])

  useEffect(() => {
    if (!user || !selectedMatch) return

    fetchPredictionForMatch(selectedMatch.id)
      .then((existing) => {
        if (!existing) {
          setSubmitted(false)
          setWinner('home')
          setHomeScore(0)
          setAwayScore(0)
          setExistingPredictionId(null)
          return
        }
        setWinner(existing.winner)
        setHomeScore(existing.homeScore)
        setAwayScore(existing.awayScore)
        setSubmitted(true)
        setExistingPredictionId(existing.id)
      })
      .catch(() => {
        setSubmitted(false)
        setExistingPredictionId(null)
      })
  }, [user, selectedMatch?.id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError('')

    if (!user || !selectedMatch) return

    setSubmitting(true)
    try {
      await submitPrediction({
        matchId: selectedMatch.id,
        winner,
        homeScore,
        awayScore,
        id: existingPredictionId || undefined,
      })
      setSubmitted(true)
      refresh()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit prediction.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 pt-[72px]">
        <LoadingState message="Loading open matches..." />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-navy-950 px-6 pt-[96px]">
        <ErrorState message={loadError} />
      </div>
    )
  }

  if (!selectedMatch) {
    return (
      <div className="min-h-screen bg-navy-950 px-6 pt-[96px]">
        <ErrorState message="No matches are open for predictions right now." />
      </div>
    )
  }

  const homeCode = isFlagCode(selectedMatch.homeTeam.code ?? '') ? (selectedMatch.homeTeam.code as FlagCode) : undefined
  const awayCode = isFlagCode(selectedMatch.awayTeam.code ?? '') ? (selectedMatch.awayTeam.code as FlagCode) : undefined

  const winnerOptions: { id: WinnerChoice; label: string; content: ReactNode }[] = [
    {
      id: 'home',
      label: selectedMatch.homeTeam.name,
      content: homeCode ? <Flag code={homeCode} size="md" /> : <GiSoccerBall className="h-8 w-8 text-white/50" />,
    },
    {
      id: 'draw',
      label: 'Draw',
      content: <FaHandshake className="h-8 w-8 text-white/50" />,
    },
    {
      id: 'away',
      label: selectedMatch.awayTeam.name,
      content: awayCode ? <Flag code={awayCode} size="md" /> : <GiSoccerBall className="h-8 w-8 text-white/50" />,
    },
  ]

  return (
    <div className="relative min-h-screen bg-navy-950 pt-[72px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img src={heroBg} alt="" className="h-full w-full object-cover opacity-[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/80 to-navy-950" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Sidebar */}
          <aside className="flex flex-col gap-5">
            <SidebarCard>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <HiOutlineUserCircle className="h-10 w-10 text-white/30" />
                </div>
                <p className="mt-4 text-[15px] font-semibold text-white">
                  Hello, {user?.fullName.split(' ')[0] ?? 'Player'}!
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-white/45">
                  {submitted
                    ? 'Your prediction is saved. You can update it until the deadline.'
                    : 'Make your prediction and earn points for this match.'}
                </p>
              </div>
            </SidebarCard>

            <SidebarCard>
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-white">Upcoming Matches</h3>
                <Link to="/fixtures" className="text-[11px] font-semibold text-grass-500 hover:text-grass-400">
                  View All
                </Link>
              </div>
              <ul className="mt-4 space-y-3">
                {openMatches.map((match) => {
                  const matchHome = isFlagCode(match.homeTeam.code ?? '') ? (match.homeTeam.code as FlagCode) : undefined
                  const matchAway = isFlagCode(match.awayTeam.code ?? '') ? (match.awayTeam.code as FlagCode) : undefined
                  const mStatus = getMatchPredictionStatus(
                    match.homeTeam.name,
                    match.awayTeam.name,
                    match.predictionDeadline,
                    match.kickoffAt,
                    match.predictionsOpen,
                    match.resultPublished
                  )
                  const dotColor = mStatus === 'open' ? 'bg-grass-500' : mStatus === 'coming-soon' ? 'bg-yellow-500' : 'bg-red-500'
                  const statusLabel = mStatus === 'open' ? 'Open' : mStatus === 'coming-soon' ? 'Soon' : 'Closed'
                  return (
                  <li
                    key={match.id}
                    className={`cursor-pointer rounded-xl border px-3 py-2.5 transition-colors ${
                      match.id === selectedMatch.id
                        ? 'border-grass-500/30 bg-grass-500/5'
                        : 'border-white/[0.06] bg-white/[0.02]'
                    }`}
                    onClick={() => setSelectedMatchId(match.id)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {matchHome ? <Flag code={matchHome} size="sm" /> : null}
                        <span className="text-[11px] font-bold text-white/80">
                          {matchHome ? getFlagAbbreviation(matchHome) : match.homeTeam.name.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-white/35">vs</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-white/80">
                          {matchAway ? getFlagAbbreviation(matchAway) : match.awayTeam.name.slice(0, 3).toUpperCase()}
                        </span>
                        {matchAway ? <Flag code={matchAway} size="sm" /> : null}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-white/40">
                      <span className="flex items-center gap-1">
                        <HiOutlineCalendar className="h-3 w-3" />
                        {match.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                        <span className="text-[9px] font-semibold uppercase">{statusLabel}</span>
                      </span>
                    </div>
                  </li>
                )})}
              </ul>
            </SidebarCard>

            <SidebarCard className="overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-gold-400">Climb the Leaderboard</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
                    Make accurate predictions and win exciting rewards!
                  </p>
                  <Link
                    to="/leaderboard"
                    className="mt-3 inline-block text-[11px] font-semibold text-grass-500 hover:text-grass-400"
                  >
                    View Leaderboard →
                  </Link>
                </div>
                <TrophyLogo className="h-16 w-auto shrink-0 opacity-90" />
              </div>
            </SidebarCard>
          </aside>

          {/* Main prediction form */}
          <main>
            <Link
              to="/fixtures"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/50 transition-colors hover:text-grass-500"
            >
              <HiOutlineArrowLeft className="h-4 w-4" />
              Back to Fixtures
            </Link>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-[1.65rem]">
                  Predict Match
                </h1>
                <p className="mt-1 text-[13px] font-semibold text-grass-500">{selectedMatch.stageLabel}</p>
              </div>

              <PredictionCountdown 
                deadline={selectedMatch.predictionDeadline} 
                kickoffAt={selectedMatch.kickoffAt} 
                isClosed={!selectedMatch.predictionsOpen}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 p-6 backdrop-blur-sm sm:p-8">
              <div className="flex items-center justify-center gap-6 sm:gap-10">
                <div className="flex flex-col items-center gap-2 text-center">
                  {homeCode ? <Flag code={homeCode} size="lg" /> : null}
                  <span className="text-[13px] font-bold text-white max-w-[100px] sm:max-w-none text-balance">{selectedMatch.homeTeam.name}</span>
                </div>
                <span className="text-2xl font-bold text-white/80">VS</span>
                <div className="flex flex-col items-center gap-2 text-center">
                  {awayCode ? <Flag code={awayCode} size="lg" /> : null}
                  <span className="text-[13px] font-bold text-white max-w-[100px] sm:max-w-none text-balance">{selectedMatch.awayTeam.name}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] text-white/45">
                <span className="flex items-center gap-1.5">
                  <HiOutlineCalendar className="h-3.5 w-3.5 text-grass-500" />
                  {selectedMatch.date}
                </span>
                <span className="hidden text-white/20 sm:inline">|</span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineClock className="h-3.5 w-3.5 text-grass-500" />
                  {selectedMatch.time}
                </span>
                {selectedMatch.venue && (
                  <>
                    <span className="hidden text-white/20 sm:inline">|</span>
                    <span className="flex items-center gap-1.5">
                      <HiOutlineLocationMarker className="h-3.5 w-3.5 text-grass-500" />
                      {selectedMatch.venue}
                    </span>
                  </>
                )}
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                {isComingSoon && (
                  <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-center">
                    <p className="text-[13px] font-semibold text-yellow-300">
                      This match is not yet finalized.
                    </p>
                    <p className="mt-1 text-[11px] text-yellow-300/70">
                      Predictions will open once both teams are confirmed.
                    </p>
                  </div>
                )}

                {isPredictionClosed && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center">
                    <p className="text-[13px] font-semibold text-red-300">
                      Predictions are closed for this match
                    </p>
                    <p className="mt-1 text-[11px] text-red-300/70">
                      The prediction deadline has passed. Your existing prediction is read-only.
                    </p>
                  </div>
                )}

                {/* Step 1 */}
                <section>
                  <h2 className="text-[15px] font-semibold text-white">
                    1. Who will win?
                  </h2>
                  <p className="mt-1 text-[12px] text-white/45">
                    Select the winning team or draw
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {winnerOptions.map((option) => {
                      const selected = winner === option.id
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => !isFormDisabled && setWinner(option.id)}
                          disabled={isFormDisabled}
                          className={`relative flex flex-col items-center gap-2 rounded-xl border px-3 py-4 transition-all ${
                            selected
                              ? 'border-grass-500 bg-grass-500/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                          } ${isFormDisabled ? 'cursor-not-allowed opacity-60' : ''}`}
                        >
                          {selected && (
                            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-grass-500">
                              <HiOutlineCheck className="h-3 w-3 text-white" />
                            </span>
                          )}
                          {option.content}
                          <span className="text-[12px] font-semibold text-white">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </section>

                {/* Step 2 */}
                <section>
                  <h2 className="text-[15px] font-semibold text-white">
                    2. Predict the final score
                  </h2>
                  <p className="mt-1 text-[12px] text-white/45">Enter your predicted score</p>
                  <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                    <ScoreInput
                      label={selectedMatch.homeTeam.name}
                      value={homeScore}
                      onChange={setHomeScore}
                      disabled={isFormDisabled}
                    />
                    <span className="hidden text-2xl font-light text-white/30 sm:block sm:mt-6">-</span>
                    <ScoreInput
                      label={selectedMatch.awayTeam.name}
                      value={awayScore}
                      onChange={setAwayScore}
                      disabled={isFormDisabled}
                    />
                  </div>
                </section>

                {/* Step 3 */}
                <section>
                  <h2 className="text-[15px] font-semibold text-white">3. Your Details</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <DetailInput label="Full Name" value={fullName} onChange={setFullName} readOnly={isFormDisabled} />
                    <DetailInput label="Roll Number" value={rollNumber} readOnly />
                    <DetailInput label="Department / Branch" value={department} readOnly />
                    <DetailInput label="Year / Semester" value={year} readOnly />
                  </div>
                </section>

                {submitError && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-300">
                    {submitError}
                  </p>
                )}

                {submitted && !isComingSoon && (
                  <p className="rounded-lg border border-grass-500/30 bg-grass-500/10 px-3 py-2 text-[12px] text-grass-400">
                    Prediction saved successfully! You can edit it until the deadline.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || isFormDisabled}
                  className={`w-full rounded-lg py-3.5 text-[14px] font-semibold text-white transition-colors disabled:cursor-not-allowed ${
                    isComingSoon
                      ? 'bg-yellow-500 hover:bg-yellow-600 shadow-[0_4px_20px_rgba(234,179,8,0.35)] disabled:bg-yellow-500/50 disabled:shadow-none'
                      : isPredictionClosed
                        ? 'bg-red-500 hover:bg-red-600 shadow-[0_4px_20px_rgba(239,68,68,0.35)] disabled:bg-red-500/50 disabled:shadow-none'
                        : 'bg-grass-500 hover:bg-grass-600 shadow-[0_4px_20px_rgba(34,197,94,0.35)]'
                  }`}
                >
                  {isComingSoon ? 'Coming Soon' : isPredictionClosed ? 'Prediction Closed' : submitting ? 'Submitting...' : submitted ? 'Update Prediction' : 'Submit Prediction'}
                </button>

                <p className="flex items-center justify-center gap-2 text-[11px] text-white/35">
                  <HiOutlineLockClosed className="h-3.5 w-3.5" />
                  You can edit your prediction until the deadline.
                </p>
              </form>
            </div>

            {/* Scoring banner */}
            <div className="mt-6 flex items-center gap-4 overflow-hidden rounded-xl border border-blue-500/20 bg-blue-950/40 px-5 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-400">
                i
              </div>
              <div className="flex-1 text-[12px] leading-relaxed text-white/70 sm:text-[13px]">
                <span className="font-semibold text-white block sm:inline">Scoring System</span>
                <span className="hidden mx-2 text-white/25 sm:inline">|</span>
                <div className="mt-1 sm:mt-0 sm:inline">
                  Correct Winner: <span className="font-semibold text-white">{settings?.pointsCorrectWinner ?? 10}</span>
                  <span className="mx-2 text-white/25">|</span>
                  Correct Score: <span className="font-semibold text-white">{settings?.pointsExactScore ?? 20}</span>
                  <span className="mx-2 text-white/25">|</span>
                  Close Score: <span className="font-semibold text-white">{settings?.pointsGoalDifference ?? 5}</span>
                </div>
              </div>
              <GiSoccerBall className="hidden h-10 w-10 shrink-0 text-white/20 sm:block" />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
