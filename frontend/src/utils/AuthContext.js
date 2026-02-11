import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../utils/api';
import { connectSocket, disconnectSocket } from '../utils/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.auth
        .getCurrentUser()
        .then((response) => {
          setUser(response.data);
          connectSocket(token);
        })
        .catch((err) => {
          console.error('Failed to fetch user:', err);
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.auth.login(email, password);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setUser(user);
      connectSocket(token);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (data) => {
    try {
      setError(null);
      const response = await api.auth.register(data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setUser(user);
      connectSocket(token);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
