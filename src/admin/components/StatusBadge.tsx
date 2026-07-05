import type { MatchStatus } from '../../lib/api/types'

const styles: Record<MatchStatus, string> = {
  Upcoming: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  Ongoing: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  Live: 'bg-red-500/10 text-red-300 border-red-500/20',
  Finished: 'bg-grass-500/10 text-grass-300 border-grass-500/20',
  Delayed: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  Cancelled: 'bg-white/5 text-white/40 border-white/10',
}

export default function StatusBadge({ status }: { status: MatchStatus | string }) {
  const style = styles[status as MatchStatus] ?? styles.Upcoming
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${style}`}>
      {status}
    </span>
  )
}
