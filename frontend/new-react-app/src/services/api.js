// FILE: frontend/new-react-app/src/services/api.js
// ✅ FIXED: Proper API client setup with auth headers

import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// ✅ Create axios instance with proper config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ ADD REQUEST INTERCEPTOR - Include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Auth token added to request');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ ADD RESPONSE INTERCEPTOR - Handle 401 errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expired or invalid');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// ✅ ALL API ENDPOINTS WITH ERROR HANDLING

export const customerAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/customers/');
      console.log('✅ Customers loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching customers:', error.message);
      throw error;
    }
  },
  getById: (id) => api.get(`/customers/${id}/`),
  create: (data) => api.post('/customers/', data),
  update: (id, data) => api.put(`/customers/${id}/`, data),
  delete: (id) => api.delete(`/customers/${id}/`),
};

export const branchAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/branches/');
      console.log('✅ Branches loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching branches:', error.message);
      throw error;
    }
  },
  getById: (id) => api.get(`/branches/${id}/`),
  create: (data) => api.post('/branches/', data),
  update: (id, data) => api.put(`/branches/${id}/`, data),
  delete: (id) => api.delete(`/branches/${id}/`),
};

export const staffAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/staff/');
      console.log('✅ Staff loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching staff:', error.message);
      throw error;
    }
  },
  getById: (id) => api.get(`/staff/${id}/`),
  create: (data) => api.post('/staff/', data),
  update: (id, data) => api.put(`/staff/${id}/`, data),
  delete: (id) => api.delete(`/staff/${id}/`),
};

export const menuItemAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/menu-items/');
      console.log('✅ Menu items loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching menu items:', error.message);
      throw error;
    }
  },
  getById: (id) => api.get(`/menu-items/${id}/`),
  create: (data) => api.post('/menu-items/', data),
  update: (id, data) => api.put(`/menu-items/${id}/`, data),
  delete: (id) => api.delete(`/menu-items/${id}/`),
};

export const orderAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/orders/');
      console.log('✅ Orders loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching orders:', error.message);
      throw error;
    }
  },
  getById: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/', data),
  update: (id, data) => api.put(`/orders/${id}/`, data),
  delete: (id) => api.delete(`/orders/${id}/`),
};

export const orderDetailAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/order-details/');
      console.log('✅ Order details loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching order details:', error.message);
      throw error;
    }
  },
  create: (data) => api.post('/order-details/', data),
  delete: (id) => api.delete(`/order-details/${id}/`),
};

export const billAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/bills/');
      console.log('✅ Bills loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching bills:', error.message);
      throw error;
    }
  },
  getById: (id) => api.get(`/bills/${id}/`),
  create: (data) => api.post('/bills/', data),
  update: (id, data) => api.put(`/bills/${id}/`, data),
  delete: (id) => api.delete(`/bills/${id}/`),
};

export const discountAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/discounts/');
      console.log('✅ Discounts loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching discounts:', error.message);
      throw error;
    }
  },
  getById: (id) => api.get(`/discounts/${id}/`),
  create: (data) => api.post('/discounts/', data),
  update: (id, data) => api.put(`/discounts/${id}/`, data),
  delete: (id) => api.delete(`/discounts/${id}/`),
};

export const reservationAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/reservations/');
      console.log('✅ Reservations loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching reservations:', error.message);
      throw error;
    }
  },
  getById: (id) => api.get(`/reservations/${id}/`),
  create: (data) => api.post('/reservations/', data),
  update: (id, data) => api.put(`/reservations/${id}/`, data),
  delete: (id) => api.delete(`/reservations/${id}/`),
};

export const feedbackAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/feedbacks/');
      console.log('✅ Feedbacks loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching feedbacks:', error.message);
      throw error;
    }
  },
  getById: (id) => api.get(`/feedbacks/${id}/`),
  create: (data) => api.post('/feedbacks/', data),
  update: (id, data) => api.put(`/feedbacks/${id}/`, data),
  delete: (id) => api.delete(`/feedbacks/${id}/`),
};

export const supplierAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/suppliers/');
      console.log('✅ Suppliers loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching suppliers:', error.message);
      throw error;
    }
  },
  getById: (id) => api.get(`/suppliers/${id}/`),
  create: (data) => api.post('/suppliers/', data),
  update: (id, data) => api.put(`/suppliers/${id}/`, data),
  delete: (id) => api.delete(`/suppliers/${id}/`),
};

export const foodChallengeAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/food-challenges/');
      console.log('✅ Food challenges loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching food challenges:', error.message);
      throw error;
    }
  },
  getById: (id) => api.get(`/food-challenges/${id}/`),
  create: (data) => api.post('/food-challenges/', data),
  update: (id, data) => api.put(`/food-challenges/${id}/`, data),
  delete: (id) => api.delete(`/food-challenges/${id}/`),
};

export const inventoryAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/inventory/');
      console.log('✅ Inventory loaded:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Error fetching inventory:', error.message);
      throw error;
    }
  },
  getById: (id) => api.get(`/inventory/${id}/`),
  create: (data) => api.post('/inventory/', data),
  update: (id, data) => api.put(`/inventory/${id}/`, data),
  delete: (id) => api.delete(`/inventory/${id}/`),
};

export default api;