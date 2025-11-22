// frontend/new-react-app/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Customer Components
import CustomerNavbar from './components/customer/CustomerNavbar';
import HomePage from './pages/customer/HomePage';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import LoginPage from './pages/customer/LoginPage';
import SignupPage from './pages/customer/SignupPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderSuccessPage from './pages/customer/OrderSuccessPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import ReservationPage from './pages/customer/ReservationPage';
import MyReservationsPage from './pages/customer/MyReservationsPage';

// Staff Components
import StaffNavbar from './components/Navbar';
import Dashboard from './components/pages/Dashboard';
import Customers from './components/pages/Customers';
import MenuItems from './components/pages/MenuItems';
import Orders from './components/pages/Orders';
import Reservations from './components/pages/Reservations';
import Staff from './components/pages/Staff';
import Branches from './components/pages/Branches';
import Inventory from './components/pages/Inventory';
import Bills from './components/pages/Bills';
import Discounts from './components/pages/Discounts';
import Feedback from './components/pages/Feedback';
import Suppliers from './components/pages/Suppliers';
import Challenges from './components/pages/Challenges';

import './App.css';

// Customer Layout Component
const CustomerLayout = ({ children }) => (
  <>
    <CustomerNavbar />
    <div className="customer-content">
      {children}
    </div>
  </>
);

// Staff Layout Component
const StaffLayout = ({ children }) => (
  <>
    <StaffNavbar />
    <div className="container">
      {children}
    </div>
  </>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* ==================== CUSTOMER ROUTES ==================== */}
              <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
              <Route path="/menu" element={<CustomerLayout><MenuPage /></CustomerLayout>} />
              <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
              <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
              <Route path="/order-success" element={<CustomerLayout><OrderSuccessPage /></CustomerLayout>} />
              <Route path="/login" element={<CustomerLayout><LoginPage /></CustomerLayout>} />
              <Route path="/signup" element={<CustomerLayout><SignupPage /></CustomerLayout>} />
              <Route path="/reservations" element={<CustomerLayout><ReservationPage /></CustomerLayout>} />
              <Route path="/my-reservations" element={<CustomerLayout><MyReservationsPage /></CustomerLayout>} />
              <Route path="/challenges" element={<CustomerLayout><div><h1>Challenges - Coming Soon</h1></div></CustomerLayout>} />
              <Route path="/my-orders" element={<CustomerLayout><MyOrdersPage /></CustomerLayout>} />

              {/* ==================== STAFF ROUTES ==================== */}
              <Route path="/staff" element={<StaffLayout><Dashboard /></StaffLayout>} />
              <Route path="/staff/dashboard" element={<StaffLayout><Dashboard /></StaffLayout>} />
              <Route path="/staff/customers" element={<StaffLayout><Customers /></StaffLayout>} />
              <Route path="/staff/menu-items" element={<StaffLayout><MenuItems /></StaffLayout>} />
              <Route path="/staff/orders" element={<StaffLayout><Orders /></StaffLayout>} />
              <Route path="/staff/reservations" element={<StaffLayout><Reservations /></StaffLayout>} />
              <Route path="/staff/staff-management" element={<StaffLayout><Staff /></StaffLayout>} />
              <Route path="/staff/branches" element={<StaffLayout><Branches /></StaffLayout>} />
              <Route path="/staff/inventory" element={<StaffLayout><Inventory /></StaffLayout>} />
              <Route path="/staff/bills" element={<StaffLayout><Bills /></StaffLayout>} />
              <Route path="/staff/discounts" element={<StaffLayout><Discounts /></StaffLayout>} />
              <Route path="/staff/feedback" element={<StaffLayout><Feedback /></StaffLayout>} />
              <Route path="/staff/suppliers" element={<StaffLayout><Suppliers /></StaffLayout>} />
              <Route path="/staff/challenges-management" element={<StaffLayout><Challenges /></StaffLayout>} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;