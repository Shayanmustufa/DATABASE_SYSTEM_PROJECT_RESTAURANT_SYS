import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Please login to place an order');
      navigate('/login');
    } else {
      // Navigate to checkout
      navigate('/checkout');
    }
  };

  const calculateTax = () => {
    return getCartTotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return getCartTotal() + calculateTax();
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <div className="container">
            <h1>Shopping Cart</h1>
          </div>
        </div>

        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some delicious items to your cart!</p>
            <Link to="/menu" className="btn-primary-large">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} items in your cart</p>
        </div>
      </div>

      <div className="container">
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.MenuItemID} className="cart-item">
                <div className="cart-item-image">
                  {getCategoryEmoji(item.Category)}
                </div>

                <div className="cart-item-details">
                  <h3>{item.Name}</h3>
                  <p className="item-category">{item.Category}</p>
                  <p className="item-price">${parseFloat(item.Price).toFixed(2)} each</p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.MenuItemID, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.MenuItemID, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <p className="item-total-price">
                    ${(parseFloat(item.Price) * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.MenuItemID)}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="cart-actions">
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
              <Link to="/menu" className="continue-shopping-btn">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout 🎉
            </button>

            <div className="payment-icons">
              <span>💳</span>
              <span>💵</span>
              <span>📱</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for emojis
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

export default CartPage;