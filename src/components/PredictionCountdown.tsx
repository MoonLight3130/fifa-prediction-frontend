import { useState, useEffect } from 'react'
import { HiOutlineClock } from 'react-icons/hi'
import { isMatchFinalized } from '../lib/matchValidation'

interface PredictionCountdownProps {
  deadline: string | null | undefined
  kickoffAt: string | null | undefined
  homeTeamName?: string
  awayTeamName?: string
  isClosed?: boolean
  className?: string
}

export function getPredictionStatus(
  deadline: string | null,
  kickoffAt: string | null
): 'open' | 'closing-soon' | 'closed' {
  if (!deadline && !kickoffAt) return 'open'
  
  const now = new Date()
  const deadlineTime = deadline ? new Date(deadline) : new Date(kickoffAt!)
  const timeUntilDeadline = deadlineTime.getTime() - now.getTime()
  
  if (timeUntilDeadline <= 0) return 'closed'
  if (timeUntilDeadline <= 30 * 60 * 1000) return 'closing-soon' // 30 minutes
  return 'open'
}

export function getStatusBadgeColor(status: 'open' | 'closing-soon' | 'closed'): string {
  switch (status) {
    case 'open':
      return 'bg-grass-500/10 text-grass-500 border-grass-500/30'
    case 'closing-soon':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/30'
    case 'closed':
      return 'bg-red-500/10 text-red-500 border-red-500/30'
  }
}

export function getStatusLabel(status: 'open' | 'closing-soon' | 'closed'): string {
  switch (status) {
    case 'open':
      return 'Open'
    case 'closing-soon':
      return 'Closing Soon'
    case 'closed':
      return 'Closed'
  }
}

export default function PredictionCountdown({
  deadline,
  kickoffAt,
  homeTeamName,
  awayTeamName,
  isClosed = false,
  className = '',
}: PredictionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)
  const [status, setStatus] = useState<'open' | 'closing-soon' | 'closed'>('open')

  const isUndecided = homeTeamName && awayTeamName ? !isMatchFinalized(homeTeamName, awayTeamName) : false

  useEffect(() => {
    if (isUndecided) return

    const calculateTimeLeft = () => {
      const now = new Date()
      const deadlineTime = deadline ? new Date(deadline) : kickoffAt ? new Date(kickoffAt) : null
      
      if (!deadlineTime) {
        setTimeLeft(null)
        setStatus('open')
        return
      }

      const diff = deadlineTime.getTime() - now.getTime()
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setStatus('closed')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
      
      if (diff <= 30 * 60 * 1000) {
        setStatus('closing-soon')
      } else {
        setStatus('open')
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [deadline, kickoffAt, isUndecided])

  if (isUndecided) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
        >
          <HiOutlineClock className="h-3 w-3" />
          Coming Soon
        </span>
      </div>
    )
  }

  if (!timeLeft) return null

  const displayStatus = isClosed ? 'closed' : status

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusBadgeColor(displayStatus)}`}
      >
        <HiOutlineClock className="h-3 w-3" />
        {getStatusLabel(displayStatus)}
      </span>
      
      {displayStatus !== 'closed' && (
        <span className="text-[11px] font-medium text-white/60 tabular-nums">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
        </span>
      )}
    </div>
  )
}
