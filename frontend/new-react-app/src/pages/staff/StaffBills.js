import React from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import '../staff.css';

const StaffBills = () => {
  const { data, loading, error } = useCRUD('bills');

  if (loading) return <div className="staff-loading">Loading bills...</div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>💰 Bills Management</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {data.length === 0 ? (
        <div className="no-data"><p>No bills found</p></div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Order ID</th>
                <th>Before Discount</th>
                <th>Discount Amount</th>
                <th>Tax Amount</th>
                <th>Total</th>
                <th>Payment Method</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map(bill => {
                const total = parseFloat(bill.TotalBeforeDiscount) - parseFloat(bill.DiscountAmount) + parseFloat(bill.TaxAmount);
                return (
                  <tr key={bill.BillID}>
                    <td>#{bill.BillID}</td>
                    <td>#{bill.OrderID}</td>
                    <td>${parseFloat(bill.TotalBeforeDiscount).toFixed(2)}</td>
                    <td>${parseFloat(bill.DiscountAmount).toFixed(2)}</td>
                    <td>${parseFloat(bill.TaxAmount).toFixed(2)}</td>
                    <td><strong>${total.toFixed(2)}</strong></td>
                    <td>{bill.PaymentMethod}</td>
                    <td>{new Date(bill.PaymentDate).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffBills;