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

const page = () => {
  const { id } = useParams();
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

  // Theme state and persistence
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    
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
        console.log('Fetching gig details for ID:', id);
        const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const url = `${apiHost}/base/gigs/${id}/`;
        console.log('Fetching from URL:', url);
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch gig details');
        const data = await res.json();
        setGig(data);
        setOrdersInQueue(data.orders_in_queue ?? 0);
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
        const res = await fetch(`${apiHost}/base/reviews/?gig=${id}`);
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
      const res = await fetch(`${apiHost}/base/reviews/?gig=${gig.id}`);
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

  // Helper function to get the correct image URL
  function getImageUrl(picture) {
    if (!picture) return undefined;
    if (picture.startsWith('http')) return picture;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${picture}`;
  }

  return (
    <div className="gig-profile-page mt-20">
      {/* <SubNavigationBar /> */}
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

      <div className="content-wrapper gig-content">
        {" "}
        {/* gig-content itself is wrapped by content-wrapper */}
        <div className="gig-details">
          <GigImage image={getImageUrl(gig.picture)} />

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
            filteredReviews.map((review) => (
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
                  <p className="review-rating">★ {review.rating}</p>
                  <div className="review-comment">{review.comment}</div>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default page