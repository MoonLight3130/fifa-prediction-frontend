import { useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi'
import {
  createAnnouncement,
  deleteAnnouncementApi,
  fetchAllAnnouncements,
  updateAnnouncement,
} from '../../lib/api/announcements'
import { useAsync } from '../../hooks/useAsync'
import { useAdmin } from '../context/AdminProvider'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import { LoadingState, ErrorState } from '../../components/ui/DataStates'

export default function AdminAnnouncements() {
  const { version, refresh, showToast, confirm } = useAdmin()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [priority, setPriority] = useState<'normal' | 'high'>('normal')
  const { data: announcementsData, loading, error, refresh: reload } = useAsync(
    fetchAllAnnouncements,
    [version],
  )
  const announcements = announcementsData ?? []

  async function handleCreate() {
    if (!title.trim() || !body.trim()) {
      showToast('Title and body are required.', 'error')
      return
    }
    await createAnnouncement({ title: title.trim(), body: body.trim(), priority, published: true })
    setTitle('')
    setBody('')
    showToast('Announcement published.')
    refresh()
    reload()
  }

  async function handleDelete(id: string, announcementTitle: string) {
    const approved = await confirm({
      title: 'Delete Announcement',
      message: `Delete "${announcementTitle}"?`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!approved) return
    await deleteAnnouncementApi(id)
    showToast('Announcement deleted.')
    refresh()
    reload()
  }

  async function togglePublish(id: string, published: boolean) {
    await updateAnnouncement(id, { published: !published })
    showToast(published ? 'Announcement unpublished.' : 'Announcement published.')
    refresh()
    reload()
  }

  if (loading) return <LoadingState message="Loading announcements..." />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Publish league updates and important notices to all participants."
      />

      <section className="mb-6 rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5">
        <h2 className="text-sm font-semibold text-white">Create Announcement</h2>
        <div className="mt-4 grid gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title"
            className="rounded-xl border border-white/10 bg-navy-950 px-4 py-2.5 text-[13px] text-white"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Announcement message"
            rows={4}
            className="rounded-xl border border-white/10 bg-navy-950 px-4 py-2.5 text-[13px] text-white"
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'normal' | 'high')}
              className="rounded-xl border border-white/10 bg-navy-950 px-4 py-2.5 text-[13px] text-white"
            >
              <option value="normal">Normal Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button type="button" onClick={handleCreate} className="admin-btn-primary">
              <HiOutlinePlus className="h-4 w-4" /> Publish
            </button>
          </div>
        </div>
      </section>

      {announcements.length === 0 ? (
        <EmptyState message="No announcements yet." />
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-[13px] text-white/60">{item.body}</p>
                  <p className="mt-2 text-[11px] text-white/30">
                    {new Date(item.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePublish(item.id, item.published)}
                    className="admin-btn-secondary"
                  >
                    {item.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="admin-btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
