import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for mock user in localStorage
    const mockUser = localStorage.getItem('mockUser')
    if (mockUser) {
      setUser(JSON.parse(mockUser))
    }
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string) => {
    // Mock signup - just simulate success
    const mockUser = { id: '1', email, aud: 'authenticated', role: 'authenticated' } as User
    setUser(mockUser)
    localStorage.setItem('mockUser', JSON.stringify(mockUser))
  }

  const signIn = async (email: string, password: string) => {
    // Mock signin - accept any email/password
    const mockUser = { id: '1', email, aud: 'authenticated', role: 'authenticated' } as User
    setUser(mockUser)
    localStorage.setItem('mockUser', JSON.stringify(mockUser))
  }

  const signOut = async () => {
    // Mock signout - just clear state
    setUser(null)
    localStorage.removeItem('mockUser')
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}