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
      console.log('📝 Registering with:', { ...data, password: '***' });
      const response = await api.auth.register(data);
      
      console.log('📦 Register response:', response);
      console.log('📦 Response data:', response.data);
      
      const { token, user } = response.data;

      if (!token) {
        console.error('❌ ERROR: No token in response data!');
        throw new Error('No token received from server');
      }

      console.log('✓ Registration successful, token:', token ? token.substring(0, 20) + '...' : 'null');
      localStorage.setItem('token', token);
      
      const savedToken = localStorage.getItem('token');
      console.log('✓ Token saved to localStorage, verifying:', savedToken ? 'SUCCESS' : 'FAILED');
      console.log('✓ Saved token matches:', savedToken === token ? 'YES' : 'NO');
      
      setUser(user);
      console.log('✓ User state set:', user);
      
      connectSocket(token);

      return response.data;
    } catch (err) {
      console.error('❌ Register error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
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
