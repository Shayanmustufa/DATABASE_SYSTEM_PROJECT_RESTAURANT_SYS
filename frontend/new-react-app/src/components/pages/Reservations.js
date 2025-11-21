import React, { useState, useEffect } from 'react';
import { reservationAPI } from '../../services/api';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reservationAPI.getAll()
      .then(res => {
        setReservations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading reservations...</div>;

  return (
    <div>
      <div className="card-header">
        <h1>📅 Reservations</h1>
        <button className="btn-primary">+ New Reservation</button>
      </div>
      {reservations.length === 0 ? (
        <div className="card"><p>No reservations found.</p></div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date & Time</th>
              <th>People</th>
              <th>Table #</th>
              <th>Status</th>
              <th>Confirmed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res.ReservationID}>
                <td>{res.ReservationID}</td>
                <td>{new Date(res.ReservationDateTime).toLocaleString()}</td>
                <td>{res.NumPeople}</td>
                <td>{res.TableNumber}</td>
                <td>{res.Status}</td>
                <td>{res.Confirmed ? '✅' : '❌'}</td>
                <td>
                  <button className="btn-success" style={{marginRight:'0.5rem'}}>Confirm</button>
                  <button className="btn-danger">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reservations;