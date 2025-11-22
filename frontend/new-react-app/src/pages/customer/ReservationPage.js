// frontend/new-react-app/src/pages/customer/ReservationPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './ReservationPage.css';

const ReservationPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [numPeople, setNumPeople] = useState(2);
  const [selectedTable, setSelectedTable] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const handleDateChange = async (date) => {
    console.log('🔍 Selected date:', date);
    setSelectedDate(date);
    setSelectedTime('');
    setAvailableTables([]);
    setSelectedTable(null);
    setError('');
    
    if (!date) {
      setAvailableTimeSlots([]);
      return;
    }

    setLoading(true);
    try {
      const url = `http://127.0.0.1:8000/api/reservations/time-slots/?date=${date}`;
      console.log('📡 Fetching time slots from:', url);
      
      const response = await axios.get(url);
      console.log('✅ Time slots response:', response.data);
      
      if (response.data.success) {
        setAvailableTimeSlots(response.data.time_slots);
        
        if (response.data.time_slots.length === 0) {
          setError('No time slots available for this date. Please select another date.');
        }
      } else {
        setError('Failed to load time slots');
      }
    } catch (err) {
      console.error('❌ Error fetching time slots:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to load time slots. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = async (time) => {
    console.log('🔍 Selected time:', time);
    setSelectedTime(time);
    setAvailableTables([]);
    setSelectedTable(null);
    setError('');
    
    if (!selectedDate || !time) return;

    setLoading(true);
    try {
      const url = `http://127.0.0.1:8000/api/reservations/available-tables/?date=${selectedDate}&time=${time}`;
      console.log('📡 Fetching available tables from:', url);
      
      const response = await axios.get(url);
      console.log('✅ Available tables response:', response.data);
      
      if (response.data.success) {
        setAvailableTables(response.data.available_tables);
        
        if (response.data.available_tables.length === 0) {
          setError('No tables available at this time. Please select a different time.');
        }
      } else {
        setError('Failed to load available tables');
      }
    } catch (err) {
      console.error('❌ Error fetching tables:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to load available tables');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    setError('');
    
    if (step === 1) {
      if (!selectedDate) {
        setError('Please select a date');
        return;
      }
      if (!selectedTime) {
        setError('Please select a time');
        return;
      }
      if (numPeople < 1 || numPeople > 20) {
        setError('Number of people must be between 1 and 20');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedTable) {
        setError('Please select a table');
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setSuccess('');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirmReservation = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Please log in to make a reservation');
        navigate('/login');
        return;
      }

      const reservationDateTime = `${selectedDate}T${selectedTime}:00`;

      const reservationData = {
        ReservationDateTime: reservationDateTime,
        NumPeople: parseInt(numPeople),
        TableNumber: parseInt(selectedTable),
        CustomerID: user.customerId
      };

      console.log('📡 Sending reservation:', reservationData);

      const response = await axios.post(
        'http://127.0.0.1:8000/api/reservations/create/',
        reservationData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Reservation response:', response.data);

      if (response.data.success) {
        setSuccess(
          '🎉 Reservation confirmed successfully! ' + 
          (response.data.email_sent ? 'Check your email for confirmation details.' : '')
        );
        
        setTimeout(() => {
          navigate('/my-reservations');
        }, 2000);
      } else {
        setError(response.data.error || 'Failed to create reservation');
      }

    } catch (err) {
      console.error('❌ Error creating reservation:', err);
      console.error('Error details:', err.response?.data);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Failed to create reservation. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="reservation-page">
      <div className="reservation-header">
        <div className="container">
          <h1>📅 Reserve a Table</h1>
          <p>Book your perfect dining experience</p>
        </div>
      </div>

      <div className="container">
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">{step > 1 ? '✓' : '1'}</div>
            <div className="step-label">Date & Time</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">{step > 2 ? '✓' : '2'}</div>
            <div className="step-label">Select Table</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Confirm</div>
          </div>
        </div>

        {error && (
          <div className="error-message">⚠️ {error}</div>
        )}

        {success && (
          <div className="success-message">✅ {success}</div>
        )}

        {step === 1 && (
          <div className="reservation-card">
            <h2>Select Date, Time & Party Size</h2>
            
            <div className="form-group">
              <label>Number of People *</label>
              <select 
                value={numPeople} 
                onChange={(e) => setNumPeople(parseInt(e.target.value))}
                className="form-control"
              >
                {Array.from({length: 20}, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Person' : 'People'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Date *</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="form-control"
              />
            </div>

            {selectedDate && (
              <div className="form-group">
                <label>Select Time *</label>
                {loading ? (
                  <div className="loading">Loading available times...</div>
                ) : availableTimeSlots.length === 0 && !error ? (
                  <p style={{color: '#e74c3c', textAlign: 'center', padding: '1rem'}}>
                    No time slots available for this date
                  </p>
                ) : (
                  <div className="time-slots">
                    {availableTimeSlots.map(time => (
                      <button
                        key={time}
                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => handleTimeChange(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="button-group">
              <button 
                className="btn-next" 
                onClick={handleNextStep}
                disabled={!selectedDate || !selectedTime || loading}
              >
                Next: Select Table →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="reservation-card">
            <h2>Select Your Table</h2>
            <p className="step-info">
              📅 {formatDateDisplay(selectedDate)} at {selectedTime}
            </p>
            <p className="step-info">
              👥 Party of {numPeople}
            </p>

            {loading ? (
              <div className="loading">Loading available tables...</div>
            ) : availableTables.length === 0 ? (
              <div className="no-tables">
                <p>😔 No tables available at this time</p>
                <p>Please go back and select a different time</p>
              </div>
            ) : (
              <div className="tables-grid">
                {availableTables.map(tableNum => (
                  <div
                    key={tableNum}
                    className={`table-card ${selectedTable === tableNum ? 'selected' : ''}`}
                    onClick={() => setSelectedTable(tableNum)}
                  >
                    <div className="table-icon">🍽️</div>
                    <div className="table-number">Table {tableNum}</div>
                    <div className="table-capacity">Seats 2-4</div>
                  </div>
                ))}
              </div>
            )}

            <div className="button-group">
              <button className="btn-back" onClick={handlePrevStep}>
                ← Back
              </button>
              <button 
                className="btn-next" 
                onClick={handleNextStep}
                disabled={!selectedTable}
              >
                Next: Confirm →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="reservation-card">
            <h2>Confirm Your Reservation</h2>
            
            <div className="confirmation-details">
              <div className="detail-item">
                <span className="detail-icon">👤</span>
                <div>
                  <div className="detail-label">Guest</div>
                  <div className="detail-value">{user?.firstName} {user?.lastName}</div>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <div>
                  <div className="detail-label">Date</div>
                  <div className="detail-value">{formatDateDisplay(selectedDate)}</div>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">⏰</span>
                <div>
                  <div className="detail-label">Time</div>
                  <div className="detail-value">{selectedTime}</div>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">👥</span>
                <div>
                  <div className="detail-label">Party Size</div>
                  <div className="detail-value">{numPeople} {numPeople === 1 ? 'Person' : 'People'}</div>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">🍽️</span>
                <div>
                  <div className="detail-label">Table</div>
                  <div className="detail-value">Table {selectedTable}</div>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">📧</span>
                <div>
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{user?.email}</div>
                </div>
              </div>
            </div>

            <div className="confirmation-notice">
              <p>📧 A confirmation email will be sent to <strong>{user?.email}</strong></p>
              <p>⏰ Please arrive 10 minutes before your reservation time</p>
              <p>🍽️ Your table will be held for 15 minutes after the reservation time</p>
            </div>

            <div className="button-group">
              <button className="btn-back" onClick={handlePrevStep} disabled={loading}>
                ← Back
              </button>
              <button 
                className="btn-confirm" 
                onClick={handleConfirmReservation}
                disabled={loading}
              >
                {loading ? 'Confirming...' : 'Confirm Reservation 🎉'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationPage;