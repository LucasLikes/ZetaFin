import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { AuthLayout } from '../components/AuthLayout'
import { LoginForm } from '../components/LoginForm'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, loginWithGoogle, isLoading, error } = useAuthContext()
  const [displayError, setDisplayError] = useState<string | null>(null)

  const handleLogin = async (email: string, password: string) => {
    setDisplayError(null)
    try {
      await login(email, password)
      // Navigation happens in the auth context or provider
      setTimeout(() => navigate('/dashboard'), 700)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
      setDisplayError(errorMessage)
    }
  }

  const handleGoogleLogin = async () => {
    setDisplayError(null)
    try {
      await loginWithGoogle()
      setTimeout(() => navigate('/dashboard'), 700)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login com Google'
      setDisplayError(errorMessage)
    }
  }

  return (
    <AuthLayout showBrandingArea={true}>
      <LoginForm
        onSubmit={handleLogin}
        onGoogleLogin={handleGoogleLogin}
        isLoading={isLoading}
        serverError={displayError || error}
      />
    </AuthLayout>
  )
}