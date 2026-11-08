
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import React from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'blogspace_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore existing session
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    api
      .get('/auth/me')
      .then(({ data }) => {
        if (isMounted) {
          setUser(data.user);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);

        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', {
      email: email.trim(),
      password,
    });

    if (!data.success || !data.token || !data.user) {
      throw new Error('Invalid login response.');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);

    return data.user;
  }, []);

  // Register
  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', {
      name: name.trim(),
      email: email.trim(),
      password,
    });

    if (!data.success || !data.token || !data.user) {
      throw new Error('Invalid registration response.');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);

    return data.user;
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
}
