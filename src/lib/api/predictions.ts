import { apiClient } from './client'
import type { Prediction, Match } from './types'

export async function fetchOpenMatches() {
  const data = await apiClient<{ success: boolean; matches: Match[] }>('/predictions/open-matches')
  return data.matches
}

export async function fetchMyPredictions() {
  const data = await apiClient<{ success: boolean; predictions: Prediction[] }>('/predictions/mine')
  return data.predictions
}

export async function fetchPredictionForMatch(matchId: string) {
  const data = await apiClient<{ success: boolean; prediction: Prediction | null }>(
    `/predictions/match/${matchId}`,
  )
  return data.prediction
}

export async function fetchAllPredictions() {
  const data = await apiClient<{ success: boolean; predictions: Prediction[] }>('/predictions')
  return data.predictions
}

export async function submitPrediction(payload: {
  matchId: string
  winner: 'home' | 'draw' | 'away'
  homeScore: number
  awayScore: number
  id?: string
}) {
  const data = await apiClient<{ success: boolean; prediction: Prediction }>('/predictions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.prediction
}

export async function deletePredictionApi(id: string) {
  return apiClient<{ success: boolean; message: string }>(`/predictions/${id}`, { method: 'DELETE' })
}

export async function adminDeletePredictionApi(id: string) {
  return apiClient<{ success: boolean; message: string }>(`/predictions/admin/${id}`, {
    method: 'DELETE',
  })
}
