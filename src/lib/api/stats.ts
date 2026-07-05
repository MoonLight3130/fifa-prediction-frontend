import { apiClient } from './client'
import type { LeaderboardEntry, HomeStats, Announcement } from './types'

export async function fetchLeaderboard(limit?: number) {
  const query = limit ? `?limit=${limit}` : ''
  const data = await apiClient<{
    success: boolean
    entries: LeaderboardEntry[]
    lastUpdated: string
  }>(`/stats/leaderboard${query}`)
  return data
}

export async function fetchLeaderboardEntry(rollNumber: string) {
  const data = await apiClient<{ success: boolean; entry: LeaderboardEntry }>(
    `/stats/leaderboard/${encodeURIComponent(rollNumber)}`,
  )
  return data.entry
}

export async function fetchHomeData() {
  const data = await apiClient<{
    success: boolean
    stats: HomeStats
    topEntries: LeaderboardEntry[]
    announcements: Announcement[]
  }>('/stats/home')
  return data
}
