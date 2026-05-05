import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { SignUpForm } from '../components/SignUpForm'

export const SignUpPageNew = () => {
  const navigate = useNavigate()
  const [displayError, setDisplayError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (_name: string, email: string, _password: string, _confirmPassword: string) => {
    setDisplayError(null)
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setTimeout(() => navigate('/verify-email', { state: { email } }), 700)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta'
      setDisplayError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setDisplayError(null)
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setTimeout(() => navigate('/dashboard'), 700)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta com Google'
      setDisplayError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout showBrandingArea={true}>
      <SignUpForm
        onSubmit={handleSignUp}
        onGoogleSignUp={handleGoogleSignUp}
        isLoading={isLoading}
        serverError={displayError}
      />
    </AuthLayout>
  )
}