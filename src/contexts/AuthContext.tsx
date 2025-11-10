import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  // Simplificando a interface do usuário para o nosso caso
  nome: string;
  permissoes: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ao carregar a aplicação, verifica se existe um token no localStorage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Se houver token, decodifica para obter os dados do usuário (sem validar, o backend fará isso)
      try {
        const payloadBase64 = storedToken.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        setUser({ nome: decodedPayload.nome, permissoes: decodedPayload.permissoes });
        setToken(storedToken);
      } catch (error) {
        // Se o token for inválido, limpa
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, [])

  const signIn = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Falha no login');
    }

    const { token: newAuthToken } = data;
    const payloadBase64 = newAuthToken.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    setUser({ nome: decodedPayload.nome, permissoes: decodedPayload.permissoes });
    setToken(newAuthToken);
    localStorage.setItem('authToken', newAuthToken);
  }

  const signOut = async () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
  }

  const value = {
    user,
    token,
    loading,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}