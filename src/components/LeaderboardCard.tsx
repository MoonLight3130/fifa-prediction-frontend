import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MedalBadge, { getMedalType } from './leaderboard/MedalBadge'
import { useAsync } from '../hooks/useAsync'
import { fetchLeaderboard } from '../lib/api/stats'

function RankBadge({ rank }: { rank: number }) {
  const medal = getMedalType(rank)
  if (medal) return <MedalBadge type={medal} />
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-sm font-semibold text-white/35">
      {rank}
    </span>
  )
}

export default function LeaderboardCard() {
  const { data, loading, error } = useAsync(() => fetchLeaderboard(10), [])
  const entries = data?.entries.slice(0, 5) ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="glass-card flex min-h-[340px] flex-1 flex-col rounded-[20px] px-7 py-7 sm:px-8 sm:py-8"
    >
      <h2 className="text-[17px] font-bold text-white sm:text-lg">Top 10 Leaderboard</h2>

      {loading ? (
        <p className="mt-8 flex flex-1 items-center justify-center text-sm text-white/50">
          Loading leaderboard...
        </p>
      ) : error ? (
        <p className="mt-8 flex flex-1 items-center justify-center text-sm text-white/50">{error}</p>
      ) : entries.length === 0 ? (
        <p className="mt-8 flex flex-1 items-center justify-center text-sm text-white/50">
          No rankings yet.
        </p>
      ) : (
        <ul className="mt-5 flex flex-1 flex-col justify-center gap-0.5">
          {entries.map((player, i) => (
            <motion.li
              key={player.rollNumber}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.45 + i * 0.07 }}
              className="flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-white/[0.04]"
            >
              <RankBadge rank={player.rank} />
              <span className="flex-1 truncate text-[14px] font-medium text-white/90">
                {player.name}
              </span>
              <span className="shrink-0 text-[13px] font-medium tabular-nums text-white/55">
                {player.totalPoints} pts
              </span>
            </motion.li>
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-white/[0.06] pt-4 text-right">
        <Link
          to="/leaderboard"
          className="text-[13px] font-semibold text-grass-500 transition-colors duration-200 hover:text-grass-400"
        >
          View Full Leaderboard →
        </Link>
      </div>
    </motion.div>
  )
}
