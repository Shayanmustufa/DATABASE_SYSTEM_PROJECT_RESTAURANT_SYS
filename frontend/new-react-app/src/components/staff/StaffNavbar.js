// frontend/new-react-app/src/components/staff/StaffNavbar.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './StaffNavbar.css';

const StaffNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/staff/dashboard', label: '📊 Dashboard', icon: '📊' },
    { path: '/staff/orders', label: '📦 Orders', icon: '📦' },
    { path: '/staff/customers', label: '👥 Customers', icon: '👥' },
    { path: '/staff/menu-items', label: '🍕 Menu Items', icon: '🍕' },
    { path: '/staff/reservations', label: '📅 Reservations', icon: '📅' },
    { path: '/staff/staff-management', label: '👨‍💼 Staff', icon: '👨‍💼' },
    { path: '/staff/branches', label: '🏢 Branches', icon: '🏢' },
    { path: '/staff/inventory', label: '📦 Inventory', icon: '📦' },
    { path: '/staff/bills', label: '💰 Bills', icon: '💰' },
    { path: '/staff/discounts', label: '🎫 Discounts', icon: '🎫' },
    { path: '/staff/feedback', label: '⭐ Feedback', icon: '⭐' },
    { path: '/staff/suppliers', label: '🚚 Suppliers', icon: '🚚' },
    { path: '/staff/challenges', label: '🏆 Challenges', icon: '🏆' },
  ];

  return (
    <nav className="staff-navbar">
      <div className="navbar-header">
        <Link to="/staff/dashboard" className="navbar-brand">
          🍽️ Restaurant Admin
        </Link>
        <button 
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      <div className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className="menu-link">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <div className="user-details">
              <p className="user-name">{user?.name || 'Staff'}</p>
              <p className="user-role">{user?.role || 'Staff Member'}</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StaffNavbar;