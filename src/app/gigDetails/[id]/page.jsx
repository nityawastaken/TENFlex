"use client";
import React, { useEffect, useState } from 'react'
import {defaultGig} from "@/utils/constants"
import GigHeader from '../../components/GigHeader';
import GigImage from '../../components/GigImage';
import GigPackage from '../../components/GigPackage';
import Breadcrumbs from '../../components/Breadcrumbs';
import "@/app/gigDetails/GigProfilePage.css"
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { reviewService } from '@/utils/services';
import { useUserContext } from '@/app/contexts/UserContext';
import { FaPencilAlt, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import AddToGigList from '@/app/components/AddToGigList';

const page = ({ params }) => {
  const { id } = useParams();
  const { currentUser } = useUserContext();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ordersInQueue, setOrdersInQueue] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Sort by");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const options = ["None", "Most relevant", "Most recent"];
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(5);
  const [user, setUser] = useState("")
  const [addToGiglist, setAddToGiglist] = useState(false)

  // Theme state and persistence
  const [theme, setTheme] = useState("dark");

  const paramsObj = React.use(params);
    const gigId = paramsObj.id;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("userMin");
      const userr = userString ? JSON.parse(userString) : null;
      setUser(userr);
    }
    
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (!id) {
      setError('No gig ID provided');
      setLoading(false);
      return;
    }
    const fetchGig = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        // Use correct endpoint for gig detail
        const url = `${apiHost}/base/gigs/${id}/`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch gig details');
        const data = await res.json();
        setGig(data);
        setOrdersInQueue(data.order_inline_count ?? 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  // Fetch reviews for this gig
  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        // Use correct endpoint for reviews
        const res = await fetch(`${apiHost}/base/reviews/?gig_id=${id}`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setReviews(data.results || data); // handle paginated or array response
        setFilteredReviews(data.results || data);
      } catch (err) {
        setReviews([]);
        setFilteredReviews([]);
      }
    };
    fetchReviews();
  }, [id]);

  if (loading) return <div className="gig-profile-page mt-20">Loading...</div>;
  if (error) return <div className="gig-profile-page mt-20 text-red-600">{error}</div>;
  if (!gig) return null;

  // Adding new review
  const handleAddReview = async () => {
    if (!newReviewText.trim() || !gig?.id) return;
    try {
      await reviewService.createReview({
        gig_id: gig.id,
        rating: newReviewRating,
        comment: newReviewText,
      });
    setNewReviewText("");
    setNewReviewRating(5);
      // Refresh reviews from backend
      const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiHost}/base/reviews/?gig_id=${gig.id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.results || data);
        setFilteredReviews(data.results || data);
      }
    } catch (err) {
      alert('Failed to add review: ' + (err.message || 'Unknown error'));
      console.error('Add review error:', err);
    }
  };

  // Start editing a review
  const handleEditReview = (review) => {
    setEditReviewId(review.id);
    setEditReviewText(review.comment);
    setEditReviewRating(review.rating);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditReviewId(null);
    setEditReviewText("");
    setEditReviewRating(5);
  };

  // Save edited review
  const handleSaveEdit = async (review) => {
    try {
      await reviewService.updateReview(review.id, {
        gig_id: gig.id,
        rating: editReviewRating,
        comment: editReviewText,
      });
      setEditReviewId(null);
      setEditReviewText("");
      setEditReviewRating(5);
      // Refresh reviews from backend
      const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiHost}/base/reviews/?gig_id=${gig.id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.results || data);
        setFilteredReviews(data.results || data);
      }
    } catch (err) {
      alert('Failed to update review: ' + (err.message || 'Unknown error'));
      console.error('Edit review error:', err);
    }
  };

  // Handle sorting
  const handleSort = (option) => {
    setSelected(option);
    setIsOpen(false);

    let sortedReviews = [...filteredReviews];

    if (option === "None") {
      // Reset to original order
      sortedReviews = [...reviews];
    } else if (option === "Most recent") {
      sortedReviews.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : (a.timestamp ? new Date(a.timestamp) : 0);
        const dateB = b.created_at ? new Date(b.created_at) : (b.timestamp ? new Date(b.timestamp) : 0);
        return dateB - dateA;
      });
    } else if (option === "Most relevant") {
      // Sort by rating first, then by created_at
      sortedReviews.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        const dateA = a.created_at ? new Date(a.created_at) : (a.timestamp ? new Date(a.timestamp) : 0);
        const dateB = b.created_at ? new Date(b.created_at) : (b.timestamp ? new Date(b.timestamp) : 0);
        return dateB - dateA;
      });
    }

    setFilteredReviews(sortedReviews);
  };

  //searching reviews
  const handleSearch = () => {
    const filtered = reviews.filter((review) =>
      (review.comment || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReviews(filtered);
  };

  // Add delete review handler
  const handleDeleteReview = async (review) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewService.deleteReview(review.id);
      // Refresh reviews from backend
      const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiHost}/base/reviews/?gig_id=${gig.id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.results || data);
        setFilteredReviews(data.results || data);
      }
    } catch (err) {
      alert('Failed to delete review: ' + (err.message || 'Unknown error'));
      console.error('Delete review error:', err);
    }
  };

  // Helper function to get the correct image URL
  function getImageUrl(picture) {
    if (!picture) return undefined;
    if (picture.startsWith('http')) return picture;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${picture}`;
  }

  return (
    <div className="gig-profile-page mt-24">
      {/* <SubNavigationBar /> */}
      {addToGiglist && <AddToGigList setAddToGiglist={setAddToGiglist} gigId={gigId}/>}
      <Breadcrumbs />

      <div className="gig-header">
        <div className="content-wrapper">
          <GigHeader
            service_text={gig.title}
            avg_rating={gig.avg_rating}
            user_id={gig.freelancer}
            num_reviews={gig.review_count}
            orders_in_queue={ordersInQueue}
          />
        </div>
      </div>

      <div className="content-wrapper gig-content ">
        {" "}
        {/* gig-content itself is wrapped by content-wrapper */}
        <div className="gig-details relative">
          <GigImage image={getImageUrl(gig.picture)} />

          {/* Add to giglist button */}
          { !user?.is_freelancer && <div className='absolute right-2 top-2 z-500'>
            <div>
              <button
                onClick={() => setAddToGiglist(true)}
                className="flex items-center gap-2 transition-transform duration-200 transform hover:-translate-y-1 bg-gradient-to-r from-[#3a2176] to-[#6d28d9] text-white font-semibold px-5 py-2 rounded-lg cursor-pointer shadow-lg hover:shadow-xl border border-purple-700/40"
                style={{
                  boxShadow: "0 2px 12px 0 #6d28d988",
                  border: "1px solid #6d28d9",
                  background: "linear-gradient(90deg, #3a2176 0%, #6d28d9 100%)",
                }}
              >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add To Your GigList
                </button>
              </div>
            
          </div>}

          {/* About this gig section - Now uses real gig data */}
          <div className="about-gig">
            <h2>About this gig</h2>
            <p>{gig.description}</p>
            <h3>Technical Skills:</h3>
            <ul>
              {gig.skills && gig.skills.map(skill => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
            <h3>Services I Provide:</h3>
            <ul>
              {gig.skills && gig.skills.map(skill => (
                <li key={skill.id}>{`I will provide services related to ${skill.name}`}</li>
              ))}
            </ul>
          </div>

          {/* About this agency section - replaced with freelancer info */}
          <div className="about-agency">
            <h2>Get to know {gig.freelancer}</h2>
            <div className="agency-info">
              <img
                src={gig.freelancer_profile_picture || "https://via.placeholder.com/80"}
                alt={gig.freelancer}
                className="agency-logo"
              />
              <div className="agency-details">
                <h3>{gig.freelancer}</h3>
                <span className="freelancer-status online">● Online</span>
                <button className="contact-us-agency-button">Contact me</button>
              </div>
            </div>
            <div className="agency-stats">
              <p>From: {gig.freelancer_country || "India"}</p>
              <p>Member since: {gig.freelancer_member_since
                ? new Date(gig.freelancer_member_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : gig.created_at
                ? new Date(gig.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : "May 2025"}</p>
              <p>Avg. response time: {gig.freelancer_response_time || "1 hour"}</p>
              <p>Languages: {gig.freelancer_languages ? gig.freelancer_languages.join(', ') : "Hindi, English"}</p>
            </div>
            <p>
              {gig.freelancer_bio || `Hey there! I'm ${gig.freelancer}, a passionate Front-End Developer and B.Tech CSE student at Maharaja Agrasen College. I specialize in crafting clean, responsive UIs using HTML, CSS, JavaScript and React. I've worked on freelance gigs building sleek, user-friendly interfaces for clients, and I also love turning my own ideas into reality, like RateMate, a smart currency converter, and a Food Waste Reduction app aimed at real-world impact. I'm always building, learning, and ready to take on exciting web projects that make a difference!`}
            </p>
          </div>
        </div>
        <div className="gig-sidebar">
          <GigPackage
            basePrice={gig.price}
            standardPrice={gig.price + 2000}
            premiumPrice={gig.price + 5000}
            description="Interactive 8 Page Design & Development + Redux + Provided API Integration + Basic Functionality"
            deliveryTime={gig.delivery_time}
            gigId={gig.id}
          />
        </div>
      </div>

      {/* Posts section */}
      <div className="gig-reviews">
        <div className="content-wrapper">
          <h2>Reviews</h2>
          <div className="reviews-summary">
            <h3>{reviews.length} reviews for this Gig</h3>
            <div className="star-rating-breakdown">
              <p>
                5 Stars (
                {reviews.filter((r) => Math.round(r.rating) === 5).length})
              </p>
              <p>
                4 Stars (
                {reviews.filter((r) => Math.round(r.rating) === 4).length})
              </p>
              <p>
                3 Stars (
                {reviews.filter((r) => Math.round(r.rating) === 3).length})
              </p>
              <p>
                2 Stars (
                {reviews.filter((r) => Math.round(r.rating) === 2).length})
              </p>
              <p>
                1 Star (
                {reviews.filter((r) => Math.round(r.rating) === 1).length})
              </p>
            </div>
            <div className="seller-rating-breakdown">
              <p>
                Seller communication level ★{" "}
                {(
                  reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                ).toFixed(1)}
              </p>
              <p>
                Quality of delivery ★{" "}
                {(
                  reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                ).toFixed(1)}
              </p>
              <p>
                Value of delivery ★{" "}
                {(
                  reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                ).toFixed(1)}
              </p>
            </div>
          </div>
          <div className="search-reviews">
            <input
              type="text"
              placeholder="Search reviews"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="sort-reviews">
            <div className="dropdown-wrapper">
              <div className="dropdown">
                <button
                  className="add-review-btn"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selected} <span className="arrow">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <ul className="dropdown-menu">
                    {options.map((option, index) => (
                      <li
                        key={index}
                        onClick={() => handleSort(option)}
                        className="dropdown-item"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Add reviews input */}
          <div className="add-review">
            <div className="review-rating-selector">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= newReviewRating ? "active" : ""}`}
                  onClick={() => setNewReviewRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Write your review..."
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              rows={4}
              className="add-review-textarea"
            />
            <button
              onClick={handleAddReview}
              className="add-review-btn"
              disabled={!newReviewText.trim()}
            >
              Add Review
            </button>
          </div>
          {/* Individual Reviews */}
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => {
              const isOwnReview = currentUser && (review.reviewer_id === currentUser.id || review.reviewer_name === currentUser.username);
              return (
                <div key={review.id} className="individual-review">
                  <img
                    src={review.avatar || 'https://via.placeholder.com/40'}
                    alt="Reviewer Avatar"
                    className="reviewer-avatar"
                  />
                  <div className="review-content">
                    <h4>
                      {review.reviewer_name}
                    </h4>
                    <p className="review-meta">
                      {review.country_code && review.country && (
                      <img
                        src={`https://flagsapi.com/${review.country_code}/flat/32.png`}
                        alt="Country Flag"
                        className="country-flag"
                        />
                      )}
                      {review.country ? `${review.country} • ` : ''}
                      {review.created_at ?
                        formatDistanceToNow(new Date(review.created_at), { addSuffix: true }) :
                        (review.time || '')
                      }
                    </p>
                    {editReviewId === review.id ? (
                      <>
                        <div className="review-rating-selector mb-3 flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`star ${star <= editReviewRating ? "active" : ""}`}
                              style={{
                                color: star <= editReviewRating ? '#FFD700' : '#555',
                                cursor: 'pointer',
                                fontSize: '1.5em',
                                textShadow: star <= editReviewRating ? '0 0 8px #FFD70099' : 'none',
                                transition: 'color 0.2s, text-shadow 0.2s',
                              }}
                              onClick={() => setEditReviewRating(star)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <textarea
                          value={editReviewText}
                          onChange={e => setEditReviewText(e.target.value)}
                          rows={3}
                          className="mb-3 w-full px-4 py-2 rounded-lg shadow focus:outline-none resize-none"
                          style={{
                            background: '#18112c',
                            color: '#fff',
                            border: '2px solid #A020F0',
                            boxShadow: '0 2px 8px 0 #A020F033',
                            fontSize: '1em',
                            transition: 'border 0.2s, box-shadow 0.2s',
                          }}
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleSaveEdit(review)}
                            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
                            style={{ boxShadow: '0 2px 8px 0 #A020F055' }}
                          >
                            <FaCheck /> Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-5 py-2 border-2 border-purple-400 text-purple-300 hover:bg-purple-900/30 hover:text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                          >
                            <FaTimes /> Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="review-rating">★ {review.rating}</p>
                        <div className="review-comment">{review.comment}</div>
                        {isOwnReview && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded flex items-center gap-1 text-xs"
                            >
                              <FaPencilAlt /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review)}
                              className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded flex items-center gap-1 text-xs"
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No reviews found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default page