import React, { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import FormModal from '../../components/staff/modals/FormModal';
import '../staff.css';

const StaffInventory = () => {
  const { data, loading, error, success, create, update, deleteItem } = useCRUD('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      await deleteItem(id);
    }
  };

  const handleSubmit = async (formData) => {
    if (selectedItem) {
      const result = await update(selectedItem.ItemID, formData);
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
      name: 'ItemName',
      label: 'Item Name',
      type: 'text',
      required: true,
      placeholder: 'Tomato'
    },
    {
      name: 'QuantityAvailable',
      label: 'Quantity Available',
      type: 'number',
      required: true,
      placeholder: '50'
    },
    {
      name: 'ReorderLevel',
      label: 'Reorder Level',
      type: 'number',
      required: true,
      placeholder: '10'
    },
    {
      name: 'SupplierID',
      label: 'Supplier ID',
      type: 'number',
      required: true,
      placeholder: '1'
    }
  ];

  if (loading) return <div className="staff-loading">Loading inventory...</div>;

  const lowStockItems = data.filter(item => item.QuantityAvailable <= item.ReorderLevel);

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>📦 Inventory Management</h1>
        <button className="btn-primary-action" onClick={handleAddNew}>
          ➕ Add Item
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {lowStockItems.length > 0 && (
        <div className="alert alert-error">
          ⚠️ {lowStockItems.length} items have low stock levels!
        </div>
      )}

      {data.length === 0 ? (
        <div className="no-data"><p>No inventory items found</p></div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Supplier ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.ItemID}>
                  <td>#{item.ItemID}</td>
                  <td>{item.ItemName}</td>
                  <td>{item.QuantityAvailable}</td>
                  <td>{item.ReorderLevel}</td>
                  <td>
                    <span className={`availability-badge ${item.QuantityAvailable > item.ReorderLevel ? 'available' : 'unavailable'}`}>
                      {item.QuantityAvailable > item.ReorderLevel ? '✓ In Stock' : '⚠️ Low Stock'}
                    </span>
                  </td>
                  <td>#{item.SupplierID}</td>
                  <td className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(item.ItemID)}
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
        title={selectedItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        fields={formFields}
        initialValues={selectedItem || {}}
      />
    </div>
  );
};

export default StaffInventory;