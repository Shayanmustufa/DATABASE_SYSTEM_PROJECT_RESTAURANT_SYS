import React, { useState, useEffect } from 'react';
import { discountAPI } from '../../services/api';

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    discountAPI.getAll()
      .then(res => {
        setDiscounts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading discounts...</div>;

  return (
    <div>
      <div className="card-header">
        <h1>🎫 Discounts</h1>
        <button className="btn-primary">+ Add Discount</button>
      </div>
      {discounts.length === 0 ? (
        <div className="card"><p>No discounts found.</p></div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Percentage</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map(discount => (
              <tr key={discount.DiscountID}>
                <td>{discount.DiscountID}</td>
                <td>{discount.Name}</td>
                <td>{discount.Percentage}%</td>
                <td>{discount.StartDate}</td>
                <td>{discount.EndDate}</td>
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

export default Discounts;
