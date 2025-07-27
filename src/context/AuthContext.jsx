// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/axios'; // Make sure this path is correct

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- ADDITION: State for dashboard refresh signal ---
  const [dashboardRefreshSignal, setDashboardRefreshSignal] = useState(0);
  // --- END ADDITION ---

  // --- ADDITION: Function to trigger dashboard refresh ---
  const triggerDashboardRefresh = () => {
    console.log("Auth Context: Triggering dashboard refresh"); // Debug log
    setDashboardRefreshSignal(prev => prev + 1);
  };
  // --- END ADDITION ---

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
          // Verify token validity with backend
          const { data } = await axios.get('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          });

          if (data.valid) {
            setUser(JSON.parse(savedUser));
          } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
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
      localStorage.setItem('token', response.data.token); // Save token
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
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
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Reset signal on logout
      setDashboardRefreshSignal(0);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    setError, // Allow manual error setting if needed
    // --- ADDITION: Expose the new signal and trigger function ---
    dashboardRefreshSignal,
    triggerDashboardRefresh
    // --- END ADDITION ---
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