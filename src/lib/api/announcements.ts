import { apiClient } from './client'
import type { Announcement } from './types'

export async function fetchPublishedAnnouncements() {
  const data = await apiClient<{ success: boolean; announcements: Announcement[] }>(
    '/announcements/published',
  )
  return data.announcements
}

export async function fetchAllAnnouncements() {
  const data = await apiClient<{ success: boolean; announcements: Announcement[] }>(
    '/announcements',
  )
  return data.announcements
}

export async function createAnnouncement(payload: {
  title: string
  body: string
  priority: 'normal' | 'high'
  published: boolean
}) {
  const data = await apiClient<{ success: boolean; announcement: Announcement }>('/announcements', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.announcement
}

export async function updateAnnouncement(
  id: string,
  payload: Partial<{ title: string; body: string; priority: string; published: boolean }>,
) {
  const data = await apiClient<{ success: boolean; announcement: Announcement }>(
    `/announcements/${id}`,
    { method: 'PUT', body: JSON.stringify(payload) },
  )
  return data.announcement
}

export async function deleteAnnouncementApi(id: string) {
  return apiClient<{ success: boolean; message: string }>(`/announcements/${id}`, {
    method: 'DELETE',
  })
}
