import { apiClient } from './client'
import type { FixtureStageGroup, Match, MatchResult } from './types'

export async function fetchNextMatch() {
  const data = await apiClient<{ success: boolean; match: Match | null }>('/matches/next')
  return data.match
}

export async function fetchMatches(params?: { status?: string; stage?: string; open?: boolean }) {
  const search = new URLSearchParams()
  if (params?.status) search.set('status', params.status)
  if (params?.stage) search.set('stage', params.stage)
  if (params?.open) search.set('open', 'true')
  const query = search.toString() ? `?${search}` : ''
  const data = await apiClient<{ success: boolean; matches: Match[] }>(`/matches${query}`)
  return data.matches
}

export async function fetchFixtureGroups() {
  const data = await apiClient<{ success: boolean; groups: FixtureStageGroup[] }>('/matches/fixtures')
  return data.groups
}

export async function fetchMatchResults() {
  const data = await apiClient<{ success: boolean; results: MatchResult[] }>('/matches/results')
  return data.results
}

export async function createMatch(payload: Partial<Match>) {
  const data = await apiClient<{ success: boolean; match: Match }>('/matches', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.match
}

export async function updateMatch(id: string, payload: Partial<Match>) {
  const data = await apiClient<{ success: boolean; match: Match }>(`/matches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return data.match
}

export async function deleteMatch(id: string) {
  return apiClient<{ success: boolean; message: string }>(`/matches/${id}`, { method: 'DELETE' })
}

export async function publishMatchResult(id: string) {
  const data = await apiClient<{ success: boolean; match: Match }>(`/matches/${id}/publish`, {
    method: 'POST',
  })
  return data.match
}

export async function recalculateLeaderboardApi() {
  return apiClient<{ success: boolean; message: string }>('/matches/recalculate', { method: 'POST' })
}
