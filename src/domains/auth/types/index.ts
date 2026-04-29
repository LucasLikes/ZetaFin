export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}
