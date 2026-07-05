import { fetchParticipants } from '../../lib/api/admin'
import { fetchAllPredictions } from '../../lib/api/predictions'
import { fetchMatches } from '../../lib/api/matches'
import { useAsync } from '../../hooks/useAsync'
import { useAdmin } from '../context/AdminProvider'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import SimpleBarChart from '../components/SimpleBarChart'
import { LoadingState, ErrorState } from '../../components/ui/DataStates'
import { HiOutlineChartBar, HiOutlineTrendingUp, HiOutlineUserGroup } from 'react-icons/hi'

export default function AdminAnalytics() {
  const { version } = useAdmin()
  const { data: participantsData, loading: pLoading, error: pError } = useAsync(
    fetchParticipants,
    [version],
  )
  const { data: predictionsData } = useAsync(fetchAllPredictions, [version])
  const { data: matchesData } = useAsync(fetchMatches, [version])
  const participants = participantsData ?? []
  const predictions = predictionsData ?? []
  const matches = matchesData ?? []

  if (pLoading) return <LoadingState message="Loading analytics..." />
  if (pError) return <ErrorState message={pError} />

  const deptCounts = participants.reduce<Record<string, number>>((acc, participant) => {
    acc[participant.department] = (acc[participant.department] ?? 0) + 1
    return acc
  }, {})

  const topScorers = [...participants]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 5)
    .map((p) => ({ label: p.fullName, value: p.totalPoints }))

  const finishedMatches = matches.filter((match) => match.status === 'Finished').length
  const avgPredictions =
    participants.length > 0
      ? Math.round((predictions.length / participants.length) * 10) / 10
      : 0

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="League performance insights, participation trends, and scoring statistics."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Predictions" value={predictions.length} icon={<HiOutlineChartBar className="h-5 w-5" />} />
        <StatCard label="Avg per Student" value={avgPredictions} icon={<HiOutlineTrendingUp className="h-5 w-5" />} />
        <StatCard label="Finished Matches" value={finishedMatches} icon={<HiOutlineChartBar className="h-5 w-5" />} />
        <StatCard label="Participants" value={participants.length} icon={<HiOutlineUserGroup className="h-5 w-5" />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5">
          <h2 className="text-sm font-semibold text-white">Participants by Department</h2>
          <div className="mt-4">
            <SimpleBarChart
              data={Object.entries(deptCounts).map(([label, value]) => ({ label, value }))}
              color="#38bdf8"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5">
          <h2 className="text-sm font-semibold text-white">Top Scorers</h2>
          <div className="mt-4">
            <SimpleBarChart data={topScorers} color="#eab308" />
          </div>
        </section>
      </div>
    </div>
  )
}
