import React, { useState, useEffect } from 'react';
import { menuItemAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import './MenuPage.css';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await menuItemAPI.getAll();
      setMenuItems(response.data);
      setFilteredItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.Category))];

  // Filter items by category and search
  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.Category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.Name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery, menuItems]);

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    setNotification(`${item.Name} added to cart! 🎉`);
    setTimeout(() => setNotification(''), 3000);
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
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <h2>😕 No items found</h2>
            <p>Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map(item => (
              <div key={item.MenuItemID} className="menu-card">
                <div className="menu-card-image">
                  {getCategoryEmoji(item.Category)}
                </div>
                
                <div className="menu-card-content">
                  <div className="menu-card-header">
                    <h3 className="menu-item-name">{item.Name}</h3>
                    <span className="menu-item-category">{item.Category}</span>
                  </div>

                  <div className="menu-card-footer">
                    <div className="price-section">
                      <span className="price">${parseFloat(item.Price).toFixed(2)}</span>
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
          <p>Showing {filteredItems.length} of {menuItems.length} items</p>
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