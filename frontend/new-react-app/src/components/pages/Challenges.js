import React, { useState, useEffect } from 'react';
import { foodChallengeAPI } from '../../services/api';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    foodChallengeAPI.getAll()
      .then(res => {
        setChallenges(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading challenges...</div>;

  return (
    <div>
      <div className="card-header">
        <h1>🏆 Food Challenges</h1>
        <button className="btn-primary">+ Create Challenge</button>
      </div>
      {challenges.length === 0 ? (
        <div className="card"><p>No challenges found.</p></div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',gap:'1.5rem'}}>
          {challenges.map(challenge => (
            <div className="card" key={challenge.ChallengeID}>
              <h2>{challenge.Name}</h2>
              <p>{challenge.Description}</p>
              <p><strong>Reward:</strong> {challenge.Reward}</p>
              <p><strong>Start:</strong> {challenge.StartDate}</p>
              <p><strong>End:</strong> {challenge.EndDate}</p>
              <button className="btn-success" style={{width:'100%'}}>Participate</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Challenges;