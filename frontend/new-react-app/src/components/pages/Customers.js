import React, { useState, useEffect } from 'react';
import { customerAPI } from '../../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load customers");
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id);
        fetchCustomers(); // Refresh list
      } catch (err) {
        alert('Failed to delete customer');
      }
    }
  };

  if (loading) return <div className="loading">Loading customers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="card-header">
        <h1>👥 Customers</h1>
        <button className="btn-primary">+ Add New Customer</button>
      </div>

      {customers.length === 0 ? (
        <div className="card">
          <p>No customers found. Add some customers in Django admin or create one here!</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Loyalty Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.CustomerID}>
                <td>{customer.CustomerID}</td>
                <td>{customer.FirstName}</td>
                <td>{customer.LastName}</td>
                <td>{customer.Email}</td>
                <td>{customer.Contact}</td>
                <td>{customer.LoyaltyPoints}</td>
                <td>
                  <button className="btn-warning" style={{ marginRight: '0.5rem' }}>Edit</button>
                  <button className="btn-danger" onClick={() => deleteCustomer(customer.CustomerID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Customers;