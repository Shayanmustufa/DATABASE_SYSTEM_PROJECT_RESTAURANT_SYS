import React, { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import FormModal from '../../components/staff/modals/FormModal';
import '../staff.css';

const StaffChallenges = () => {
  const { data, loading, error, success, create, update, deleteItem } = useCRUD('food-challenges');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const handleAddNew = () => {
    setSelectedChallenge(null);
    setIsModalOpen(true);
  };

  const handleEdit = (challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      await deleteItem(id);
    }
  };

  const handleSubmit = async (formData) => {
    if (selectedChallenge) {
      const result = await update(selectedChallenge.ChallengeID, formData);
      if (result.success) {
        setIsModalOpen(false);
        setSelectedChallenge(null);
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
      label: 'Challenge Name',
      type: 'text',
      required: true,
      placeholder: 'Hot Pepper Challenge'
    },
    {
      name: 'Description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Finish this spicy dish to win!'
    },
    {
      name: 'Reward',
      label: 'Reward',
      type: 'text',
      required: true,
      placeholder: '$50 voucher + T-shirt'
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

  if (loading) return <div className="staff-loading">Loading challenges...</div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>🏆 Food Challenges Management</h1>
        <button className="btn-primary-action" onClick={handleAddNew}>
          ➕ Add Challenge
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {data.length === 0 ? (
        <div className="no-data"><p>No challenges found</p></div>
      ) : (
        <div className="challenges-grid">
          {data.map(challenge => (
            <div key={challenge.ChallengeID} className="challenge-card">
              <h3>🏆 {challenge.Name}</h3>
              <p>{challenge.Description}</p>
              <p className="challenge-reward">🎁 Reward: {challenge.Reward}</p>
              <p className="challenge-dates">
                📅 {challenge.StartDate} to {challenge.EndDate}
              </p>
              <div className="action-buttons">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(challenge)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(challenge.ChallengeID)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedChallenge(null);
        }}
        onSubmit={handleSubmit}
        title={selectedChallenge ? 'Edit Challenge' : 'Add New Challenge'}
        fields={formFields}
        initialValues={selectedChallenge || {}}
      />
    </div>
  );
};

export default StaffChallenges;