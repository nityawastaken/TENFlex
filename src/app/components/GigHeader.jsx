import React from 'react';

function GigHeader({ service_text, avg_rating, user_id, num_reviews, orders_in_queue }) {
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
        <span>{orders_in_queue} Orders in Queue</span>
      </div>
    </div>
  );
}

export default GigHeader;