import { useState, useCallback } from 'react'
import { User } from '../types'
import { authService } from '../services/auth.service'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(authService.getStoredUser())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authService.login(email, password)
      authService.storeUser(response)
      setUser(response)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authService.loginWithGoogle()
      authService.storeUser(response)
      setUser(response)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login com Google'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setError(null)
  }, [])

  return {
    user,
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
  }
}
