import React, { useState, useEffect } from 'react';
import axios from 'axios';
const [data, setData] = useState([]);
const Customers = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/customers/")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Customers Page</h1>
      <ul>
        {data.map(customer => (
          <li key={customer.CustomerID}>
            {customer.FirstName} {customer.LastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;
