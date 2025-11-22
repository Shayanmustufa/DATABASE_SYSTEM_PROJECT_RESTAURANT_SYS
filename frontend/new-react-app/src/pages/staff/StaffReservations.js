// frontend/new-react-app/src/pages/staff/StaffReservations.js

import React, { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import FormModal from '../../components/staff/modals/FormModal';
import '../staff.css';

const StaffReservations = () => {
  const { data, loading, error, success, update, deleteItem } = useCRUD('reservations');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const statusOptions = [
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Completed', label: 'Completed' }
  ];

  const filteredReservations = filterStatus
    ? data.filter(res => res.Status === filterStatus)
    : data;

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      await deleteItem(id);
    }
  };

  const handleSubmit = async (formData) => {
    const result = await update(selectedReservation.ReservationID, formData);
    if (result.success) {
      setIsModalOpen(false);
      setSelectedReservation(null);
    }
  };

  const formFields = [
    {
      name: 'Status',
      label: 'Reservation Status',
      type: 'select',
      required: true,
      options: statusOptions
    },
    {
      name: 'Confirmed',
      label: 'Confirmed',
      type: 'checkbox'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': '#27ae60',
      'Pending': '#f39c12',
      'Cancelled': '#e74c3c',
      'Completed': '#9b59b6'
    };
    return colors[status] || '#95a5a6';
  };

  if (loading) return <div className="staff-loading">Loading reservations...</div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>📅 Reservations Management</h1>
        <div className="header-actions">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Reservations</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {filteredReservations.length === 0 ? (
        <div className="no-data">
          <p>No reservations found</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date & Time</th>
                <th>Party Size</th>
                <th>Table</th>
                <th>Status</th>
                <th>Confirmed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(reservation => (
                <tr key={reservation.ReservationID}>
                  <td>#{reservation.ReservationID}</td>
                  <td>{new Date(reservation.ReservationDateTime).toLocaleString()}</td>
                  <td>{reservation.NumPeople}</td>
                  <td>Table {reservation.TableNumber}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(reservation.Status) }}
                    >
                      {reservation.Status}
                    </span>
                  </td>
                  <td>{reservation.Confirmed ? '✓' : '✗'}</td>
                  <td className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(reservation)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(reservation.ReservationID)}
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
          setSelectedReservation(null);
        }}
        onSubmit={handleSubmit}
        title="Edit Reservation"
        fields={formFields}
        initialValues={selectedReservation || {}}
      />
    </div>
  );
};

export default StaffReservations;