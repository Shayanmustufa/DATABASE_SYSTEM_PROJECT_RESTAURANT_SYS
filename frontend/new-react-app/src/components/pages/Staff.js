// ========================================
import React, { useState, useEffect } from 'react';
import { staffAPI } from '../../services/api';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    staffAPI.getAll()
      .then(res => {
        setStaff(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading staff...</div>;

  return (
    <div>
      <div className="card-header">
        <h1>👨‍💼 Staff</h1>
        <button className="btn-primary">+ Add Staff Member</button>
      </div>
      {staff.length === 0 ? (
        <div className="card"><p>No staff members found.</p></div>
      ) : (
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
            {staff.map(member => (
              <tr key={member.StaffID}>
                <td>{member.StaffID}</td>
                <td>{member.Name}</td>
                <td>{member.Role}</td>
                <td>${member.Salary}</td>
                <td>
                  <button className="btn-warning" style={{marginRight:'0.5rem'}}>Edit</button>
                  <button className="btn-danger">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Staff;