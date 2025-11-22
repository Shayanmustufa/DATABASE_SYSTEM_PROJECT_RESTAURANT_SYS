import React, { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import FormModal from '../../components/staff/modals/FormModal';
import '../staff.css';

const StaffBranches = () => {
  const { data, loading, error, success, create, update, deleteItem } = useCRUD('branches');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const handleAddNew = () => {
    setSelectedBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      await deleteItem(id);
    }
  };

  const handleSubmit = async (formData) => {
    if (selectedBranch) {
      const result = await update(selectedBranch.BranchID, formData);
      if (result.success) {
        setIsModalOpen(false);
        setSelectedBranch(null);
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
      label: 'Branch Name',
      type: 'text',
      required: true,
      placeholder: 'Downtown Branch'
    },
    {
      name: 'Location',
      label: 'Location',
      type: 'text',
      required: true,
      placeholder: '123 Main Street'
    },
    {
      name: 'Contact',
      label: 'Contact Number',
      type: 'tel',
      required: true,
      placeholder: '+1234567890'
    }
  ];

  if (loading) return <div className="staff-loading">Loading branches...</div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>🏢 Branches Management</h1>
        <button className="btn-primary-action" onClick={handleAddNew}>
          ➕ Add Branch
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {data.length === 0 ? (
        <div className="no-data"><p>No branches found</p></div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(branch => (
                <tr key={branch.BranchID}>
                  <td>#{branch.BranchID}</td>
                  <td>{branch.Name}</td>
                  <td>{branch.Location}</td>
                  <td>{branch.Contact}</td>
                  <td className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(branch)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(branch.BranchID)}
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
          setSelectedBranch(null);
        }}
        onSubmit={handleSubmit}
        title={selectedBranch ? 'Edit Branch' : 'Add New Branch'}
        fields={formFields}
        initialValues={selectedBranch || {}}
      />
    </div>
  );
};

export default StaffBranches;