import { apiClient } from './client'
import type { Participant, ActivityLogEntry } from './types'
import type { Match } from './types'

export async function fetchAdminDashboard() {
  return apiClient<{
    success: boolean
    stats: {
      totalMatches: number
      liveMatches: number
      totalPredictions: number
      totalParticipants: number
      publishedAnnouncements: number
      statusChart: { label: string; value: number }[]
      recentMatches: Match[]
      recentActivity: ActivityLogEntry[]
    }
  }>('/stats/admin/dashboard')
}

export async function fetchParticipants() {
  const data = await apiClient<{ success: boolean; participants: Participant[] }>(
    '/stats/admin/participants',
  )
  return data.participants
}

export async function updateParticipantApi(
  rollNumber: string,
  payload: Partial<Participant>,
) {
  const data = await apiClient<{ success: boolean; participant: Participant }>(
    `/stats/admin/participants/${encodeURIComponent(rollNumber)}`,
    { method: 'PUT', body: JSON.stringify(payload) },
  )
  return data.participant
}

export async function deleteParticipantApi(rollNumber: string) {
  return apiClient<{ success: boolean; message: string }>(
    `/stats/admin/participants/${encodeURIComponent(rollNumber)}`,
    { method: 'DELETE' },
  )
}

export async function fetchActivityLog() {
  const data = await apiClient<{ success: boolean; logs: ActivityLogEntry[] }>(
    '/stats/admin/activity',
  )
  return data.logs
}
