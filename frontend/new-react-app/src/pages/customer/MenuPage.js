import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './MenuPage.css';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Fetching from:', `${API_BASE_URL}/menu-items/`);
      
      const response = await fetch(`${API_BASE_URL}/menu-items/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('📊 API Response:', data);
      console.log('📊 Response type:', typeof data);
      console.log('📊 Is array?', Array.isArray(data));

      // ✅ Handle different response formats
      let items = [];
      
      if (Array.isArray(data)) {
        // Response is already an array
        items = data;
      } else if (data && Array.isArray(data.results)) {
        // Paginated response
        items = data.results;
      } else if (data && Array.isArray(data.data)) {
        // Data wrapped in 'data' property
        items = data.data;
      } else if (data && typeof data === 'object') {
        // Try to extract array from any property
        const arrays = Object.values(data).filter(v => Array.isArray(v));
        if (arrays.length > 0) {
          items = arrays[0];
        }
      }

      // Ensure items is always an array
      if (!Array.isArray(items)) {
        console.warn('⚠️ Response is not an array:', data);
        items = [];
      }

      console.log('✅ Final items array:', items);
      setMenuItems(items);
      setFilteredItems(items);
      
      if (items.length === 0) {
        setError('No menu items found. Please check the backend server.');
      }
    } catch (error) {
      console.error('❌ Error fetching menu:', error);
      setError(`Failed to load menu: ${error.message}. Make sure the backend server is running at ${API_BASE_URL}`);
      setMenuItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = menuItems.length > 0 
    ? ['All', ...new Set(menuItems.map(item => item.Category || 'Uncategorized'))]
    : ['All'];

  // Filter items by category and search
  useEffect(() => {
    if (!Array.isArray(menuItems)) {
      console.warn('⚠️ menuItems is not an array:', menuItems);
      setFilteredItems([]);
      return;
    }

    let filtered = menuItems;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => (item.Category || 'Uncategorized') === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        (item.Name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery, menuItems]);

  const handleAddToCart = (item) => {
    try {
      addToCart(item, 1);
      setNotification(`${item.Name} added to cart! 🎉`);
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div className="menu-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      {/* Header Section */}
      <div className="menu-header">
        <div className="container">
          <h1>Our Menu</h1>
          <p>Discover our delicious selection of dishes</p>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="notification">{notification}</div>
      )}

      <div className="container">
        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee',
            color: '#c0392b',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #e74c3c'
          }}>
            <strong>⚠️ Error:</strong> {error}
            <br />
            <small>
              Backend URL: {API_BASE_URL}
              <br />
              Make sure your Django server is running: <code>python manage.py runserver</code>
            </small>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="menu-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {!Array.isArray(filteredItems) || filteredItems.length === 0 ? (
          <div className="no-items">
            <h2>😕 No items found</h2>
            <p>
              {menuItems.length === 0
                ? 'No menu items available. Please add items in the admin panel.'
                : 'Try adjusting your search or filter'}
            </p>
            {menuItems.length === 0 && (
              <button
                onClick={fetchMenuItems}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                🔄 Retry Loading
              </button>
            )}
          </div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map(item => (
              <div key={item.MenuItemID || item.id} className="menu-card">
                <div className="menu-card-image">
                  {getCategoryEmoji(item.Category)}
                </div>
                
                <div className="menu-card-content">
                  <div className="menu-card-header">
                    <h3 className="menu-item-name">{item.Name || 'Unknown Item'}</h3>
                    <span className="menu-item-category">{item.Category || 'Uncategorized'}</span>
                  </div>

                  <div className="menu-card-footer">
                    <div className="price-section">
                      <span className="price">
                        ${parseFloat(item.Price || 0).toFixed(2)}
                      </span>
                      {item.Availability ? (
                        <span className="availability available">✓ Available</span>
                      ) : (
                        <span className="availability unavailable">✗ Out of Stock</span>
                      )}
                    </div>

                    {item.Availability ? (
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart 🛒
                      </button>
                    ) : (
                      <button className="add-to-cart-btn disabled" disabled>
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="menu-stats">
          <p>
            Showing {Array.isArray(filteredItems) ? filteredItems.length : 0} of{' '}
            {Array.isArray(menuItems) ? menuItems.length : 0} items
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to get emoji based on category
const getCategoryEmoji = (category) => {
  const emojiMap = {
    'Appetizer': '🥗',
    'Main Course': '🍝',
    'Dessert': '🍰',
    'Drinks': '🥤',
    'Pizza': '🍕',
    'Burger': '🍔',
    'Pasta': '🍝',
    'Salad': '🥗',
    'Soup': '🍜',
    'Seafood': '🦐',
    'Steak': '🥩',
    'Chicken': '🍗',
    'Vegetarian': '🥕',
    'Breakfast': '🍳',
  };
  return emojiMap[category] || '🍽️';
};

export default MenuPage;