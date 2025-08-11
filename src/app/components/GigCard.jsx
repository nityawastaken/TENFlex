import React from 'react';
import "@/app/gig-list/GigList.css";

const GigCard = ({ f }) => {
  // Helper function to get proper image URL
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/300x200?text=No+Image";
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${url}`;
  };

  // Get freelancer profile picture or use the gig image as fallback
  const profilePic = f.freelancer_profile_picture 
    ? getImageUrl(f.freelancer_profile_picture)
    : getImageUrl(f.image);

  return (
    <div className="gig-card">
      <div className="gig-card-img-wrap">
        <img src={getImageUrl(f.image)} alt={f.title} className="gig-card-img" />
      </div>
      <div className="gig-card-info">
        <div className="gig-card-user">
          <img src={profilePic} alt={f.name} className="gig-card-user-img" />
          <span className="gig-card-user-name">{f.name}</span>
          {f.badge && <span className="gig-card-badge">{f.badge}</span>}
          {f.tag && <span className="gig-card-tag">{f.tag}</span>}
        </div>
        <div className="gig-card-title">{f.title}</div>
        <div className="gig-card-rating">
          <span>★ {f.rating?.toFixed(1) || "0.0"} </span>
          <span className="gig-card-reviews">({f.reviews || 0})</span>
        </div>
        <div className="gig-card-price">From ₹{f.price?.toLocaleString() || 0}</div>
        <div className="gig-card-duration">Duration: {f.duration || 0} day{f.duration === 1 ? '' : 's'}</div>
      </div>
    </div>
  );
};

export default GigCard;