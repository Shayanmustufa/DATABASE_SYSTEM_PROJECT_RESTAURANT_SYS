// frontend/new-react-app/src/pages/customer/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [error, setError] = useState('');
  const [availableDiscounts, setAvailableDiscounts] = useState([]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirect if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Fetch available discounts
    fetchDiscounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, cartItems, navigate]);

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/discounts/');
      const today = new Date().toISOString().split('T')[0];
      const active = response.data.filter(d => 
        d.StartDate <= today && d.EndDate >= today
      );
      setAvailableDiscounts(active);
      console.log('Available discounts:', active);
    } catch (err) {
      console.error('Error fetching discounts:', err);
    }
  };

  const calculateSubtotal = () => {
    return getCartTotal();
  };

  const calculateDiscount = () => {
    if (!appliedDiscount) return 0;
    return (calculateSubtotal() * parseFloat(appliedDiscount.Percentage)) / 100;
  };

  const calculateTax = () => {
    const afterDiscount = calculateSubtotal() - calculateDiscount();
    return afterDiscount * 0.18; // 18% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  };

  const applyDiscount = () => {
    setError('');
    
    if (!discountCode.trim()) {
      setError('Please enter a discount code');
      return;
    }

    const discount = availableDiscounts.find(
      d => d.Name.toLowerCase().trim() === discountCode.toLowerCase().trim()
    );
    
    if (discount) {
      setAppliedDiscount(discount);
      setDiscountCode('');
      console.log('Discount applied:', discount);
    } else {
      setError(`Invalid discount code: "${discountCode}". Available codes: ${availableDiscounts.map(d => d.Name).join(', ')}`);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
  };

  const placeOrder = async () => {
    setLoading(true);
    setError('');

    console.log('Starting order placement...');
    console.log('User:', user);
    console.log('Cart items:', cartItems);

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      // Step 1: Create Order
      console.log('Step 1: Creating order...');
      const orderData = {
        OrderDate: new Date().toISOString(),
        Status: 'Pending'
      };
      
      const orderResponse = await axios.post(
        'http://127.0.0.1:8000/api/orders/',
        orderData,
        config
      );
      const orderId = orderResponse.data.OrderID;
      console.log('Order created with ID:', orderId);

      // Step 2: Create Order Details
      console.log('Step 2: Creating order details...');
      for (const item of cartItems) {
        const orderDetailData = {
          OrderID: orderId,
          MenuItemID: item.MenuItemID,
          Quantity: item.quantity
        };
        console.log('Creating order detail:', orderDetailData);
        
        await axios.post(
          'http://127.0.0.1:8000/api/order-details/',
          orderDetailData,
          config
        );
      }
      console.log('Order details created');

      // Step 3: Link Order to Customer
      console.log('Step 3: Linking order to customer...');
      const orderCustomerData = {
        OrderID: orderId,
        CustomerID: user.customerId
      };
      console.log('Order customer data:', orderCustomerData);
      
      await axios.post(
        'http://127.0.0.1:8000/api/order-customers/',
        orderCustomerData,
        config
      );
      console.log('Order linked to customer');

      // Step 4: Create Bill
      console.log('Step 4: Creating bill...');
      const billData = {
        OrderID: orderId,
        TotalBeforeDiscount: calculateSubtotal().toFixed(2),
        DiscountAmount: calculateDiscount().toFixed(2),
        TaxAmount: calculateTax().toFixed(2),
        PaymentMethod: paymentMethod,
        PaymentDate: new Date().toISOString()
      };
      console.log('Bill data:', billData);
      
      const billResponse = await axios.post(
        'http://127.0.0.1:8000/api/bills/',
        billData,
        config
      );
      const billId = billResponse.data.BillID;
      console.log('Bill created with ID:', billId);

      // Step 5: Apply discount if exists
      if (appliedDiscount) {
        console.log('Step 5: Applying discount...');
        const appliesData = {
          BillID: billId,
          DiscountID: appliedDiscount.DiscountID
        };
        
        await axios.post(
          'http://127.0.0.1:8000/api/applies/',
          appliesData,
          config
        );
        console.log('Discount applied to bill');
      }

      // Step 6: Create Bill Computation
      console.log('Step 6: Creating bill computation...');
      const billComputationData = {
        BillID: billId,
        TotalAmount: calculateTotal().toFixed(2)
      };
      
      await axios.post(
        'http://127.0.0.1:8000/api/bill-computations/',
        billComputationData,
        config
      );
      console.log('Bill computation created');

      // Success!
      console.log('Order placed successfully!');
      clearCart();
      
      navigate('/order-success', { 
        state: { 
          orderId, 
          billId,
          total: calculateTotal() 
        } 
      });

    } catch (err) {
      console.error('Order placement error:', err);
      console.error('Error response:', err.response?.data);
      
      let errorMessage = 'Failed to place order. ';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage += err.response.data;
        } else if (err.response.data.detail) {
          errorMessage += err.response.data.detail;
        } else if (err.response.data.error) {
          errorMessage += err.response.data.error;
        } else {
          errorMessage += JSON.stringify(err.response.data);
        }
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <div className="container">
          <h1>Checkout</h1>
          <p>Review your order and complete payment</p>
        </div>
      </div>

      <div className="container">
        <div className="checkout-layout">
          {/* Left Side - Order Review & Payment */}
          <div className="checkout-main">
            {/* Order Items */}
            <div className="checkout-section">
              <h2>📦 Order Summary</h2>
              <div className="order-items-list">
                {cartItems.map(item => (
                  <div key={item.MenuItemID} className="checkout-item">
                    <div className="checkout-item-info">
                      <span className="item-emoji">{getCategoryEmoji(item.Category)}</span>
                      <div>
                        <h4>{item.Name}</h4>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="checkout-item-price">
                      ${(parseFloat(item.Price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount Code */}
            <div className="checkout-section">
              <h2>🎫 Discount Code</h2>
              {appliedDiscount ? (
                <div className="applied-discount">
                  <span>✅ {appliedDiscount.Name} ({appliedDiscount.Percentage}% off)</span>
                  <button onClick={removeDiscount} className="btn-remove-discount">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="discount-input-group">
                  <input
                    type="text"
                    placeholder="Enter discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && applyDiscount()}
                    className="discount-input"
                  />
                  <button onClick={applyDiscount} className="btn-apply">
                    Apply
                  </button>
                </div>
              )}
              
              {availableDiscounts.length > 0 && !appliedDiscount && (
                <div className="available-discounts">
                  <p><strong>Available Codes:</strong></p>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                    {availableDiscounts.map(d => (
                      <span 
                        key={d.DiscountID} 
                        className="discount-chip"
                        onClick={() => {
                          setDiscountCode(d.Name);
                          setAppliedDiscount(d);
                        }}
                      >
                        {d.Name} ({d.Percentage}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <h2>💳 Payment Method</h2>
              <div className="payment-methods">
                {['Credit Card', 'Debit Card', 'Cash', 'Mobile Payment'].map(method => (
                  <label key={method} className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="checkout-error">⚠️ {error}</div>
            )}
          </div>

          {/* Right Side - Order Total */}
          <div className="checkout-sidebar">
            <div className="order-summary-card">
              <h2>Order Total</h2>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>

              {appliedDiscount && (
                <div className="summary-row discount-row">
                  <span>Discount ({appliedDiscount.Percentage}%):</span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Tax (18%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <button 
                onClick={placeOrder} 
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? 'Processing Order...' : 'Place Order 🎉'}
              </button>

              <div className="security-notice">
                🔒 Your payment is secure and encrypted
              </div>
            </div>

            {/* Customer Info */}
            <div className="customer-info-card">
              <h3>👤 Customer Information</h3>
              <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Customer ID:</strong> {user?.customerId}</p>
              <p><strong>Loyalty Points:</strong> {user?.loyaltyPoints || 0}</p>
            </div>
          </div>
        </div>
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

export default CheckoutPage;