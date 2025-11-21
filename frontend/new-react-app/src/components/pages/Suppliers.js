// ========================================
import React, { useState, useEffect } from 'react';
import { supplierAPI } from '../../services/api';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supplierAPI.getAll()
      .then(res => {
        setSuppliers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading suppliers...</div>;

  return (
    <div>
      <div className="card-header">
        <h1>🚚 Suppliers</h1>
        <button className="btn-primary">+ Add Supplier</button>
      </div>
      {suppliers.length === 0 ? (
        <div className="card"><p>No suppliers found.</p></div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier.SupplierID}>
                <td>{supplier.SupplierID}</td>
                <td>{supplier.Name}</td>
                <td>{supplier.Contact}</td>
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

export default Suppliers;