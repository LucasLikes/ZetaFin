import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from './AuthProvider'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthContext()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
