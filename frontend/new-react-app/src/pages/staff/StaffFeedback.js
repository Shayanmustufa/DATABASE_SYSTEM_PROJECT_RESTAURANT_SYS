import React from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import '../staff.css';

const StaffFeedback = () => {
  const { data, loading, error } = useCRUD('feedbacks');

  if (loading) return <div className="staff-loading">Loading feedback...</div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>⭐ Customer Feedback</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {data.length === 0 ? (
        <div className="no-data"><p>No feedback found</p></div>
      ) : (
        <div className="feedback-grid">
          {data.map(feedback => (
            <div key={feedback.FeedbackID} className="feedback-card">
              <div className="feedback-header">
                <span className="feedback-id">Feedback #{feedback.FeedbackID}</span>
                <span className="feedback-rating">{'⭐'.repeat(feedback.Rating)}</span>
              </div>
              <p className="feedback-comment">{feedback.Comment}</p>
              <p className="feedback-date">
                📅 {new Date(feedback.Date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffFeedback;