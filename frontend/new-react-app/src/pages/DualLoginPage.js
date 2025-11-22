// frontend/new-react-app/src/pages/DualLoginPage.js (NEW FILE)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/dual-login.css';

const DualLoginPage = () => {
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'staff'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginCustomer, loginStaff } = useAuth();
  const navigate = useNavigate();

  // Customer Login State
  const [customerForm, setCustomerForm] = useState({
    username: '',
    password: ''
  });

  // Staff Login State
  const [staffForm, setStaffForm] = useState({
    email: '',
    password: ''
  });

  const handleCustomerChange = (e) => {
    setCustomerForm({
      ...customerForm,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleStaffChange = (e) => {
    setStaffForm({
      ...staffForm,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!customerForm.username || !customerForm.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await loginCustomer(customerForm.username, customerForm.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!staffForm.email || !staffForm.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await loginStaff(staffForm.email, staffForm.password);
    
    if (result.success) {
      navigate('/staff/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="dual-login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Login Type Tabs */}
          <div className="login-tabs">
            <button 
              className={`tab-btn ${activeTab === 'customer' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('customer');
                setError('');
              }}
            >
              🍽️ Customer Login
            </button>
            <button 
              className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('staff');
                setError('');
              }}
            >
              👨‍💼 Staff Login
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="login-error">{error}</div>}

          {/* Customer Login Form */}
          {activeTab === 'customer' && (
            <form onSubmit={handleCustomerLogin} className="login-form">
              <h2>Welcome Back! 👋</h2>
              <p>Login to your customer account</p>

              <div className="form-group">
                <label htmlFor="cust-username">Username or Email</label>
                <input
                  type="text"
                  id="cust-username"
                  name="username"
                  value={customerForm.username}
                  onChange={handleCustomerChange}
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cust-password">Password</label>
                <input
                  type="password"
                  id="cust-password"
                  name="password"
                  value={customerForm.password}
                  onChange={handleCustomerChange}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login 🚀'}
              </button>

              <div className="demo-section">
                <p>Demo Credentials:</p>
                <small>Username: customer1</small>
                <small>Password: password123</small>
              </div>
            </form>
          )}

          {/* Staff Login Form */}
          {activeTab === 'staff' && (
            <form onSubmit={handleStaffLogin} className="login-form">
              <h2>Staff Portal 👨‍💼</h2>
              <p>Login to your staff account</p>

              <div className="form-group">
                <label htmlFor="staff-email">Email</label>
                <input
                  type="email"
                  id="staff-email"
                  name="email"
                  value={staffForm.email}
                  onChange={handleStaffChange}
                  placeholder="staff@restaurant.com"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="staff-password">Password</label>
                <input
                  type="password"
                  id="staff-password"
                  name="password"
                  value={staffForm.password}
                  onChange={handleStaffChange}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>

              <button 
                type="submit" 
                className="login-btn staff-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login to Dashboard 📊'}
              </button>

              <div className="demo-section">
                <p>Demo Credentials:</p>
                <small>Email: staff1@example.com</small>
                <small>Password: password123</small>
              </div>
            </form>
          )}
        </div>

        <div className="login-features">
          <h2>🎯 Choose Your Role</h2>
          <div className="features-list">
            <div className="feature">
              <h3>🍽️ Customer</h3>
              <ul>
                <li>Browse menu</li>
                <li>Place orders</li>
                <li>Make reservations</li>
                <li>Track orders</li>
              </ul>
            </div>
            <div className="feature">
              <h3>👨‍💼 Staff</h3>
              <ul>
                <li>Manage orders</li>
                <li>Update inventory</li>
                <li>View reservations</li>
                <li>Process payments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualLoginPage;