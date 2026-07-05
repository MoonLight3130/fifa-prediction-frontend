import { useMemo, useState } from 'react'
import { HiOutlineDownload } from 'react-icons/hi'
import { adminDeletePredictionApi, fetchAllPredictions } from '../../lib/api/predictions'
import { fetchMatches } from '../../lib/api/matches'
import { exportToCsv } from '../../lib/admin/export'
import { useAsync } from '../../hooks/useAsync'
import { useAdmin } from '../context/AdminProvider'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import Pagination, { paginate } from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import { LoadingState, ErrorState } from '../../components/ui/DataStates'

export default function AdminPredictions() {
  const { version, refresh, showToast, confirm } = useAdmin()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data: predictionsData, loading, error, refresh: reload } = useAsync(
    fetchAllPredictions,
    [version],
  )
  const { data: matchesData } = useAsync(fetchMatches, [version])
  const predictions = predictionsData ?? []
  const matches = matchesData ?? []

  const matchMap = useMemo(
    () => new Map(matches.map((match) => [match.id, match])),
    [matches],
  )

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return predictions.filter(
      (prediction) =>
        prediction.rollNumber.toLowerCase().includes(query) ||
        prediction.fullName.toLowerCase().includes(query) ||
        prediction.matchId.toLowerCase().includes(query),
    )
  }, [predictions, search])

  const { items, totalPages, page: currentPage } = paginate(filtered, page, 12)

  async function handleDelete(id: string, rollNumber: string, matchId: string) {
    const approved = await confirm({
      title: 'Delete Prediction',
      message: `Remove prediction for ${rollNumber} on match ${matchId}?`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!approved) return
    await adminDeletePredictionApi(id)
    showToast('Prediction deleted.')
    refresh()
    reload()
  }

  if (loading) return <LoadingState message="Loading predictions..." />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <PageHeader
        title="Predictions"
        description="Search, filter, and manage all submitted student predictions."
        actions={
          <button
            type="button"
            onClick={() =>
              exportToCsv(
                'predictions',
                ['Roll Number', 'Name', 'Match', 'Winner', 'Score', 'Points', 'Submitted'],
                filtered.map((p) => [
                  p.rollNumber,
                  p.fullName,
                  p.matchId,
                  p.winner,
                  `${p.homeScore}-${p.awayScore}`,
                  String(p.pointsEarned),
                  p.submittedAt,
                ]),
              )
            }
            className="admin-btn-secondary"
          >
            <HiOutlineDownload className="h-4 w-4" /> Export
          </button>
        }
      />

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search predictions..." />
      </div>

      {items.length === 0 ? (
        <EmptyState message="No predictions submitted yet." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((prediction) => {
            const match = matchMap.get(prediction.matchId)
            return (
              <div
                key={prediction.id}
                className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-4"
              >
                <p className="font-semibold text-white">{prediction.fullName}</p>
                <p className="text-[12px] text-white/40">{prediction.rollNumber}</p>
                <p className="mt-3 text-[13px] text-white/70">
                  {match
                    ? `${match.homeTeam.name} vs ${match.awayTeam.name}`
                    : prediction.matchId}
                </p>
                <p className="mt-1 text-[12px] text-grass-400">
                  Pick: {prediction.winner.toUpperCase()} · {prediction.homeScore}-{prediction.awayScore}
                </p>
                <p className="mt-1 text-[11px] text-white/30">
                  {new Date(prediction.submittedAt).toLocaleString()}
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(prediction.id, prediction.rollNumber, prediction.matchId)}
                  className="admin-btn-danger mt-3"
                >
                  Delete
                </button>
              </div>
            )
          })}
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
