// ========================================
// src/components/pages/MenuItems.js
// ========================================
import React, { useState, useEffect } from 'react';
import { menuItemAPI } from '../../services/api';

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    menuItemAPI.getAll()
      .then(res => {
        setMenuItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading menu items...</div>;

  return (
    <div>
      <div className="card-header">
        <h1>🍕 Menu Items</h1>
        <button className="btn-primary">+ Add Menu Item</button>
      </div>
      {menuItems.length === 0 ? (
        <div className="card"><p>No menu items found.</p></div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.MenuItemID}>
                <td>{item.MenuItemID}</td>
                <td>{item.Name}</td>
                <td>${item.Price}</td>
                <td>{item.Category}</td>
                <td>{item.Availability ? '✅ Available' : '❌ Not Available'}</td>
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

export default MenuItems;