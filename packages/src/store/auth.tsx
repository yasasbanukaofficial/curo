import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '../types/index.js';
import { setToken, clearAll, getToken, setUserEmail, getUserEmail } from '../services/token.js';
import { login as apiLogin, getMe } from '../api/auth.js';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    setToken(result.accessToken);
    setUserEmail(result.email);
    setTokenState(result.accessToken);
    setUser({ _id: result.id, email: result.email, name: result.name });
  }, []);

  const logout = useCallback(() => {
    clearAll();
    setTokenState(null);
    setUser(null);
  }, []);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    const storedToken = getToken();
    if (!storedToken) {
      setIsLoading(false);
      return false;
    }
    setTokenState(storedToken);
    try {
      const userData = await getMe();
      setUser(userData);
      setUserEmail(userData.email);
      setIsLoading(false);
      return true;
    } catch {
      clearAll();
      setTokenState(null);
      setUser(null);
      setIsLoading(false);
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used within AuthProvider');
  return ctx;
}
