import { useMemo, useState } from 'react'
import { HiOutlineDownload, HiOutlinePlus } from 'react-icons/hi'
import type { Match } from '../../lib/api/types'
import {
  createMatch,
  deleteMatch,
  fetchMatches,
  publishMatchResult,
  recalculateLeaderboardApi,
  updateMatch,
} from '../../lib/api/matches'
import { MATCH_STATUSES } from '../../lib/api/constants'
import { exportToCsv, exportToPdf, tableHtml } from '../../lib/admin/export'
import { useAsync } from '../../hooks/useAsync'
import { useAdmin } from '../context/AdminProvider'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import StatusBadge from '../components/StatusBadge'
import Pagination, { paginate } from '../components/Pagination'
import MatchFormModal from '../components/MatchFormModal'
import EmptyState from '../components/EmptyState'
import { LoadingState, ErrorState } from '../../components/ui/DataStates'
import { getPredictionStatus } from '../../lib/matchValidation'

export default function AdminMatches() {
  const { version, refresh, showToast, confirm } = useAdmin()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Match | null>(null)
  const [creating, setCreating] = useState(false)

  const { data: matchesData, loading, error, refresh: reload } = useAsync(fetchMatches, [version])
  const matches = matchesData ?? []

  const filtered = useMemo(() => {
    return matches.filter((match) => {
      const query = search.toLowerCase()
      const matchesSearch =
        match.homeTeam.name.toLowerCase().includes(query) ||
        match.awayTeam.name.toLowerCase().includes(query) ||
        match.id.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || match.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [matches, search, statusFilter])

  const { items, totalPages, page: currentPage } = paginate(filtered, page, 8)

  async function handleDelete(match: Match) {
    const approved = await confirm({
      title: 'Delete Match',
      message: `Delete ${match.homeTeam.name} vs ${match.awayTeam.name}?`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!approved) return
    await deleteMatch(match.id)
    showToast('Match deleted.')
    refresh()
    reload()
  }

  async function handleSave(data: Omit<Match, 'createdAt' | 'updatedAt'> & { createdAt?: string }) {
    if (data.id) {
      await updateMatch(data.id, data)
      showToast('Match updated.')
    } else {
      await createMatch(data)
      showToast('Match created.')
    }
    setEditing(null)
    setCreating(false)
    refresh()
    reload()
  }

  async function handlePublish(match: Match) {
    try {
      await publishMatchResult(match.id)
      showToast('Result published and leaderboard recalculated.')
      refresh()
      reload()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to publish result.', 'error')
    }
  }

  async function handleRecalculateAll() {
    await recalculateLeaderboardApi()
    showToast('Leaderboard recalculated.')
    refresh()
  }

  if (loading) return <LoadingState message="Loading matches..." />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <PageHeader
        title="Match Management"
        description="Schedule matches, update live scores, publish results, and manage statuses."
        actions={
          <>
            <button type="button" onClick={() => handleExportCsv(filtered)} className="admin-btn-secondary">
              <HiOutlineDownload className="h-4 w-4" /> CSV
            </button>
            <button type="button" onClick={() => handleExportPdf(filtered)} className="admin-btn-secondary">
              PDF
            </button>
            <button type="button" onClick={handleRecalculateAll} className="admin-btn-secondary">
              Recalculate Points
            </button>
            <button type="button" onClick={() => setCreating(true)} className="admin-btn-primary">
              <HiOutlinePlus className="h-4 w-4" /> Add Match
            </button>
          </>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchBar value={search} onChange={setSearch} placeholder="Search matches..." />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0a1628] px-4 py-2.5 text-[13px] text-white"
        >
          <option value="all">All Statuses</option>
          {MATCH_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <EmptyState message="No matches found." />
      ) : (
        <div className="space-y-3">
          {items.map((match) => (
            <div key={match.id} className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </p>
                  <p className="mt-1 text-[12px] text-white/40">
                    {match.stageLabel} · {match.date} · {match.time}
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
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
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          pStatus === 'open'
                            ? 'bg-grass-500/10 text-grass-400 border-grass-500/30'
                            : pStatus === 'coming-soon'
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}>
                          Predictions: {pStatus === 'open' ? 'Open' : pStatus === 'coming-soon' ? 'Coming Soon' : 'Closed'}
                        </span>
                      )
                    })()}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="H"
                    defaultValue={match.homeScore ?? ''}
                    className="w-14 rounded-lg border border-white/10 bg-navy-950 px-2 py-1.5 text-center text-[13px]"
                    onBlur={async (e) => {
                      const home = Number(e.target.value)
                      const away = match.awayScore ?? 0
                      if (!Number.isNaN(home)) {
                        await updateMatch(match.id, { homeScore: home, awayScore: away })
                        reload()
                      }
                    }}
                  />
                  <span className="text-white/40">-</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="A"
                    defaultValue={match.awayScore ?? ''}
                    className="w-14 rounded-lg border border-white/10 bg-navy-950 px-2 py-1.5 text-center text-[13px]"
                    onBlur={async (e) => {
                      const away = Number(e.target.value)
                      const home = match.homeScore ?? 0
                      if (!Number.isNaN(away)) {
                        await updateMatch(match.id, { homeScore: home, awayScore: away })
                        reload()
                      }
                    }}
                  />
                  <select
                    value={match.status}
                    onChange={async (e) => {
                      await updateMatch(match.id, { status: e.target.value as Match['status'] })
                      reload()
                    }}
                    className="rounded-lg border border-white/10 bg-navy-950 px-2 py-1.5 text-[12px] text-white"
                  >
                    {MATCH_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => setEditing(match)} className="admin-btn-secondary">
                    Edit
                  </button>
                  <button type="button" onClick={() => handlePublish(match)} className="admin-btn-primary">
                    Publish
                  </button>
                  <button type="button" onClick={() => handleDelete(match)} className="admin-btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />

      {(creating || editing) && (
        <MatchFormModal
          match={editing}
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function handleExportCsv(matches: Match[]) {
  exportToCsv(
    'matches',
    ['ID', 'Home', 'Away', 'Date', 'Status', 'Score'],
    matches.map((match) => [
      match.id,
      match.homeTeam.name,
      match.awayTeam.name,
      `${match.date} ${match.time}`,
      match.status,
      match.homeScore !== null ? `${match.homeScore}-${match.awayScore}` : '',
    ]),
  )
}

function handleExportPdf(matches: Match[]) {
  exportToPdf(
    'Match Schedule',
    tableHtml(
      ['Match', 'Date', 'Status', 'Score'],
      matches.map((match) => [
        `${match.homeTeam.name} vs ${match.awayTeam.name}`,
        `${match.date} ${match.time}`,
        match.status,
        match.homeScore !== null ? `${match.homeScore}-${match.awayScore}` : '—',
      ]),
    ),
  )
}
