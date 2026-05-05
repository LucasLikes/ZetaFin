import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './app/providers/AuthProvider'
import { ProtectedRoute } from './app/providers/ProtectedRoute'
import { LoginPage } from './domains/auth/pages/LoginPage'
import { SignUpPageNew } from './domains/auth/pages/SignUpPageNew'
import { EmailVerificationPage } from './domains/auth/pages/EmailVerificationPage'
import { DashboardPage } from './domains/finance/pages/DashboardPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPageNew />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App