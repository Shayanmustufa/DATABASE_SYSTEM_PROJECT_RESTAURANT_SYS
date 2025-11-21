import React, { useState, useEffect } from 'react';
import { customerAPI, orderAPI, menuItemAPI, reservationAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalMenuItems: 0,
    totalReservations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customers, orders, menuItems, reservations] = await Promise.all([
          customerAPI.getAll(),
          orderAPI.getAll(),
          menuItemAPI.getAll(),
          reservationAPI.getAll(),
        ]);

        setStats({
          totalCustomers: customers.data.length,
          totalOrders: orders.data.length,
          totalMenuItems: menuItems.data.length,
          totalReservations: reservations.data.length,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <h1>📊 Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ backgroundColor: '#3498db', color: 'white' }}>
          <h2>{stats.totalCustomers}</h2>
          <p>Total Customers</p>
        </div>
        <div className="card" style={{ backgroundColor: '#2ecc71', color: 'white' }}>
          <h2>{stats.totalOrders}</h2>
          <p>Total Orders</p>
        </div>
        <div className="card" style={{ backgroundColor: '#f39c12', color: 'white' }}>
          <h2>{stats.totalMenuItems}</h2>
          <p>Menu Items</p>
        </div>
        <div className="card" style={{ backgroundColor: '#e74c3c', color: 'white' }}>
          <h2>{stats.totalReservations}</h2>
          <p>Reservations</p>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Welcome to Restaurant Management System</h2>
        <p>Use the navigation menu above to manage different aspects of your restaurant.</p>
        <ul style={{ lineHeight: '2' }}>
          <li>✅ Manage Customers and their Loyalty Points</li>
          <li>✅ Create and Update Menu Items</li>
          <li>✅ Process Orders and Bills</li>
          <li>✅ Handle Reservations</li>
          <li>✅ Track Inventory and Suppliers</li>
          <li>✅ Manage Staff and Branches</li>
          <li>✅ Apply Discounts and Promotions</li>
          <li>✅ Collect Customer Feedback</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;