/ FILE 1: Fix App.js
// Location: frontend/new-react-app/src/App.js
// ========================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Auth
import DualLoginPage from './pages/DualLoginPage';
import SignupPage from './pages/customer/SignupPage';

// Customer Components
import CustomerNavbar from './components/customer/CustomerNavbar';
import HomePage from './pages/customer/HomePage';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderSuccessPage from './pages/customer/OrderSuccessPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import ReservationPage from './pages/customer/ReservationPage';
import MyReservationsPage from './pages/customer/MyReservationsPage';

// Staff Components
import StaffNavbar from './components/staff/StaffNavbar';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffOrders from './pages/staff/StaffOrders';
import StaffCustomers from './pages/staff/StaffCustomers';
import StaffMenuItems from './pages/staff/StaffMenuItems';
import StaffReservations from './pages/staff/StaffReservations';
import StaffStaff from './pages/staff/StaffStaff';
import StaffBranches from './pages/staff/StaffBranches';
import StaffInventory from './pages/staff/StaffInventory';
import StaffBills from './pages/staff/StaffBills';
import StaffDiscounts from './pages/staff/StaffDiscounts';
import StaffFeedback from './pages/staff/StaffFeedback';
import StaffSuppliers from './pages/staff/StaffSuppliers';
import StaffChallenges from './pages/staff/StaffChallenges';

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
    <div className="staff-container">
      {children}
    </div>
  </>
);

// Protected Customer Route
const ProtectedCustomerRoute = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  
  if (!isAuthenticated || !isCustomer) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Protected Staff Route
const ProtectedStaffRoute = ({ children }) => {
  const { isAuthenticated, isStaff } = useAuth();
  
  if (!isAuthenticated || !isStaff) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// App Routes Component
function AppRoutes() {
  const { isAuthenticated, isStaff } = useAuth();

  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route path="/login" element={<DualLoginPage />} />
      <Route 
        path="/signup" 
        element={<CustomerLayout><SignupPage /></CustomerLayout>} 
      />

      {/* ==================== CUSTOMER ROUTES ==================== */}
      <Route 
        path="/" 
        element={
          isAuthenticated && isStaff ? (
            <Navigate to="/staff/dashboard" replace />
          ) : (
            <CustomerLayout><HomePage /></CustomerLayout>
          )
        } 
      />
      
      <Route 
        path="/menu" 
        element={<CustomerLayout><MenuPage /></CustomerLayout>} 
      />
      
      <Route 
        path="/cart" 
        element={<CustomerLayout><CartPage /></CustomerLayout>} 
      />
      
      <Route 
        path="/checkout" 
        element={
          <ProtectedCustomerRoute>
            <CustomerLayout><CheckoutPage /></CustomerLayout>
          </ProtectedCustomerRoute>
        } 
      />
      
      <Route 
        path="/order-success" 
        element={
          <ProtectedCustomerRoute>
            <CustomerLayout><OrderSuccessPage /></CustomerLayout>
          </ProtectedCustomerRoute>
        } 
      />
      
      <Route 
        path="/my-orders" 
        element={
          <ProtectedCustomerRoute>
            <CustomerLayout><MyOrdersPage /></CustomerLayout>
          </ProtectedCustomerRoute>
        } 
      />
      
      <Route 
        path="/reservations" 
        element={
          <ProtectedCustomerRoute>
            <CustomerLayout><ReservationPage /></CustomerLayout>
          </ProtectedCustomerRoute>
        } 
      />
      
      <Route 
        path="/my-reservations" 
        element={
          <ProtectedCustomerRoute>
            <CustomerLayout><MyReservationsPage /></CustomerLayout>
          </ProtectedCustomerRoute>
        } 
      />

      {/* ==================== STAFF ROUTES ==================== */}
      <Route 
        path="/staff/dashboard" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffDashboard /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />
      
      <Route 
        path="/staff/orders" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffOrders /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />
      
      <Route 
        path="/staff/customers" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffCustomers /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />
      
      <Route 
        path="/staff/menu-items" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffMenuItems /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />
      
      <Route 
        path="/staff/reservations" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffReservations /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />
      
      <Route 
        path="/staff/staff-management" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffStaff /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />
      
      <Route 
        path="/staff/branches" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffBranches /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />
      
      <Route 
        path="/staff/inventory" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffInventory /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />
      
      <Route 
        path="/staff/bills" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffBills /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />
      
      <Route 
        path="/staff/discounts" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffDiscounts /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />
      
      <Route 
        path="/staff/feedback" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffFeedback /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />
      
      <Route 
        path="/staff/suppliers" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffSuppliers /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />
      
      <Route 
        path="/staff/challenges" 
        element={
          <ProtectedStaffRoute>
            <StaffLayout><StaffChallenges /></StaffLayout>
          </ProtectedStaffRoute>
        } 
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
