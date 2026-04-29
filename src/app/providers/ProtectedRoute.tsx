import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from './AuthProvider'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthContext()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}