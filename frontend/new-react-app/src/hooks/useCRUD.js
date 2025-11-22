// frontend/new-react-app/src/hooks/useCRUD.js

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const useCRUD = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getToken = () => localStorage.getItem('access_token');

  const config = {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    }
  };

  // READ - Get all
  const fetchAll = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/${endpoint}/`, config);
      setData(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // READ - Get by ID
  const fetchById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${endpoint}/${id}/`, config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch item');
      return null;
    }
  };

  // CREATE
  const create = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${endpoint}/`, formData, config);
      setData([...data, response.data]);
      setSuccess('Item created successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || JSON.stringify(err.response?.data) || 'Failed to create';
      setError(errorMsg);
      console.error('Create error:', err);
      return { success: false, error: errorMsg };
    }
  };

  // UPDATE
  const update = async (id, formData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${endpoint}/${id}/`, formData, config);
      setData(data.map(item => {
        const idKey = Object.keys(item).find(key => key.includes('ID'));
        return item[idKey] === id ? response.data : item;
      }));
      setSuccess('Item updated successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || JSON.stringify(err.response?.data) || 'Failed to update';
      setError(errorMsg);
      console.error('Update error:', err);
      return { success: false, error: errorMsg };
    }
  };

  // DELETE
  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${endpoint}/${id}/`, config);
      setData(data.filter(item => {
        const idKey = Object.keys(item).find(key => key.includes('ID'));
        return item[idKey] !== id;
      }));
      setSuccess('Item deleted successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete';
      setError(errorMsg);
      console.error('Delete error:', err);
      return { success: false, error: errorMsg };
    }
  };

  useEffect(() => {
    fetchAll();
  }, [endpoint]);

  return {
    data,
    setData,
    loading,
    error,
    setError,
    success,
    setSuccess,
    fetchAll,
    fetchById,
    create,
    update,
    deleteItem
  };
};