// frontend/new-react-app/src/pages/customer/OrderSuccessPage.js
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, billId, total } = location.state || {};

  useEffect(() => {
    // Redirect if no order data
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark">✓</div>
          </div>
        </div>

        <h1>Order Placed Successfully! 🎉</h1>
        <p className="success-message">
          Thank you for your order! We're preparing your delicious meal.
        </p>

        <div className="order-details-card">
          <h2>Order Details</h2>
          <div className="detail-row">
            <span>Order ID:</span>
            <strong>#{orderId}</strong>
          </div>
          <div className="detail-row">
            <span>Bill ID:</span>
            <strong>#{billId}</strong>
          </div>
          <div className="detail-row">
            <span>Total Amount:</span>
            <strong className="total-amount">${total?.toFixed(2)}</strong>
          </div>
          <div className="detail-row">
            <span>Status:</span>
            <span className="status-badge">Pending</span>
          </div>
        </div>

        <div className="success-info">
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Confirmation Email</h3>
            <p>We've sent a confirmation email with your order details</p>
          </div>
          <div className="info-card">
            <div className="info-icon">⏱️</div>
            <h3>Estimated Time</h3>
            <p>Your order will be ready in 30-45 minutes</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🎁</div>
            <h3>Loyalty Points</h3>
            <p>You earned {Math.floor(total / 10)} points with this order!</p>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/my-orders" className="btn-primary-large">
            View My Orders
          </Link>
          <Link to="/menu" className="btn-secondary-large">
            Order Again
          </Link>
          <Link to="/" className="btn-outline">
            Back to Home
          </Link>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>✅ Your order is being prepared by our chefs</li>
            <li>✅ You can track your order status in "My Orders"</li>
            <li>✅ You'll receive notifications about your order</li>
            <li>✅ Rate your experience after delivery</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;