import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './api';
import { setRole as persistRole } from './role';

export type UserRole = 'child' | 'parent';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar_emoji: string;
  profile_image_url?: string | null;
  profile: {
    id: number;
    hero_name?: string;
    level?: number;
    xp?: number;
    streak_count?: number;
    xp_to_next_level?: number;
    level_progress_percent?: number;
  } | null;
}

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  hero_name?: string;
  age?: number;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('mb.user');
      if (storedUser) {
        try { return JSON.parse(storedUser); } catch { return null; }
      }
    }
    return null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mb.token') || null;
    }
    return null;
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const persistAuth = (t: string, u: UserProfile) => {
    localStorage.setItem('mb.token', t);
    localStorage.setItem('mb.user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    persistRole(u.role);
  };

  const clearAuth = () => {
    localStorage.removeItem('mb.token');
    localStorage.removeItem('mb.user');
    setToken(null);
    setUser(null);
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    persistAuth(res.data.token, res.data.user);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const res = await api.post('/auth/register', data);
    persistAuth(res.data.token, res.data.user);
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch {}
    clearAuth();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      localStorage.setItem('mb.user', JSON.stringify(res.data.user));
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!token, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
