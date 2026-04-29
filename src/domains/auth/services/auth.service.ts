import type { User } from '../types';

const mockUsers: Record<string, { id: string; email: string; name: string; avatar: string; password: string }> = {
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
    name: 'Ana Martins',
    avatar: 'https://i.pravatar.cc/150?img=5',
    password: '123456',
  },
}

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers[email]
        if (user && user.password === password) {
          const { password: _p, ...userWithoutPassword } = user
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
      }, 1200)
    })
  },

  logout: (): void => {
    localStorage.removeItem('zetafin_user')
  },

  getStoredUser: (): User | null => {
    try {
      const stored = localStorage.getItem('zetafin_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  },

  storeUser: (user: User): void => {
    localStorage.setItem('zetafin_user', JSON.stringify(user))
  },
}