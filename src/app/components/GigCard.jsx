import React, { useState } from "react";
import "@/app/gig-list/GigList.css";
import useFetchUserByUsername from "@/Hooks/useFetchUserByUsername";
import { CLOUDINARY_URL } from "@/utils/constants";

const GigCard = ({ f }) => {
  // Helper function to get proper image URL
  const [userProfilePic, serUserProfielPic] = useState("")
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/300x200?text=No+Image";
    if (url.startsWith("http")) return url;
    return `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }${url}`;
  };

  const fetchUser = useFetchUserByUsername();

  const Details = async () => {
    const getDetails = await fetchUser(f.name);
    serUserProfielPic(getDetails.profile_picture)
    // console.log("getDetails : ", getDetails.profile_picture)
  };
// console.log("f : " , f)

  Details();

  // Get freelancer profile picture or use the gig image as fallback
  const profilePic = f.freelancer_profile_picture
    ? getImageUrl(f.freelancer_profile_picture)
    : getImageUrl(f.image);

  return (
    <div className="gig-card">
      <div className="gig-card-img-wrap">
        <img
          src={f.image? f.image.startsWith("http") ? f.image : CLOUDINARY_URL+f.image : "https://dummy-image.jpg"}
          alt={f.title}
          className="gig-card-img "
        />
      </div>
      <div className="gig-card-info">
        <div className="gig-card-user">
          <img src={userProfilePic 
              ? userProfilePic.startsWith("http")  
                ? userProfilePic
                : CLOUDINARY_URL+userProfilePic 
              : "https://www.mauicardiovascularsymposium.com/wp-content/uploads/2019/08/dummy-profile-pic-300x300.png"
              } 
              alt={f.name} className="gig-card-user-img" />
          <span className="gig-card-user-name">{f.name}</span>
          {f.badge && <span className="gig-card-badge">{f.badge}</span>}
          {f.tag && <span className="gig-card-tag">{f.tag}</span>}
        </div>
        <div className="gig-card-title">{f.title}</div>
        <div className="gig-card-rating">
          <span>★ {f.rating?.toFixed(1) || "0.0"} </span>
          <span className="gig-card-reviews">({f.reviews || 0})</span>
        </div>
        <div className="gig-card-price">
          From ₹{f.price?.toLocaleString() || 0}
        </div>
        <div className="gig-card-duration">
          Duration: {f.duration || 0} day{f.duration === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
};

export default GigCard;
