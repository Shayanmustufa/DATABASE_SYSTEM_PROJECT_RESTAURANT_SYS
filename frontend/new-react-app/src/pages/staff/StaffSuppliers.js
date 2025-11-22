import React, { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import FormModal from '../../components/staff/modals/FormModal';
import '../staff.css';

const StaffSuppliers = () => {
  const { data, loading, error, success, create, update, deleteItem } = useCRUD('suppliers');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const handleAddNew = () => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      await deleteItem(id);
    }
  };

  const handleSubmit = async (formData) => {
    if (selectedSupplier) {
      const result = await update(selectedSupplier.SupplierID, formData);
      if (result.success) {
        setIsModalOpen(false);
        setSelectedSupplier(null);
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
      label: 'Supplier Name',
      type: 'text',
      required: true,
      placeholder: 'ABC Suppliers Ltd.'
    },
    {
      name: 'Contact',
      label: 'Contact Number',
      type: 'tel',
      required: true,
      placeholder: '+1234567890'
    }
  ];

  if (loading) return <div className="staff-loading">Loading suppliers...</div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>🚚 Suppliers Management</h1>
        <button className="btn-primary-action" onClick={handleAddNew}>
          ➕ Add Supplier
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {data.length === 0 ? (
        <div className="no-data"><p>No suppliers found</p></div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(supplier => (
                <tr key={supplier.SupplierID}>
                  <td>#{supplier.SupplierID}</td>
                  <td>{supplier.Name}</td>
                  <td>{supplier.Contact}</td>
                  <td className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(supplier)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(supplier.SupplierID)}
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
          setSelectedSupplier(null);
        }}
        onSubmit={handleSubmit}
        title={selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}
        fields={formFields}
        initialValues={selectedSupplier || {}}
      />
    </div>
  );
};

export default StaffSuppliers;