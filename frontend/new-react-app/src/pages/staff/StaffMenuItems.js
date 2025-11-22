// ========================================
// FILE: frontend/new-react-app/src/pages/staff/StaffMenuItems.js
// Complete Staff Menu Management Component
// ========================================

import React, { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import FormModal from '../../components/staff/modals/FormModal';
import '../staff.css';

const StaffMenuItems = () => {
  // Use CRUD hook to manage menu items
  const { data, loading, error, success, create, update, deleteItem } = useCRUD('menu-items');
  
  // Local state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique categories from menu items
  const categories = [...new Set(data.map(item => item.Category))];
  
  // Apply filters and search
  const filteredItems = data.filter(item => {
    const matchesCategory = filterCategory === '' || item.Category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle: Add New Menu Item
  const handleAddNew = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  // Handle: Edit Menu Item
  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle: Delete Menu Item
  const handleDelete = async (id) => {
    if (window.confirm('⚠️ Are you sure you want to delete this menu item? This action cannot be undone.')) {
      const result = await deleteItem(id);
      if (result.success) {
        console.log('✅ Menu item deleted successfully');
      }
    }
  };

  // Handle: Submit Form (Create or Update)
  const handleSubmit = async (formData) => {
    // Ensure price is a number
    if (formData.Price) {
      formData.Price = parseFloat(formData.Price);
    }

    // Ensure Availability is boolean
    if (typeof formData.Availability !== 'boolean') {
      formData.Availability = formData.Availability === 'true' || formData.Availability === true;
    }

    if (selectedItem) {
      // Update existing menu item
      const result = await update(selectedItem.MenuItemID, formData);
      if (result.success) {
        setIsModalOpen(false);
        setSelectedItem(null);
        console.log('✅ Menu item updated successfully');
      }
    } else {
      // Create new menu item
      const result = await create(formData);
      if (result.success) {
        setIsModalOpen(false);
        console.log('✅ Menu item created successfully');
      }
    }
  };

  // Form fields configuration for modal
  const formFields = [
    {
      name: 'Name',
      label: 'Item Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Margherita Pizza'
    },
    {
      name: 'Price',
      label: 'Price ($)',
      type: 'number',
      required: true,
      placeholder: '12.99'
    },
    {
      name: 'Category',
      label: 'Category',
      type: 'text',
      required: true,
      placeholder: 'e.g., Pizza, Burger, Salad'
    },
    {
      name: 'Availability',
      label: 'Available for Sale',
      type: 'checkbox'
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="staff-page">
        <div className="staff-loading">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍕</div>
          <p>Loading menu items...</p>
        </div>
      </div>
    );
  }

  // Get category color for visual distinction
  const getCategoryColor = (category) => {
    const colors = {
      'Pizza': '#ff6b6b',
      'Burger': '#ffd93d',
      'Salad': '#27ae60',
      'Dessert': '#ff85a2',
      'Drinks': '#4ecdc4',
      'Pasta': '#f8a100',
      'Seafood': '#3498db',
      'Chicken': '#e8a900',
    };
    return colors[category] || '#667eea';
  };

  // Get availability icon
  const getAvailabilityIcon = (available) => {
    return available ? '✓ In Stock' : '✗ Out of Stock';
  };

  return (
    <div className="staff-page">
      {/* ===== PAGE HEADER ===== */}
      <div className="page-header">
        <h1>🍕 Menu Items Management</h1>
        <div className="header-actions">
          {/* Search Input */}
          <input
            type="text"
            placeholder="🔍 Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          {/* Category Filter */}
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">📋 All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat} ({data.filter(i => i.Category === cat).length})
              </option>
            ))}
          </select>

          {/* Add New Button */}
          <button 
            className="btn-primary-action"
            onClick={handleAddNew}
            title="Add a new menu item"
          >
            ➕ Add New Item
          </button>
        </div>
      </div>

      {/* ===== ALERTS ===== */}
      {error && (
        <div className="alert alert-error">
          ❌ <strong>Error:</strong> {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          ✅ <strong>Success:</strong> {success}
        </div>
      )}

      {/* ===== CONTENT ===== */}
      {filteredItems.length === 0 ? (
        <div className="no-data">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <p>
            {searchTerm ? 'No menu items match your search' : 'No menu items found'}
          </p>
          {filterCategory && (
            <button 
              onClick={() => {
                setFilterCategory('');
                setSearchTerm('');
              }}
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
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Availability</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.MenuItemID}>
                  {/* ID Column */}
                  <td>
                    <strong>#{item.MenuItemID}</strong>
                  </td>

                  {/* Name Column */}
                  <td>
                    <strong>{item.Name}</strong>
                  </td>

                  {/* Price Column */}
                  <td>
                    <strong style={{ color: '#27ae60', fontSize: '1.1rem' }}>
                      ${parseFloat(item.Price).toFixed(2)}
                    </strong>
                  </td>

                  {/* Category Column */}
                  <td>
                    <span 
                      className="category-badge"
                      style={{ 
                        backgroundColor: getCategoryColor(item.Category),
                        color: 'white',
                        padding: '0.5rem 1rem'
                      }}
                    >
                      {item.Category}
                    </span>
                  </td>

                  {/* Availability Toggle */}
                  <td>
                    <span 
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: item.Availability ? '#d4edda' : '#fee',
                        color: item.Availability ? '#155724' : '#c0392b',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        // Quick toggle availability
                        handleEdit({
                          ...item,
                          Availability: !item.Availability
                        });
                      }}
                      title="Click to toggle availability"
                    >
                      {item.Availability ? '✓ Available' : '✗ Unavailable'}
                    </span>
                  </td>

                  {/* Stock Status Column */}
                  <td>
                    {item.Availability ? (
                      <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                        📦 In Stock
                      </span>
                    ) : (
                      <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                        ⚠️ Out of Stock
                      </span>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(item)}
                      title={`Edit ${item.Name}`}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(item.MenuItemID)}
                      title={`Delete ${item.Name}`}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Summary */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderTop: '2px solid #e0e0e0',
            textAlign: 'center',
            color: '#636e72'
          }}>
            <p>
              Showing <strong>{filteredItems.length}</strong> of <strong>{data.length}</strong> items
              {filterCategory && ` in category: ${filterCategory}`}
            </p>
          </div>
        </div>
      )}

      {/* ===== FORM MODAL ===== */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={handleSubmit}
        title={selectedItem ? `📝 Edit: ${selectedItem.Name}` : '➕ Add New Menu Item'}
        fields={formFields}
        initialValues={selectedItem || {
          Name: '',
          Price: '',
          Category: '',
          Availability: true
        }}
      />

      {/* ===== QUICK STATS ===== */}
      {data.length > 0 && (
        <div style={{
          marginTop: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <p style={{ color: '#636e72', margin: 0 }}>Total Items</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', margin: 0 }}>
              {data.length}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
            <p style={{ color: '#636e72', margin: 0 }}>Available</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60', margin: 0 }}>
              {data.filter(i => i.Availability).length}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✗</div>
            <p style={{ color: '#636e72', margin: 0 }}>Out of Stock</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c', margin: 0 }}>
              {data.filter(i => !i.Availability).length}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
            <p style={{ color: '#636e72', margin: 0 }}>Avg Price</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12', margin: 0 }}>
              ${(data.reduce((sum, item) => sum + parseFloat(item.Price), 0) / data.length).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffMenuItems;