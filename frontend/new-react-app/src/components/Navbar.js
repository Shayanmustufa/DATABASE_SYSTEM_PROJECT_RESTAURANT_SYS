import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🍽️ Restaurant Management System</h2>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/customers">Customers</Link></li>
        <li><Link to="/menu-items">Menu Items</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/reservations">Reservations</Link></li>
        <li><Link to="/staff">Staff</Link></li>
        <li><Link to="/branches">Branches</Link></li>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/bills">Bills</Link></li>
        <li><Link to="/discounts">Discounts</Link></li>
        <li><Link to="/feedback">Feedback</Link></li>
        <li><Link to="/suppliers">Suppliers</Link></li>
        <li><Link to="/challenges">Challenges</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;