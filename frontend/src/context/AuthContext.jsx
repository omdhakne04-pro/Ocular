import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ocular_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('ocular_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyUserSession() {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('ocular_user', JSON.stringify(res.user));
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired, auto-refreshing demo session:', err.message);
        }
      }

      // Automatically initialize demo session so guests & judges can immediately use the camera scanner
      try {
        await quickDemoLogin();
      } catch (err) {
        console.warn('[AuthContext] Auto-login fallback error:', err.message);
      } finally {
        setLoading(false);
      }
    }

    verifyUserSession();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('ocular_token', res.token);
      localStorage.setItem('ocular_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('ocular_token', res.token);
      localStorage.setItem('ocular_user', JSON.stringify(res.user));
    }
    return res;
  };

  // Demo 1-Click Access for Hackathon Judges & Evaluators
  const quickDemoLogin = async () => {
    const demoEmail = 'judge.ocular@hackathon.ai';
    const demoPass = 'OcularDemo2026!';
    try {
      return await login(demoEmail, demoPass);
    } catch {
      // If demo account doesn't exist yet, auto-register it!
      return await register('Hackathon Judge', demoEmail, demoPass);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ocular_token');
    localStorage.removeItem('ocular_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        quickDemoLogin,
        logout,
      }}
    >
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
