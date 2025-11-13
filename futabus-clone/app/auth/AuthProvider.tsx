'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = { id: string; name: string; email: string };
type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};
const AuthContext = createContext<AuthCtx | null>(null);
const STORAGE_KEY = 'mock_auth_user_v1';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login = async (email: string, password: string) => {
    // Chế độ demo: chấp nhận mọi email/password
    // (để chặt chẽ hơn, đổi acceptAny=false và kiểm tra cặp demo dưới)
    const acceptAny = true;
    const ok = acceptAny || (
      email.trim().toLowerCase() === 'demo@futa.vn' && password === '123456'
    );
    if (!ok) return false;

    const mockUser: User = {
      id: 'u_demo_001',
      name: email.split('@')[0] || 'Người dùng',
      email,
    };
    setUser(mockUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
