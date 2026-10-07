import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { loginApi, registerApi, demoLoginApi, getCurrentUserApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<void>;
  loginDemo: (role: 'user' | 'admin') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('cinebook_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Optionally re-validate token on load
    const token = localStorage.getItem('cinebook_auth_token');
    if (token && !user) {
      getCurrentUserApi()
        .then(res => {
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('cinebook_auth_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          localStorage.removeItem('cinebook_auth_token');
          localStorage.removeItem('cinebook_auth_user');
        });
    }
  }, [user]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await loginApi(email, pass);
      setUser(res.user);
      if (res.user.token) {
        localStorage.setItem('cinebook_auth_token', res.user.token);
      }
      localStorage.setItem('cinebook_auth_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    setIsLoading(true);
    try {
      const res = await registerApi(name, email, pass, phone);
      setUser(res.user);
      if (res.user.token) {
        localStorage.setItem('cinebook_auth_token', res.user.token);
      }
      localStorage.setItem('cinebook_auth_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async (role: 'user' | 'admin') => {
    setIsLoading(true);
    try {
      const res = await demoLoginApi(role);
      setUser(res.user);
      if (res.user.token) {
        localStorage.setItem('cinebook_auth_token', res.user.token);
      }
      localStorage.setItem('cinebook_auth_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cinebook_auth_token');
    localStorage.removeItem('cinebook_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        loginDemo,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
