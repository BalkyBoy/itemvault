'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  clearTokens,
  getCurrentUser,
  registerUser,
  saveTokens,
} from '@/lib/api';
import type { AuthUser, RegisterDto } from '@/lib/types';


interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  
  getCurrentUser: () => Promise<void>;
  login: (accessToken: string, refreshToken: string | null, user: AuthUser) => void;
}



const AuthContext = createContext<AuthContextValue | null>(null);



export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) { setLoading(false); return; }

  
      const cached = localStorage.getItem('authUser');
      if (cached) {
        try { setUser(JSON.parse(cached)); } catch { /* ignore */ }
      }

      // Validate token against the server
      try {
        const freshUser = await getCurrentUser();
        localStorage.setItem('authUser', JSON.stringify(freshUser));
        setUser(freshUser);
      } catch {
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  const login = useCallback(
    (accessToken: string, refreshToken: string | null, user: AuthUser) => {
      saveTokens(accessToken, refreshToken ?? undefined);
      localStorage.setItem('authUser', JSON.stringify(user));
      setUser(user);
    },
    []
  );

  const register = useCallback(async (data: RegisterDto) => {
    const result = await registerUser(data);
    login(result.tokens.accessToken, result.tokens.refreshToken, result.user);
  }, [login]);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    try {
      const freshUser = await getCurrentUser();
      localStorage.setItem('authUser', JSON.stringify(freshUser));
      setUser(freshUser);
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        register,
        logout,
        getCurrentUser: refreshCurrentUser,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
