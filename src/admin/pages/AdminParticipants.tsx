import { useMemo, useState } from 'react'
import { HiOutlineDownload } from 'react-icons/hi'
import {
  deleteParticipantApi,
  fetchParticipants,
  updateParticipantApi,
} from '../../lib/api/admin'
import { exportToCsv } from '../../lib/admin/export'
import { useAsync } from '../../hooks/useAsync'
import { useAdmin } from '../context/AdminProvider'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import Pagination, { paginate } from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import { LoadingState, ErrorState } from '../../components/ui/DataStates'
import type { Participant } from '../../lib/api/types'

export default function AdminParticipants() {
  const { version, refresh, showToast, confirm } = useAdmin()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data: participantsData, loading, error, refresh: reload } = useAsync(
    fetchParticipants,
    [version],
  )
  const participants = participantsData ?? []

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return participants.filter(
      (participant) =>
        participant.rollNumber.toLowerCase().includes(query) ||
        participant.fullName.toLowerCase().includes(query) ||
        participant.department.toLowerCase().includes(query),
    )
  }, [participants, search])

  const { items, totalPages, page: currentPage } = paginate(filtered, page, 10)

  async function updateField(
    participant: Participant,
    field: 'totalPoints' | 'rank' | 'status',
    value: string | number,
  ) {
    await updateParticipantApi(participant.rollNumber, { [field]: value })
    showToast('Participant updated.')
    refresh()
    reload()
  }

  async function handleRemove(participant: Participant) {
    const approved = await confirm({
      title: 'Remove Participant',
      message: `Remove ${participant.fullName} (${participant.rollNumber}) from the league? Their predictions will also be deleted.`,
      confirmLabel: 'Remove',
      danger: true,
    })
    if (!approved) return
    await deleteParticipantApi(participant.rollNumber)
    showToast('Participant removed.')
    refresh()
    reload()
  }

  if (loading) return <LoadingState message="Loading participants..." />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <PageHeader
        title="Participants"
        description="Manage students, edit points and rankings, and control account status."
        actions={
          <button
            type="button"
            onClick={() =>
              exportToCsv(
                'participants',
                ['Rank', 'Roll Number', 'Name', 'Department', 'Points', 'Status'],
                filtered.map((p) => [
                  String(p.rank),
                  p.rollNumber,
                  p.fullName,
                  p.department,
                  String(p.totalPoints),
                  p.status,
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
        <SearchBar value={search} onChange={setSearch} placeholder="Search by roll number or name..." />
      </div>

      {items.length === 0 ? (
        <EmptyState message="No participants found." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0a1628]/80">
          <table className="min-w-full text-left text-[13px]">
            <thead className="border-b border-white/[0.06] text-white/40">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Roll Number</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Points</th>
                <th className="px-4 py-3">Predictions</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((participant) => (
                <tr key={participant.rollNumber} className="border-t border-white/[0.06]">
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={participant.rank}
                      className="w-16 rounded-lg border border-white/10 bg-navy-950 px-2 py-1 text-center"
                      onBlur={(e) => updateField(participant, 'rank', Number(e.target.value))}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-white/80">{participant.rollNumber}</td>
                  <td className="px-4 py-3 text-white">{participant.fullName}</td>
                  <td className="px-4 py-3 text-white/60">{participant.department}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={participant.totalPoints}
                      className="w-20 rounded-lg border border-white/10 bg-navy-950 px-2 py-1 text-center"
                      onBlur={(e) =>
                        updateField(participant, 'totalPoints', Number(e.target.value))
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-white/60">{participant.predictionsSubmitted}</td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={participant.status}
                      onChange={(e) => updateField(participant, 'status', e.target.value)}
                      className="rounded-lg border border-white/10 bg-navy-950 px-2 py-1 text-[12px]"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemove(participant)}
                      className="admin-btn-danger"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
