import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'ESTUDANTE';
  aluno?: {
    id: string;
    nome: string;
    matricula: string;
    curso: string;
    telefone: string;
    transporteId?: string | null;
  } | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('orleans_transport_token');
    const savedUser = localStorage.getItem('orleans_transport_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      
      // Update profile from backend to ensure data is fresh
      api.get('/auth/profile')
        .then(res => {
          setUser(res.data.user);
          localStorage.setItem('orleans_transport_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('orleans_transport_token', newToken);
    localStorage.setItem('orleans_transport_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('orleans_transport_token');
    localStorage.removeItem('orleans_transport_user');
  };

  const refetchUser = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data.user);
      localStorage.setItem('orleans_transport_user', JSON.stringify(response.data.user));
    } catch (err) {
      console.error('Erro ao atualizar dados do usuário:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
