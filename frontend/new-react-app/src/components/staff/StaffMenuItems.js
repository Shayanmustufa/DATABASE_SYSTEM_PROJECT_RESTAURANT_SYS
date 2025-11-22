// frontend/new-react-app/src/pages/staff/StaffMenuItems.js

import React, { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import FormModal from '../../components/staff/modals/FormModal';
import '../staff.css';

const StaffMenuItems = () => {
  const { data, loading, error, success, create, update, deleteItem } = useCRUD('menu-items');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');

  const categories = [...new Set(data.map(item => item.Category))];
  
  const filteredItems = filterCategory 
    ? data.filter(item => item.Category === filterCategory)
    : data;

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      await deleteItem(id);
    }
  };

  const handleSubmit = async (formData) => {
    if (selectedItem) {
      const result = await update(selectedItem.MenuItemID, formData);
      if (result.success) {
        setIsModalOpen(false);
        setSelectedItem(null);
      }
    } else {
      const result = await create(formData);
      if (result.success) {
        setIsModalOpen(false);
      }
    }
  };

  const formFields = [
    {
      name: 'Name',
      label: 'Item Name',
      type: 'text',
      required: true,
      placeholder: 'Margherita Pizza'
    },
    {
      name: 'Price',
      label: 'Price',
      type: 'number',
      required: true,
      placeholder: '12.99'
    },
    {
      name: 'Category',
      label: 'Category',
      type: 'text',
      required: true,
      placeholder: 'Pizza'
    },
    {
      name: 'Availability',
      label: 'Available',
      type: 'checkbox'
    }
  ];

  if (loading) return <div className="staff-loading">Loading menu items...</div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>🍕 Menu Items Management</h1>
        <div className="header-actions">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button 
            className="btn-primary-action"
            onClick={handleAddNew}
          >
            ➕ Add New Item
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {filteredItems.length === 0 ? (
        <div className="no-data">
          <p>No menu items found</p>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.MenuItemID}>
                  <td>#{item.MenuItemID}</td>
                  <td>{item.Name}</td>
                  <td>${parseFloat(item.Price).toFixed(2)}</td>
                  <td><span className="category-badge">{item.Category}</span></td>
                  <td>
                    <span className={`availability-badge ${item.Availability ? 'available' : 'unavailable'}`}>
                      {item.Availability ? '✓ Available' : '✗ Out of Stock'}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(item.MenuItemID)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={handleSubmit}
        title={selectedItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        fields={formFields}
        initialValues={selectedItem || {}}
      />
    </div>
  );
};

export default StaffMenuItems;