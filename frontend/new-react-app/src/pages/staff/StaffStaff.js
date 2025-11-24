import React, { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import FormModal from '../../components/staff/modals/FormModal';
import '../staff.css';

const StaffStaff = () => {
  const { data, loading, error, success, create, update, deleteItem } = useCRUD('staff');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = data.filter(s =>
    s.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.Role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      await deleteItem(id);
    }
  };

  const handleSubmit = async (formData) => {
    if (selectedStaff) {
      const result = await update(selectedStaff.StaffID, formData);
      if (result.success) {
        setIsModalOpen(false);
        setSelectedStaff(null);
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
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'John Doe'
    },
    {
      name: 'Role',
      label: 'Role',
      type: 'text',
      required: true,
      placeholder: 'Manager, Chef, Waiter'
    },
    {
      name: 'Salary',
      label: 'Salary',
      type: 'number',
      required: true,
      placeholder: '50000'
    }
  ];

  if (loading) return <div className="staff-loading">Loading staff...</div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>👨‍💼 Staff Management</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="🔍 Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="btn-primary-action" onClick={handleAddNew}>
            ➕ Add Staff Member
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {filteredStaff.length === 0 ? (
        <div className="no-data"><p>No staff found</p></div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map(staff => (
                <tr key={staff.StaffID}>
                  <td>#{staff.StaffID}</td>
                  <td>{staff.Name}</td>
                  <td>{staff.Role}</td>
                  <td>${parseFloat(staff.Salary).toFixed(2)}</td>
                  <td className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(staff)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(staff.StaffID)}
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
          setSelectedStaff(null);
        }}
        onSubmit={handleSubmit}
        title={selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        fields={formFields}
        initialValues={selectedStaff || {}}
      />
    </div>
  );
};

export default StaffStaff; 