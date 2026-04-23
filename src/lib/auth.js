'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { users } from './data';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved session
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('lamasia_user');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          localStorage.removeItem('lamasia_user');
        }
      }
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = (email, password) => {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const userData = { id: found.id, name: found.name, email: found.email, role: found.role };
      setUser(userData);
      localStorage.setItem('lamasia_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'Email atau password salah' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lamasia_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
