import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../../services/api';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedbackAPI.getAll()
      .then(res => {
        setFeedbacks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading feedback...</div>;

  return (
    <div>
      <h1>⭐ Customer Feedback</h1>
      {feedbacks.length === 0 ? (
        <div className="card"><p>No feedback found.</p></div>
      ) : (
        <div>
          {feedbacks.map(feedback => (
            <div className="card" key={feedback.FeedbackID}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div>
                  <strong>Rating: {'⭐'.repeat(feedback.Rating)}</strong>
                  <p>{feedback.Comment}</p>
                  <small style={{color:'gray'}}>Date: {feedback.Date}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;