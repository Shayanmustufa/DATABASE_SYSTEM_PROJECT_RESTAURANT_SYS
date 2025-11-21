// ========================================
// src/components/pages/Orders.js
// ========================================
import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getAll()
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div>
      <div className="card-header">
        <h1>📦 Orders</h1>
        <button className="btn-primary">+ Create Order</button>
      </div>
      {orders.length === 0 ? (
        <div className="card"><p>No orders found.</p></div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.OrderID}>
                <td>{order.OrderID}</td>
                <td>{new Date(order.OrderDate).toLocaleString()}</td>
                <td><span style={{padding:'0.25rem 0.75rem',borderRadius:'4px',backgroundColor:'#3498db',color:'white'}}>{order.Status}</span></td>
                <td>
                  <button className="btn-warning" style={{marginRight:'0.5rem'}}>View Details</button>
                  <button className="btn-danger">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
