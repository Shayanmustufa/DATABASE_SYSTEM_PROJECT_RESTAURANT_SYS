import React, { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import FormModal from '../../components/staff/modals/FormModal';
import '../staff.css';

const StaffDiscounts = () => {
  const { data, loading, error, success, create, update, deleteItem } = useCRUD('discounts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const handleAddNew = () => {
    setSelectedDiscount(null);
    setIsModalOpen(true);
  };

  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      await deleteItem(id);
    }
  };

  const handleSubmit = async (formData) => {
    if (selectedDiscount) {
      const result = await update(selectedDiscount.DiscountID, formData);
      if (result.success) {
        setIsModalOpen(false);
        setSelectedDiscount(null);
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
      label: 'Discount Name',
      type: 'text',
      required: true,
      placeholder: 'Holiday Sale'
    },
    {
      name: 'Description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Special holiday discount for all items'
    },
    {
      name: 'Percentage',
      label: 'Discount Percentage (%)',
      type: 'number',
      required: true,
      placeholder: '10'
    },
    {
      name: 'StartDate',
      label: 'Start Date',
      type: 'date',
      required: true
    },
    {
      name: 'EndDate',
      label: 'End Date',
      type: 'date',
      required: true
    }
  ];

  if (loading) return <div className="staff-loading">Loading discounts...</div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>🎫 Discounts Management</h1>
        <button className="btn-primary-action" onClick={handleAddNew}>
          ➕ Add Discount
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {data.length === 0 ? (
        <div className="no-data"><p>No discounts found</p></div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Percentage</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(discount => (
                <tr key={discount.DiscountID}>
                  <td>#{discount.DiscountID}</td>
                  <td>{discount.Name}</td>
                  <td><span className="status-badge" style={{backgroundColor: '#27ae60'}}>{discount.Percentage}%</span></td>
                  <td>{discount.StartDate}</td>
                  <td>{discount.EndDate}</td>
                  <td className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(discount)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(discount.DiscountID)}
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
          setSelectedDiscount(null);
        }}
        onSubmit={handleSubmit}
        title={selectedDiscount ? 'Edit Discount' : 'Add New Discount'}
        fields={formFields}
        initialValues={selectedDiscount || {}}
      />
    </div>
  );
};

export default StaffDiscounts;