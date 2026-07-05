import { apiClient } from './client'
import type { AppSettings } from './types'

export async function fetchSettings() {
  const data = await apiClient<{ success: boolean; settings: AppSettings }>('/settings')
  return data.settings
}

export async function updateSettings(payload: Partial<AppSettings>) {
  const data = await apiClient<{ success: boolean; settings: AppSettings }>('/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return data.settings
}
