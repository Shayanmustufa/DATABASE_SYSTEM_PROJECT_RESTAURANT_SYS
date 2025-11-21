import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints for all 21 entities
export const customerAPI = {
  getAll: () => api.get('/customers/'),
  getById: (id) => api.get(`/customers/${id}/`),
  create: (data) => api.post('/customers/', data),
  update: (id, data) => api.put(`/customers/${id}/`, data),
  delete: (id) => api.delete(`/customers/${id}/`),
};

export const branchAPI = {
  getAll: () => api.get('/branches/'),
  getById: (id) => api.get(`/branches/${id}/`),
  create: (data) => api.post('/branches/', data),
  update: (id, data) => api.put(`/branches/${id}/`, data),
  delete: (id) => api.delete(`/branches/${id}/`),
};

export const staffAPI = {
  getAll: () => api.get('/staff/'),
  getById: (id) => api.get(`/staff/${id}/`),
  create: (data) => api.post('/staff/', data),
  update: (id, data) => api.put(`/staff/${id}/`, data),
  delete: (id) => api.delete(`/staff/${id}/`),
};

export const menuItemAPI = {
  getAll: () => api.get('/menu-items/'),
  getById: (id) => api.get(`/menu-items/${id}/`),
  create: (data) => api.post('/menu-items/', data),
  update: (id, data) => api.put(`/menu-items/${id}/`, data),
  delete: (id) => api.delete(`/menu-items/${id}/`),
};

export const orderAPI = {
  getAll: () => api.get('/orders/'),
  getById: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/', data),
  update: (id, data) => api.put(`/orders/${id}/`, data),
  delete: (id) => api.delete(`/orders/${id}/`),
};

export const orderDetailAPI = {
  getAll: () => api.get('/order-details/'),
  create: (data) => api.post('/order-details/', data),
  delete: (id) => api.delete(`/order-details/${id}/`),
};

export const billAPI = {
  getAll: () => api.get('/bills/'),
  getById: (id) => api.get(`/bills/${id}/`),
  create: (data) => api.post('/bills/', data),
  update: (id, data) => api.put(`/bills/${id}/`, data),
  delete: (id) => api.delete(`/bills/${id}/`),
};

export const discountAPI = {
  getAll: () => api.get('/discounts/'),
  getById: (id) => api.get(`/discounts/${id}/`),
  create: (data) => api.post('/discounts/', data),
  update: (id, data) => api.put(`/discounts/${id}/`, data),
  delete: (id) => api.delete(`/discounts/${id}/`),
};

export const reservationAPI = {
  getAll: () => api.get('/reservations/'),
  getById: (id) => api.get(`/reservations/${id}/`),
  create: (data) => api.post('/reservations/', data),
  update: (id, data) => api.put(`/reservations/${id}/`, data),
  delete: (id) => api.delete(`/reservations/${id}/`),
};

export const feedbackAPI = {
  getAll: () => api.get('/feedbacks/'),
  getById: (id) => api.get(`/feedbacks/${id}/`),
  create: (data) => api.post('/feedbacks/', data),
  update: (id, data) => api.put(`/feedbacks/${id}/`, data),
  delete: (id) => api.delete(`/feedbacks/${id}/`),
};

export const supplierAPI = {
  getAll: () => api.get('/suppliers/'),
  getById: (id) => api.get(`/suppliers/${id}/`),
  create: (data) => api.post('/suppliers/', data),
  update: (id, data) => api.put(`/suppliers/${id}/`, data),
  delete: (id) => api.delete(`/suppliers/${id}/`),
};

export const foodChallengeAPI = {
  getAll: () => api.get('/food-challenges/'),
  getById: (id) => api.get(`/food-challenges/${id}/`),
  create: (data) => api.post('/food-challenges/', data),
  update: (id, data) => api.put(`/food-challenges/${id}/`, data),
  delete: (id) => api.delete(`/food-challenges/${id}/`),
};

export const inventoryAPI = {
  getAll: () => api.get('/inventory/'),
  getById: (id) => api.get(`/inventory/${id}/`),
  create: (data) => api.post('/inventory/', data),
  update: (id, data) => api.put(`/inventory/${id}/`, data),
  delete: (id) => api.delete(`/inventory/${id}/`),
};

export default api;