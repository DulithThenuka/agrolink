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

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    };

    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        setToken(null);
        setUser(null);
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      if (res && res.data) {
        const jwtToken = res.data.accessToken || res.data.token;
        const userEmail = res.data.email || email;
        const userName = res.data.name || res.data.fullName || (userEmail ? userEmail.split('@')[0] : 'User');
        const userLocation = res.data.location || '';
        const role = res.data.role;
        const userId = res.data.id || res.data.userId;
        const userData = {
          id: userId,
          email: userEmail,
          name: userName,
          location: userLocation,
          role,
        };
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, role };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: typeof err === 'string' ? err : 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const register = async (name, email, password, location, role = 'BUYER') => {
    setLoading(true);
    try {
      const res = await authAPI.register({ name, email, password, location, role });
      if (res && (res.success || res.data)) {
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
  const isBusinessBuyer = user?.role === 'BUSINESS_BUYER' || user?.role === 'ROLE_BUSINESS_BUYER';
  const isLogistics = user?.role === 'LOGISTICS' || user?.role === 'ROLE_LOGISTICS' || user?.role === 'LOGISTICS_PROVIDER' || user?.role === 'ROLE_LOGISTICS_PROVIDER';
  const isLogisticsProvider = isLogistics;
  const isExpert = user?.role === 'EXPERT' || user?.role === 'ROLE_EXPERT' || user?.role === 'AGRICULTURAL_EXPERT' || user?.role === 'ROLE_AGRICULTURAL_EXPERT';
  const isAgriculturalExpert = isExpert;
  const isSupplier = user?.role === 'SUPPLIER' || user?.role === 'ROLE_SUPPLIER';
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
        isBusinessBuyer,
        isLogistics,
        isLogisticsProvider,
        isExpert,
        isAgriculturalExpert,
        isSupplier,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
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
