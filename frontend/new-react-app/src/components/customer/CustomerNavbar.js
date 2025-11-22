// frontend/new-react-app/src/components/customer/CustomerNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './CustomerNavbar.css';

const CustomerNavbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();

  return (
    <nav className="customer-navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          🍽️ Restaurant
        </Link>

        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/reservations">Make Reservation</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/my-reservations">My Reservations</Link></li>
              <li><Link to="/my-orders">My Orders</Link></li>
            </>
          )}
          <li><Link to="/challenges">Challenges</Link></li>
        </ul>

        <div className="nav-actions">
          <Link to="/cart" className="cart-icon">
            🛒 Cart
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">👤 {user?.username || 'User'}</span>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-nav">Login</Link>
              <Link to="/signup" className="btn-nav btn-signup">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavbar;