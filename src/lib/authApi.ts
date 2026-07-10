import { API_BASE_URL } from '../config/api'

export interface PublicUser {
  userId: string
  rollNumber: string
  fullName: string
  department: string
  year: string
  role?: 'student' | 'admin'
  status?: string
  totalPoints?: number
  rank?: number
  predictionsSubmitted?: number
  correctWinnerPredictions?: number
  exactScorePredictions?: number
}

export interface RegisterData {
  fullName: string
  rollNumber: string
  department: string
  year: string
  password: string
}

interface ApiUser {
  id: string
  fullName: string
  rollNumber: string
  department: string
  semester: string
  role?: 'student' | 'admin'
  totalPoints?: number
  rank?: number
  predictionsSubmitted?: number
  correctWinnerPredictions?: number
  exactScorePredictions?: number
}

interface ApiResponse {
  success: boolean
  message?: string
  token?: string
  user?: ApiUser
}

const SESSION_KEY = 'fifa_session'
const TOKEN_KEY = 'fifa_token'

function getTokenUserId(token: string): string | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const decoded = JSON.parse(atob(payload)) as {
      userId?: string
      id?: string
      exp?: number
    }
    const userId = decoded.userId ?? decoded.id

    if (typeof userId !== 'string' || userId.length === 0) {
      return null
    }

    if (typeof decoded.exp === 'number' && decoded.exp * 1000 <= Date.now()) {
      return null
    }

    return userId
  } catch {
    return null
  }
}

export function isStoredTokenValid(): boolean {
  const token = getToken()
  return getTokenUserId(token ?? '') !== null
}

function mapApiUser(user: ApiUser): PublicUser {
  return {
    userId: user.id,
    rollNumber: user.rollNumber,
    fullName: user.fullName,
    department: user.department,
    year: user.semester,
    role: user.role === 'admin' ? 'admin' : 'student',
    totalPoints: user.totalPoints,
    rank: user.rank,
    predictionsSubmitted: user.predictionsSubmitted,
    correctWinnerPredictions: user.correctWinnerPredictions,
    exactScorePredictions: user.exactScorePredictions,
  }
}

async function apiRequest<T extends ApiResponse>(
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

  const data = (await response.json()) as T

  if (!response.ok && !data.message) {
    throw new Error('Request failed.')
  }

  return data
}

export function saveSession(user: PublicUser, token?: string): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export function getStoredSession(): PublicUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PublicUser
    return parsed?.rollNumber ? parsed : null
  } catch {
    return null
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

export async function apiRegister(
  data: RegisterData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const result = await apiRequest<ApiResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName: data.fullName.trim(),
        rollNumber: data.rollNumber.trim(),
        department: data.department.trim(),
        semester: data.year.trim(),
        password: data.password,
      }),
    })

    if (!result.success) {
      return { ok: false, error: result.message ?? 'Registration failed.' }
    }

    return { ok: true }
  } catch {
    return { ok: false, error: 'Network error. Please try again.' }
  }
}

export async function apiLogin(
  rollNumber: string,
  password: string,
): Promise<{ ok: true; user: PublicUser; token: string } | { ok: false; error: string }> {
  try {
    const result = await apiRequest<ApiResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        rollNumber: rollNumber.trim(),
        password,
      }),
    })

    if (!result.success || !result.user || !result.token) {
      return {
        ok: false,
        error: result.message ?? 'Invalid roll number or password.',
      }
    }

    return { ok: true, user: mapApiUser(result.user), token: result.token }
  } catch {
    return { ok: false, error: 'Network error. Please try again.' }
  }
}

export async function apiGetMe(): Promise<
  { ok: true; user: PublicUser } | { ok: false; error: string }
> {
  const token = getToken()

  if (!token || !getTokenUserId(token)) {
    return { ok: false, error: 'Session expired.' }
  }

  try {
    const result = await apiRequest<ApiResponse>('/auth/me')

    if (!result.success || !result.user) {
      return { ok: false, error: result.message ?? 'Session expired.' }
    }

    return { ok: true, user: mapApiUser(result.user) }
  } catch {
    return { ok: false, error: 'Network error. Please try again.' }
  }
}

export async function apiUpdateMe(fullName: string): Promise<
  { ok: true; user: PublicUser } | { ok: false; error: string }
> {
  const token = getToken()

  if (!token || !getTokenUserId(token)) {
    return { ok: false, error: 'Session expired.' }
  }

  try {
    const result = await apiRequest<ApiResponse>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify({ fullName }),
    })

    if (!result.success || !result.user) {
      return { ok: false, error: result.message ?? 'Failed to update profile.' }
    }

    return { ok: true, user: mapApiUser(result.user) }
  } catch {
    return { ok: false, error: 'Network error. Please try again.' }
  }
}
