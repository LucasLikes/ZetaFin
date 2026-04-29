import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../app/providers/AuthProvider'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthContext()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="bg-dark-800/50 backdrop-blur-md border-b border-dark-700/50 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">ZetaFin Dashboard</h1>
            <p className="text-dark-400 text-sm">Bem-vindo, {user?.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Card */}
          <div className="bg-dark-800/50 backdrop-blur-md border border-dark-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <p className="text-dark-400 text-sm">Usuário</p>
                <p className="text-white font-semibold">{user?.name}</p>
                <p className="text-dark-500 text-sm">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Coming Soon Cards */}
          {[
            { title: 'Saldo', value: 'R$ 2.300,00' },
            { title: 'Gastos', value: 'R$ 450,00' },
            { title: 'Economia', value: 'R$ 1.850,00' },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-primary-500/10 to-secondary-600/10 backdrop-blur-md border border-primary-500/20 rounded-2xl p-6"
            >
              <p className="text-dark-400 text-sm">{card.title}</p>
              <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="mt-12 text-center p-8 rounded-2xl bg-dark-800/50 border border-dark-700/50">
          <p className="text-dark-400">
            🚀 Mais funcionalidades em breve...
          </p>
        </div>
      </main>
    </div>
  )
}
