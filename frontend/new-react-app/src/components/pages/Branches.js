// ========================================
import React, { useState, useEffect } from 'react';
import { branchAPI } from '../../services/api';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    branchAPI.getAll()
      .then(res => {
        setBranches(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading branches...</div>;

  return (
    <div>
      <div className="card-header">
        <h1>🏢 Branches</h1>
        <button className="btn-primary">+ Add Branch</button>
      </div>
      {branches.length === 0 ? (
        <div className="card"><p>No branches found.</p></div>
      ) : (
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
            {branches.map(branch => (
              <tr key={branch.BranchID}>
                <td>{branch.BranchID}</td>
                <td>{branch.Name}</td>
                <td>{branch.Location}</td>
                <td>{branch.Contact}</td>
                <td>
                  <button className="btn-warning" style={{marginRight:'0.5rem'}}>Edit</button>
                  <button className="btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Branches;

