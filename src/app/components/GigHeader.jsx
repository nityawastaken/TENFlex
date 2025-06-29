import React from 'react';

function GigHeader({ service_text, avg_rating, user_id, num_reviews }) {
  return (
    <div className="gig-header">
      <h2>{service_text}</h2>
      <div className="gig-meta">
        <div className="rating-stars">
          {/* Render stars based on avg_rating */}
          {'⭐'.repeat(Math.round(avg_rating))}
        </div>
        <span className="average-rating">{avg_rating.toFixed(1)}</span>
        <span className="rating-count">({num_reviews} reviews)</span>
        <span className="separator">|</span>
        <span>{user_id}</span>
        <span className="separator">|</span>
        <span>0 Orders in Queue</span> {/* Placeholder for orders in queue */}
      </div>
    </div>
  );
}

export default GigHeader;