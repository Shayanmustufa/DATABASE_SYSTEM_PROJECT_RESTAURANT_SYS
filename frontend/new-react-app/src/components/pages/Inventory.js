import React, { useState, useEffect } from 'react';
import { inventoryAPI } from '../../services/api';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inventoryAPI.getAll()
      .then(res => {
        setInventory(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading inventory...</div>;

  return (
    <div>
      <div className="card-header">
        <h1>📦 Inventory</h1>
        <button className="btn-primary">+ Add Item</button>
      </div>
      {inventory.length === 0 ? (
        <div className="card"><p>No inventory items found.</p></div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.ItemID}>
                <td>{item.ItemID}</td>
                <td>{item.ItemName}</td>
                <td>{item.QuantityAvailable}</td>
                <td>{item.ReorderLevel}</td>
                <td>
                  {item.QuantityAvailable <= item.ReorderLevel ? 
                    <span style={{color:'red',fontWeight:'bold'}}>⚠️ Low Stock</span> : 
                    <span style={{color:'green'}}>✅ In Stock</span>
                  }
                </td>
                <td>
                  <button className="btn-success" style={{marginRight:'0.5rem'}}>Restock</button>
                  <button className="btn-warning">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Inventory;