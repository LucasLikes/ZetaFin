import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, loginWithGoogle, isLoading, error } = useAuth()
  
  const [email, setEmail] = useState('user@example.com')
  const [password, setPassword] = useState('123456')
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Erro ao fazer login')
    }
  }

  const handleGoogleLogin = async () => {
    setLoginError(null)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Erro ao fazer login com Google')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efeito de fundo com gradiente */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-600 rounded-full blur-3xl opacity-10" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Ζ</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              ZetaFin
            </span>
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-dark-800/50 backdrop-blur-md border border-dark-700/50 rounded-2xl p-8 shadow-xl shadow-dark-950/50">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bem-vindo ao ZetaFin
            </h1>
            <p className="text-dark-400">
              Controle sua vida financeira com inteligência
            </p>
          </div>

          {/* Alerts */}
          {(loginError || error) && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
              {loginError || error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-primary-500 to-secondary-600 text-white hover:shadow-lg hover:shadow-primary-500/50 active:scale-95 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-dark-800/50 text-dark-400">ou continuar com</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-lg font-semibold bg-white text-dark-900 border border-dark-200 hover:bg-dark-50 active:scale-95 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 4.5C7.305 4.5 3.359 8.446 3.359 13.141c0 2.383.986 4.541 2.588 6.103.059-.953.294-1.861.684-2.691H5.13c-.893-1.159-1.427-2.619-1.427-4.199 0-3.827 3.124-6.951 6.951-6.951 3.827 0 6.951 3.124 6.951 6.951 0 1.502-.48 2.896-1.3 4.049l1.57 1.57c1.216-1.597 1.938-3.614 1.938-5.79 0-4.695-3.946-8.641-8.641-8.641z"/>
                </svg>
                Google
              </>
            )}
          </button>

          {/* Demo Info */}
          <div className="mt-6 p-4 rounded-lg bg-dark-900/50 border border-primary-500/20">
            <p className="text-xs text-dark-400 mb-2">
              <span className="font-semibold text-primary-400">Demo:</span>
            </p>
            <p className="text-xs text-dark-500">
              Email: <span className="text-dark-300">user@example.com</span>
            </p>
            <p className="text-xs text-dark-500">
              Senha: <span className="text-dark-300">123456</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-dark-400">
          <p>
            Versão demo - Dados simulados apenas para teste
          </p>
        </div>
      </div>
    </div>
  )
}
