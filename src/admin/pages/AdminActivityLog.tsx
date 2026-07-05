import { useMemo, useState } from 'react'
import { fetchActivityLog } from '../../lib/api/admin'
import { exportToCsv } from '../../lib/admin/export'
import { useAsync } from '../../hooks/useAsync'
import { useAdmin } from '../context/AdminProvider'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import Pagination, { paginate } from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import { LoadingState, ErrorState } from '../../components/ui/DataStates'

export default function AdminActivityLog() {
  const { version } = useAdmin()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data: logsData, loading, error } = useAsync(fetchActivityLog, [version])
  const logs = logsData ?? []

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return logs.filter(
      (entry) =>
        entry.action.toLowerCase().includes(query) ||
        entry.details.toLowerCase().includes(query) ||
        entry.adminRollNumber.toLowerCase().includes(query),
    )
  }, [logs, search])

  const { items, totalPages, page: currentPage } = paginate(filtered, page, 15)

  if (loading) return <LoadingState message="Loading activity log..." />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <PageHeader
        title="Activity Log"
        description="Audit trail of all administrator actions across the platform."
        actions={
          <button
            type="button"
            onClick={() =>
              exportToCsv(
                'activity-log',
                ['Timestamp', 'Admin', 'Action', 'Details'],
                filtered.map((entry) => [
                  entry.timestamp,
                  entry.adminRollNumber,
                  entry.action,
                  entry.details,
                ]),
              )
            }
            className="admin-btn-secondary"
          >
            Export Log
          </button>
        }
      />

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search activity log..." />
      </div>

      {items.length === 0 ? (
        <EmptyState message="No activity recorded yet." />
      ) : (
        <div className="space-y-2">
          {items.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border border-white/[0.08] bg-[#0a1628]/80 px-4 py-3"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[13px] font-medium text-white">{entry.action}</p>
                  <p className="text-[12px] text-white/50">{entry.details}</p>
                </div>
                <div className="text-[11px] text-white/35">
                  {entry.adminRollNumber} · {new Date(entry.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
