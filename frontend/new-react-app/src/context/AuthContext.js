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
  const [userType, setUserType] = useState(null); // 'customer' or 'staff'
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUserType = localStorage.getItem('user_type');
    const userData = localStorage.getItem('user_data');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUserType(savedUserType);
      
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

  // CUSTOMER LOGIN
  const loginCustomer = async (username, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_type', 'customer');
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      try {
        const userResponse = await axios.get('http://127.0.0.1:8000/api/me/');
        const userData = userResponse.data;
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser({ username });
      }
      
      setUserType('customer');
      return { success: true };
    } catch (error) {
      console.error('Customer login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  // STAFF LOGIN (NEW)
  const loginStaff = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/staff/login/', {
        email,
        password,
      });

      if (response.data.success) {
        const { access_token, refresh_token, staff } = response.data;
        
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user_type', 'staff');
        localStorage.setItem('user_data', JSON.stringify(staff));
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        setUser(staff);
        setUserType('staff');
        
        return { success: true };
      }
    } catch (error) {
      console.error('Staff login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Staff login failed' 
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
    setUserType(null);
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (error.response?.data?.error) {
        errorMessage = Array.isArray(error.response.data.error) 
          ? error.response.data.error.join(' ')
          : error.response.data.error;
      }
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    userType,
    loading,
    loginCustomer,
    loginStaff,      // NEW
    logout,
    register,
    isAuthenticated: !!user || !!localStorage.getItem('access_token'),
    isStaff: userType === 'staff',      // NEW
    isCustomer: userType === 'customer', // NEW
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};