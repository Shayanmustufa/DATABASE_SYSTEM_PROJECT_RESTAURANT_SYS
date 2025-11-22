import React, { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import FormModal from '../../components/staff/modals/FormModal';
import '../staff.css';

const StaffCustomers = () => {
  const { data, loading, error, success, create, update, deleteItem } = useCRUD('customers');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = data.filter(customer =>
    customer.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteItem(id);
    }
  };

  const handleSubmit = async (formData) => {
    if (selectedCustomer) {
      const result = await update(selectedCustomer.CustomerID, formData);
      if (result.success) {
        setIsModalOpen(false);
        setSelectedCustomer(null);
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
      name: 'FirstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'John'
    },
    {
      name: 'LastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Doe'
    },
    {
      name: 'Email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'john@example.com'
    },
    {
      name: 'Contact',
      label: 'Contact Number',
      type: 'tel',
      required: true,
      placeholder: '+1234567890'
    },
    {
      name: 'LoyaltyPoints',
      label: 'Loyalty Points',
      type: 'number',
      required: false,
      placeholder: '0'
    }
  ];

  if (loading) return <div className="staff-loading">Loading customers...</div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>👥 Customers Management</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="🔍 Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            className="btn-primary-action"
            onClick={handleAddNew}
          >
            ➕ Add New Customer
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {filteredCustomers.length === 0 ? (
        <div className="no-data">
          <p>No customers found</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Loyalty Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.CustomerID}>
                  <td>#{customer.CustomerID}</td>
                  <td>{customer.FirstName} {customer.LastName}</td>
                  <td>{customer.Email}</td>
                  <td>{customer.Contact}</td>
                  <td><span className="points-badge">{customer.LoyaltyPoints} pts</span></td>
                  <td className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(customer)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(customer.CustomerID)}
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
          setSelectedCustomer(null);
        }}
        onSubmit={handleSubmit}
        title={selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
        fields={formFields}
        initialValues={selectedCustomer || {}}
      />
    </div>
  );
};

export default StaffCustomers;