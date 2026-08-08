import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      if (res && res.data) {
        const { token: jwtToken, email: userEmail, role } = res.data;
        const userData = { email: userEmail, role };
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: typeof err === 'string' ? err : 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, location) => {
    setLoading(true);
    try {
      const res = await authAPI.register({ name, email, password, location });
      if (res && res.status === 'SUCCESS') {
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: typeof err === 'string' ? err : 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      authAPI.logout();
    } catch (err) {
      console.error(err);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isFarmer = user?.role === 'FARMER' || user?.role === 'ROLE_FARMER';
  const isBuyer = user?.role === 'BUYER' || user?.role === 'ROLE_BUYER';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isFarmer,
        isBuyer,
        isAdmin,
        login,
        register,
        logout,
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
