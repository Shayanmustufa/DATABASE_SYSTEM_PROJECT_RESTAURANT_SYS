import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../staff.css';

const StaffDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalReservations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [orders, customers, reservations] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/orders/'),
        axios.get('http://127.0.0.1:8000/api/customers/'),
        axios.get('http://127.0.0.1:8000/api/reservations/'),
      ]);

      const pendingCount = orders.data.filter(o => 
        o.Status === 'Pending' || o.Status === 'Preparing'
      ).length;

      setStats({
        totalOrders: orders.data.length,
        pendingOrders: pendingCount,
        totalCustomers: customers.data.length,
        totalReservations: reservations.data.length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="staff-loading">Loading dashboard...</div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>📊 Staff Dashboard</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="dashboard-grid">
        <div className="stat-card pending">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Customers</h3>
            <p className="stat-value">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Reservations</h3>
            <p className="stat-value">{stats.totalReservations}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <h2>Welcome to Staff Portal 👋</h2>
        <ul>
          <li>📦 Manage Orders - View and update order statuses</li>
          <li>👥 Manage Customers - View and update customer information</li>
          <li>🍕 Manage Menu Items - Add or modify menu items</li>
          <li>📅 Manage Reservations - View and confirm reservations</li>
          <li>💰 View Bills - Check payment records</li>
          <li>📦 Inventory - Track stock levels</li>
          <li>⭐ Customer Feedback - Read reviews and ratings</li>
        </ul>
      </div>
    </div>
  );
};

export default StaffDashboard;