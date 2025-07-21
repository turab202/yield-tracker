import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // Verify token validity with backend
          const { data } = await axios.get('/api/auth/verify');
          if (data.valid) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('user');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Common request handler
  const authRequest = async (url, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(url, data);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Authentication failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = (email, password) => 
    authRequest('/api/auth/login', { email, password });

  // Register function
  const register = (name, email, password) => 
    authRequest('/api/auth/register', { name, email, password });

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Optional: Add API call to invalidate token on server
    axios.post('/api/auth/logout');
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    setError // Allow manual error setting if needed
  };

  return (
    <AuthContext.Provider value={value}>
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