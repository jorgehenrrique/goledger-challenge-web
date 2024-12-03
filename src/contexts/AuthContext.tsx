'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inicializa o token apenas no lado do cliente
    const storedToken = localStorage.getItem('auth-token');
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    const newToken = btoa(`${username}:${password}`);
    setToken(newToken);
    localStorage.setItem('auth-token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('auth-token');
  };

  // Não renderiza nada enquanto está carregando
  if (isLoading) return null;

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
