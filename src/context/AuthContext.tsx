import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  apiGetMe,
  apiLogin,
  apiRegister,
  clearSession,
  getStoredSession,
  getToken,
  isStoredTokenValid,
  saveSession,
  type PublicUser,
  type RegisterData,
} from '../lib/authApi'

export type { PublicUser, RegisterData }

interface AuthContextValue {
  user: PublicUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (
    rollNumber: string,
    password: string,
  ) => Promise<{ ok: true; user: PublicUser } | { ok: false; error: string }>
  register: (data: RegisterData) => Promise<
    { ok: true; user?: PublicUser } | { ok: false; error: string }
  >
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      const stored = getStoredSession()
      const token = getToken()

      if (!stored || !token || !isStoredTokenValid()) {
        clearSession()
        setIsLoading(false)
        return
      }

      const result = await apiGetMe()

      if (result.ok) {
        setUser(result.user)
        saveSession(result.user, token)
      } else {
        clearSession()
      }

      setIsLoading(false)
    }

    restoreSession()
  }, [])

  const login = useCallback(async (rollNumber: string, password: string) => {
    const result = await apiLogin(rollNumber, password)
    if (!result.ok) return result

    saveSession(result.user, result.token)
    setUser(result.user)
    return { ok: true as const, user: result.user }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    const registerResult = await apiRegister(data)
    if (!registerResult.ok) return registerResult

    const loginResult = await apiLogin(data.rollNumber, data.password)
    if (!loginResult.ok) {
      return {
        ok: false as const,
        error: 'Account created but auto-login failed. Please log in manually.',
      }
    }

    saveSession(loginResult.user, loginResult.token)
    setUser(loginResult.user)
    return { ok: true as const, user: loginResult.user }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'admin',
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
