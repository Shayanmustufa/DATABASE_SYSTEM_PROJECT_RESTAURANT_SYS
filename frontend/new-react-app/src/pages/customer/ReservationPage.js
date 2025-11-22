// frontend/new-react-app/src/pages/customer/ReservationPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './ReservationPage.css';

const ReservationPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Date/Time, 2: Table, 3: Confirm
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

  // Get min date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get max date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  // Fetch available time slots when date is selected
  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setAvailableTables([]);
    setSelectedTable(null);
    
    if (!date) return;

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/reservations/time-slots/?date=${date}`
      );
      setAvailableTimeSlots(response.data.time_slots);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('Failed to load time slots');
    }
  };

  // Fetch available tables when time is selected
  const handleTimeChange = async (time) => {
    setSelectedTime(time);
    setAvailableTables([]);
    setSelectedTable(null);
    
    if (!selectedDate || !time) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/reservations/available-tables/?date=${selectedDate}&time=${time}`
      );
      setAvailableTables(response.data.available_tables);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to load available tables');
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    setError('');
    
    if (step === 1) {
      if (!selectedDate || !selectedTime) {
        setError('Please select date and time');
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
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirmReservation = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const reservationDateTime = `${selectedDate}T${selectedTime}:00`;

      const response = await axios.post(
        'http://127.0.0.1:8000/api/reservations/create/',
        {
          ReservationDateTime: reservationDateTime,
          NumPeople: numPeople,
          TableNumber: selectedTable,
          CustomerID: user.customerId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess('Reservation confirmed! Check your email for details.');
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/my-reservations');
        }, 3000);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error creating reservation:', err);
      setError(err.response?.data?.error || 'Failed to create reservation');
      setLoading(false);
    }
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
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Date & Time</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
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

        {/* Step 1: Date, Time, People */}
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
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
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

            {selectedDate && availableTimeSlots.length > 0 && (
              <div className="form-group">
                <label>Select Time *</label>
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
              </div>
            )}

            <div className="button-group">
              <button 
                className="btn-next" 
                onClick={handleNextStep}
                disabled={!selectedDate || !selectedTime}
              >
                Next: Select Table →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Table */}
        {step === 2 && (
          <div className="reservation-card">
            <h2>Select Your Table</h2>
            <p className="step-info">
              📅 {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedTime}
            </p>

            {loading ? (
              <div className="loading">Loading available tables...</div>
            ) : availableTables.length === 0 ? (
              <div className="no-tables">
                <p>😔 No tables available at this time</p>
                <p>Please select a different time</p>
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
                    <div className="table-capacity">2-4 seats</div>
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

        {/* Step 3: Confirm */}
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
                  <div className="detail-value">
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
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
            </div>

            <div className="button-group">
              <button className="btn-back" onClick={handlePrevStep}>
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