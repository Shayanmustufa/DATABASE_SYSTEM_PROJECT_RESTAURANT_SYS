import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userType = localStorage.getItem('user_type');
    
    if (token) {
      // Verify token is valid
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsStaff(userType === 'staff');
      // You could fetch user details here
    }
    setLoading(false);
  }, []);

  const login = async (username, password, type = 'customer') => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
      
      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_type', type);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      setUser({ username });
      setIsStaff(type === 'staff');
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsStaff(false);
  };

  const register = async (userData) => {
    try {
      // You'll need to create a registration endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  };

  const value = {
    user,
    isStaff,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user || !!localStorage.getItem('access_token'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};