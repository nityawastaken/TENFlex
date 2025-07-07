import React from 'react';
import "@/app/gig-list/GigList.css"

const GigCard = ({ f }) => {

  return (
    <div className="gig-card" >
      <div className="gig-card-img-wrap">
        <img src={f.image} alt={f.name} className="gig-card-img" />
        <button className="gig-card-fav" title="Add to favorites">
          ♡
        </button>
      </div>
      <div className="gig-card-info">
        <div className="gig-card-user">
          <img src={f.image} alt={f.name} className="gig-card-user-img" />
          <span className="gig-card-user-name">{f.name}</span>
          {f.badge && <span className="gig-card-badge">{f.badge}</span>}
          {f.tag && <span className="gig-card-tag">{f.tag}</span>}
        </div>
        <div className="gig-card-title">{f.title}</div>
        <div className="gig-card-rating">
          <span>★ {f.rating} </span>
          <span className="gig-card-reviews">({f.reviews})</span>
        </div>
        <div className="gig-card-price">From ₹{f.price.toLocaleString()}</div>
        <div className="gig-card-duration">Duration: {f.duration} day{f.duration === 1 ? '' : 's'}</div>
      </div>
    </div>
  );
};

export default GigCard;