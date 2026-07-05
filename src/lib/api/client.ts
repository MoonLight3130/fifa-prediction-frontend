import { API_BASE_URL } from '../../config/api'
import { getToken } from '../authApi'

export interface ApiResponse {
  success: boolean
  message?: string
  [key: string]: unknown
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = (await response.json()) as T & { success?: boolean; message?: string }

  if (!response.ok) {
    throw new Error(data.message ?? 'Request failed.')
  }

  return data
}
