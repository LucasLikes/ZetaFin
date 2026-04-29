import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '../../domains/auth/hooks/useAuth'
import { AuthContextType } from '../../domains/auth/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authValue = useAuth()

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider')
  }
  return context
}
