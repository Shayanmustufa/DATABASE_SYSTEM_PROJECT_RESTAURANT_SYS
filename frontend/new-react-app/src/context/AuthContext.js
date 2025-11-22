// frontend/new-react-app/src/context/AuthContext.js
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
    const userData = localStorage.getItem('user_data');
    
    if (token) {
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsStaff(userType === 'staff');
      
      // Set user data if available
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password, type = 'customer') => {
    try {
      // Get JWT tokens
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
      
      // Fetch user details
      try {
        const userResponse = await axios.get('http://127.0.0.1:8000/api/me/');
        const userData = userResponse.data;
        
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Still allow login even if user data fetch fails
        setUser({ username });
      }
      
      setIsStaff(type === 'staff');
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_data');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsStaff(false);
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different error formats
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.error) {
        if (Array.isArray(error.response.data.error)) {
          errorMessage = error.response.data.error.join(' ');
        } else {
          errorMessage = error.response.data.error;
        }
      }
      
      return { 
        success: false, 
        error: errorMessage
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