import React, { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import FormModal from '../../components/staff/modals/FormModal';
import '../staff.css';

const StaffOrders = () => {
  const { data, loading, error, success, update, deleteItem } = useCRUD('orders');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('');

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Preparing', label: 'Preparing' },
    { value: 'Ready', label: 'Ready' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const filteredOrders = filter 
    ? data.filter(order => order.Status === filter)
    : data;

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      await deleteItem(id);
    }
  };

  const handleSubmit = async (formData) => {
    const result = await update(selectedOrder.OrderID, formData);
    if (result.success) {
      setIsModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const formFields = [
    {
      name: 'Status',
      label: 'Order Status',
      type: 'select',
      required: true,
      options: statusOptions
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f39c12',
      'Preparing': '#3498db',
      'Ready': '#27ae60',
      'Delivered': '#9b59b6',
      'Cancelled': '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  if (loading) return <div className="staff-loading">Loading orders...</div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>📦 Orders Management</h1>
        <div className="header-actions">
          <div className="filter-group">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Orders</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {filteredOrders.length === 0 ? (
        <div className="no-data">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.OrderID}>
                  <td>#{order.OrderID}</td>
                  <td>{new Date(order.OrderDate).toLocaleString()}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.Status) }}
                    >
                      {order.Status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(order)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(order.OrderID)}
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
          setSelectedOrder(null);
        }}
        onSubmit={handleSubmit}
        title="Edit Order"
        fields={formFields}
        initialValues={selectedOrder || {}}
      />
    </div>
  );
};

export default StaffOrders;