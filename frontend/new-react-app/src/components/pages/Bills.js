import React, { useState, useEffect } from 'react';
import { billAPI } from '../../services/api';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    billAPI.getAll()
      .then(res => {
        setBills(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading bills...</div>;

  return (
    <div>
      <div className="card-header">
        <h1>💰 Bills</h1>
      </div>
      {bills.length === 0 ? (
        <div className="card"><p>No bills found.</p></div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Order ID</th>
              <th>Before Discount</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Payment Method</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.BillID}>
                <td>{bill.BillID}</td>
                <td>{bill.OrderID}</td>
                <td>${bill.TotalBeforeDiscount}</td>
                <td>${bill.DiscountAmount}</td>
                <td>${bill.TaxAmount}</td>
                <td>{bill.PaymentMethod}</td>
                <td>{new Date(bill.PaymentDate).toLocaleDateString()}</td>
                <td>
                  <button className="btn-primary">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Bills;
