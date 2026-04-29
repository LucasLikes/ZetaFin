import { User } from '../types'

// Mock data
const mockUsers = {
  'user@example.com': {
    id: '1',
    email: 'user@example.com',
    name: 'Lucas Silva',
    avatar: 'https://i.pravatar.cc/150?img=1',
    password: '123456',
  },
  'test@test.com': {
    id: '2',
    email: 'test@test.com',
    name: 'Test User',
    avatar: 'https://i.pravatar.cc/150?img=2',
    password: '123456',
  },
}

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simular delay de requisição
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers[email as keyof typeof mockUsers]
        
        if (user && user.password === password) {
          const { password: _, ...userWithoutPassword } = user
          resolve(userWithoutPassword)
        } else {
          reject(new Error('Email ou senha incorretos'))
        }
      }, 1000)
    })
  },

  loginWithGoogle: async (): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '3',
          email: 'google.user@gmail.com',
          name: 'Google User',
          avatar: 'https://i.pravatar.cc/150?img=3',
        })
      }, 1500)
    })
  },

  logout: (): void => {
    localStorage.removeItem('user')
  },

  getStoredUser: (): User | null => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  },

  storeUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user))
  },
}
