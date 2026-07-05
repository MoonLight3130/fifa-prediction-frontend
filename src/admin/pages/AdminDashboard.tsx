import { useAsync } from '../../hooks/useAsync'
import { fetchAdminDashboard } from '../../lib/api/admin'
import { useAdmin } from '../context/AdminProvider'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import SimpleBarChart from '../components/SimpleBarChart'
import StatusBadge from '../components/StatusBadge'
import { LoadingState, ErrorState } from '../../components/ui/DataStates'
import { getPredictionStatus } from '../../lib/matchValidation'
import {
  HiOutlineChartBar,
  HiOutlineClipboardList,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
} from 'react-icons/hi'

export default function AdminDashboard() {
  const { version } = useAdmin()
  const { data, loading, error } = useAsync(fetchAdminDashboard, [version])
  const stats = data?.stats

  if (loading) return <LoadingState message="Loading dashboard..." />
  if (error || !stats) return <ErrorState message={error ?? 'Failed to load dashboard.'} />

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of tournament operations, predictions, and league activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Matches" value={stats.totalMatches} icon={<HiOutlineViewGrid className="h-5 w-5" />} />
        <StatCard label="Live Matches" value={stats.liveMatches} icon={<HiOutlineChartBar className="h-5 w-5" />} />
        <StatCard label="Predictions" value={stats.totalPredictions} icon={<HiOutlineClipboardList className="h-5 w-5" />} />
        <StatCard label="Participants" value={stats.totalParticipants} icon={<HiOutlineUserGroup className="h-5 w-5" />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5">
          <h2 className="text-sm font-semibold text-white">Match Status Breakdown</h2>
          <div className="mt-4">
            <SimpleBarChart data={stats.statusChart} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5">
          <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            {stats.recentActivity.length === 0 ? (
              <p className="text-[13px] text-white/40">No admin actions logged yet.</p>
            ) : (
              stats.recentActivity.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                  <p className="text-[13px] font-medium text-white">{entry.action}</p>
                  <p className="text-[11px] text-white/40">{entry.details}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5">
        <h2 className="text-sm font-semibold text-white">Upcoming & Recent Matches</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-[13px]">
            <thead className="text-white/40">
              <tr>
                <th className="pb-3 pr-4">Match</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentMatches.map((match) => (
                <tr key={match.id} className="border-t border-white/[0.06]">
                  <td className="py-3 pr-4 text-white">
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </td>
                  <td className="py-3 pr-4 text-white/60">
                    {match.date} · {match.time}
                  </td>
                  <td className="py-3 pr-4 flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={match.status} />
                    {match.status === 'Upcoming' && (() => {
                      const pStatus = getPredictionStatus(
                        match.homeTeam.name,
                        match.awayTeam.name,
                        match.predictionDeadline,
                        match.kickoffAt,
                        match.predictionsOpen,
                        match.resultPublished
                      )
                      return (
                        <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                          pStatus === 'open'
                            ? 'bg-grass-500/10 text-grass-400 border-grass-500/30'
                            : pStatus === 'coming-soon'
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}>
                          Predictions: {pStatus === 'open' ? 'Open' : pStatus === 'coming-soon' ? 'Soon' : 'Closed'}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="py-3 text-white/70">
                    {match.homeScore !== null ? `${match.homeScore} - ${match.awayScore}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
