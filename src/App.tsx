import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './app/providers/AuthProvider'
import { ProtectedRoute } from './app/providers/ProtectedRoute'
import { LoginPage } from './domains/auth/pages/LoginPage'
import { SignUpPageNew } from './domains/auth/pages/SignUpPageNew'
import { EmailVerificationPage } from './domains/auth/pages/EmailVerificationPage'
import { DashboardPage } from './domains/finance/pages/DashboardPage'
import { InsightsPage } from './domains/finance/pages/InsightsPageThemed'
import { ThemeProvider } from './app/providers/ThemeProvider'

function App() {
  return (
    <Router>
      <ThemeProvider>
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
            <Route
              path="/insights"
              element={<InsightsPage />}
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App