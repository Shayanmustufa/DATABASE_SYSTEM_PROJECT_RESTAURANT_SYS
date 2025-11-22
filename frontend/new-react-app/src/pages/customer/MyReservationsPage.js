// frontend/new-react-app/src/pages/customer/MyReservationsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './MyReservationsPage.css';

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Wrap fetch function with useCallback to satisfy exhaustive-deps
  const fetchMyReservations = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setError('Please log in to view reservations');
        navigate('/login');
        return;
      }

      console.log('Fetching reservations...');
      console.log('User:', user);

      const url = 'http://127.0.0.1:8000/api/reservations/my/';
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Reservations response:', response.data);

      if (response.data.success) {
        setReservations(response.data.reservations || []);
      } else {
        setError('Failed to load reservations');
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
      console.error('Error response:', err.response?.data);

      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.error || 'Failed to load reservations. Make sure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, user]); // dependencies: navigate is stable, user from context

  // Run on mount and when auth changes
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMyReservations();
  }, [isAuthenticated, navigate, fetchMyReservations]); // Now includes the function

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `http://127.0.0.1:8000/api/reservations/${reservationId}/cancel/`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert('Reservation cancelled successfully!');
        fetchMyReservations(); // Refresh list
      }
    } catch (err) {
      console.error('Error cancelling:', err);
      alert(err.response?.data?.error || 'Failed to cancel reservation');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': '#27ae60',
      'Pending': '#f39c12',
      'Cancelled': '#e74c3c',
      'Completed': '#3498db'
    };
    return colors[status] || '#95a5a6';
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const isUpcoming = (dateTimeStr) => new Date(dateTimeStr) > new Date();

  if (loading) {
    return (
      <div className="my-reservations-page">
        <div className="reservations-header">
          <div className="container">
            <h1>My Reservations</h1>
          </div>
        </div>
        <div className="container">
          <div className="loading">Loading your reservations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-reservations-page">
      <div className="reservations-header">
        <div className="container">
          <h1>My Reservations</h1>
          <p>Manage your table bookings</p>
        </div>
      </div>

      <div className="container">
        {error && (
          <div className="error-message">
            {error}
            <br />
            <small>Check browser console for details</small>
          </div>
        )}

        {reservations.length === 0 && !error ? (
          <div className="no-reservations">
            <div className="no-reservations-icon">No reservations</div>
            <h2>No Reservations Yet</h2>
            <p>You haven't made any reservations yet.</p>
            <Link to="/reservations" className="btn-make-reservation">
              Make a Reservation
            </Link>
          </div>
        ) : (
          <>
            <div className="reservations-stats">
              <div className="stat-card">
                <div className="stat-value">{reservations.length}</div>
                <div className="stat-label">Total Reservations</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {reservations.filter(r => r.Status === 'Confirmed' && isUpcoming(r.ReservationDateTime)).length}
                </div>
                <div className="stat-label">Upcoming</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {reservations.filter(r => r.Status === 'Cancelled').length}
                </div>
                <div className="stat-label">Cancelled</div>
              </div>
            </div>

            <div className="reservations-list">
              {reservations.map((reservation) => {
                const { date, time } = formatDateTime(reservation.ReservationDateTime);
                const upcoming = isUpcoming(reservation.ReservationDateTime);

                return (
                  <div key={reservation.ReservationID} className="reservation-card-item">
                    <div className="reservation-header-row">
                      <div className="reservation-info">
                        <h3>Reservation #{reservation.ReservationID}</h3>
                        <div className="reservation-details">
                          <span className="detail">{date}</span>
                          <span className="detail">{time}</span>
                          <span className="detail">{reservation.NumPeople} {reservation.NumPeople === 1 ? 'person' : 'people'}</span>
                          <span className="detail">Table {reservation.TableNumber}</span>
                        </div>
                      </div>
                      <div className="reservation-status-section">
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(reservation.Status) }}
                        >
                          {reservation.Status}
                        </span>
                        {upcoming && reservation.Status === 'Confirmed' && (
                          <span className="upcoming-badge">Upcoming</span>
                        )}
                      </div>
                    </div>

                    {reservation.Status === 'Confirmed' && upcoming && (
                      <div className="reservation-actions">
                        <button
                          onClick={() => handleCancelReservation(reservation.ReservationID)}
                          className="btn-cancel"
                        >
                          Cancel Reservation
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="make-new-reservation">
              <Link to="/reservations" className="btn-make-reservation">
                + Make New Reservation
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyReservationsPage;