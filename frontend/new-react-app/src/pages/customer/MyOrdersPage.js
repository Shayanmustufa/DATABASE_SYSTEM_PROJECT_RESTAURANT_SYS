// frontend/new-react-app/src/pages/customer/MyOrdersPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate]);

  const fetchMyOrders = async () => {
    try {
      // Get all order-customer relationships for this customer
      const orderCustomerRes = await axios.get('http://127.0.0.1:8000/api/order-customers/');
      const myOrderRels = orderCustomerRes.data.filter(
        rel => rel.CustomerID === user.customerId
      );

      // Get full order details for each order
      const ordersData = await Promise.all(
        myOrderRels.map(async (rel) => {
          const orderRes = await axios.get(`http://127.0.0.1:8000/api/orders/${rel.OrderID}/`);
          const order = orderRes.data;

          // Get order details (items)
          const orderDetailsRes = await axios.get('http://127.0.0.1:8000/api/order-details/');
          const orderItems = orderDetailsRes.data.filter(
            detail => detail.OrderID === order.OrderID
          );

          // Get menu item details for each order item
          const itemsWithDetails = await Promise.all(
            orderItems.map(async (item) => {
              const menuItemRes = await axios.get(
                `http://127.0.0.1:8000/api/menu-items/${item.MenuItemID}/`
              );
              return {
                ...item,
                menuItem: menuItemRes.data
              };
            })
          );

          // Get bill information
          let bill = null;
          try {
            const billsRes = await axios.get('http://127.0.0.1:8000/api/bills/');
            bill = billsRes.data.find(b => b.OrderID === order.OrderID);
          } catch (err) {
            console.error('Error fetching bill:', err);
          }

          return {
            ...order,
            items: itemsWithDetails,
            bill
          };
        })
      );

      // Sort by date (newest first)
      ordersData.sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate));
      
      setOrders(ordersData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffd93d',
      'Preparing': '#4ecdc4',
      'Ready': '#95e1d3',
      'Delivered': '#27ae60',
      'Cancelled': '#e74c3c'
    };
    return colors[status] || '#636e72';
  };

  const calculateOrderTotal = (bill) => {
    if (!bill) return 0;
    return parseFloat(bill.TotalBeforeDiscount) - parseFloat(bill.DiscountAmount) + parseFloat(bill.TaxAmount);
  };

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="orders-header">
          <div className="container">
            <h1>My Orders</h1>
          </div>
        </div>
        <div className="container">
          <div className="loading">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="orders-header">
        <div className="container">
          <h1>My Orders 📦</h1>
          <p>Track and manage your orders</p>
        </div>
      </div>

      <div className="container">
        {error && (
          <div className="error-message">{error}</div>
        )}

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">🍽️</div>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet. Start ordering delicious food!</p>
            <button onClick={() => navigate('/menu')} className="btn-order-now">
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.OrderID} className="order-card">
                <div className="order-header-row">
                  <div className="order-info">
                    <h3>Order #{order.OrderID}</h3>
                    <p className="order-date">
                      {new Date(order.OrderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.Status) }}
                    >
                      {order.Status}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-emoji">
                        {getCategoryEmoji(item.menuItem.Category)}
                      </span>
                      <div className="item-details">
                        <strong>{item.menuItem.Name}</strong>
                        <span className="item-quantity">x{item.Quantity}</span>
                      </div>
                      <span className="item-price">
                        ${(parseFloat(item.menuItem.Price) * item.Quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <strong>${order.bill ? calculateOrderTotal(order.bill).toFixed(2) : '0.00'}</strong>
                  </div>
                  <div className="order-actions">
                    <button className="btn-reorder">Reorder</button>
                    <button className="btn-details">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <div className="orders-summary">
            <h3>Order Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-value">{orders.length}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-value">
                  {orders.filter(o => o.Status === 'Delivered').length}
                </div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-value">
                  {orders.filter(o => o.Status === 'Pending' || o.Status === 'Preparing').length}
                </div>
                <div className="stat-label">In Progress</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function
const getCategoryEmoji = (category) => {
  const emojiMap = {
    'Appetizer': '🥗',
    'Main Course': '🍝',
    'Dessert': '🍰',
    'Drinks': '🥤',
    'Pizza': '🍕',
    'Burger': '🍔',
  };
  return emojiMap[category] || '🍽️';
};

export default MyOrdersPage;