"use client";
import React, { useEffect, useState } from 'react'
import {defaultGig} from "@/utils/constants"
import GigHeader from '../components/GigHeader';
import GigImage from '../components/GigImage';
import GigPackage from '../components/GigPackage';
import Breadcrumbs from '../components/Breadcrumbs';
import "@/app/gigDetails/GigProfilePage.css"

const page = () => {
    
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "Jermam",
      country: "United Kingdom",
      country_code: "GB",
      time: "1 month ago",
      rating: 4.7,
      text: "Effective Reliable Honest Down to earth with someone isn't as technically capable as they are. Delivery time is the only thing that needs to slightly better but apart from that amazing team.",
      avatar: "https://via.placeholder.com/40",
      priceRange: "₹17,200-₹34,400",
      duration: "3 weeks",
      sellerResponse:
        "Thank you for your valuable feedback. We appreciate your honest review. We will definitely work on improving our delivery times.",
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    },
    {
      id: 2,
      user: "bridgegateprop",
      country: "United Kingdom",
      country_code: "GB",
      time: "1 month ago",
      rating: 5,
      text: "I cannot recommend this team enough! This was the 2nd milestone of my fully functional website (₹1250). There were some technical elements involving integrating with an API which the team handled with expertise! We had many issues over the few weeks and the team worked hard to solved them all...",
      avatar: "https://via.placeholder.com/40",
      priceRange: "₹1,250",
      duration: "3 weeks",
      isRepeatClient: true,
      sellerResponse:
        "Thank you for your fantastic review! We are thrilled to hear that you are happy with the website and our team's expertise. We look forward to working with you again!",
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    },
    {
      id: 3,
      user: "AnotherUser",
      country: "United States",
      country_code: "US",
      time: "2 weeks ago",
      rating: 4.5,
      text: "Great service, very professional and responsive. Delivered the project on time and the quality was excellent. Highly recommend!",
      avatar: "https://via.placeholder.com/40",
      priceRange: "₹10,000",
      duration: "2 weeks",
      sellerResponse:
        "Thank you for your kind words! We are glad to know you had a positive experience with our service.",
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    },
  ]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Sort by");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState(reviews);
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

  // Adding new review
  const handleAddReview = () => {
    if (!newReviewText.trim()) return;

    const newReview = {
      id: reviews.length + 1,
      user: "You",
      country: "India",
      country_code: "IN",
      time: "just now",
      rating: newReviewRating,
      text: newReviewText,
      avatar: "https://via.placeholder.com/40",
      priceRange: "₹5,000-₹10,000",
      duration: "1 week",
      sellerResponse: "",
      timestamp: new Date(), // Current timestamp for new reviews
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    setFilteredReviews(updatedReviews);
    setNewReviewText("");
    setNewReviewRating(5);
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
      sortedReviews.sort((a, b) => b.timestamp - a.timestamp);
    } else if (option === "Most relevant") {
      // Sort by rating first, then by timestamp
      sortedReviews.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return b.timestamp - a.timestamp;
      });
    }

    setFilteredReviews(sortedReviews);
  };

  //searching reviews
  const handleSearch = () => {
    const filtered = reviews.filter((review) =>
      review.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReviews(filtered);
  };

  const [expandedReviewId, setExpandedReviewId] = useState(null);

  return (
    <div className="gig-profile-page mt-20">
      {/* <SubNavigationBar /> */}
      <Breadcrumbs />

      <div className="gig-header">
        <div className="content-wrapper">
          <GigHeader
            service_text={defaultGig.service_text}
            avg_rating={defaultGig.avg_rating}
            user_id={defaultGig.user_id}
            num_reviews={defaultGig.num_reviews}
          />
        </div>
      </div>

      <div className="content-wrapper gig-content">
        {" "}
        {/* gig-content itself is wrapped by content-wrapper */}
        <div className="gig-details">
          <GigImage image={defaultGig.image} />

          {/* About this gig section - Reverted to original order */}
          <div className="about-gig">
            <h2>About this gig</h2>
            <p>
              Are you looking for an experienced full-stack web developer to
              take your business to the next level and exceed your expectations?
              I can provide the best solution that is both functional and
              user-friendly.
            </p>
            <p>
              As a full-stack web and software developer, I use the latest
              technologies and development methodologies to ensure your website
              or software is reliable, scalable, and secure.
            </p>
            <p>
              I will help you create an innovative website, web app, or custom
              software to make a massive difference in your business success. I
              will work to bring your idea to life with a well-structured
              development model.
            </p>
            <h3>Technical Skills:</h3>
            <ul>
              <li>Languages: PHP, JavaScript, Python, PL/SQL</li>
              <li>Web Technologies: HTML, CSS, JavaScript, Node, TypeScript</li>
              <li>
                Frameworks: Laravel, Angular, React, Bootstrap, jQuery, React
                Native, Ionic
              </li>
              <li>Databases: MySQL, MongoDB</li>
            </ul>
            <h3>Services I Provide:</h3>
            <ul>
              <li>Complete Website Development</li>
              <li>Custom Web Application Development</li>
              <li>Software Development</li>
              <li>Front-End and Back-End Development</li>
              <li>Responsive and user-friendly design</li>
              <li>API Integration and Development</li>
              <li>Website Maintenance and Support</li>
              <li>Testing and Quality Assurance</li>
            </ul>
          </div>

          {/* About this agency section - Moved back below about-gig */}
          <div className="about-agency">
            <h2>About this agency</h2>
            <div className="agency-info">
              <img
                src="https://via.placeholder.com/80"
                alt="Agency Logo"
                className="agency-logo"
              />
              <div className="agency-details">
                <h3>DevScout Agency</h3>
                <p>Agency | 200 employees</p>
                <p>★ 5.0 (235 reviews)</p>
              </div>
              <button className="contact-us-agency-button">Contact us</button>
            </div>
            <div className="agency-stats">
              <p>From: Bangladesh</p>
              <p>Member since: Jun 2024</p>
              <p>Avg. response time: 1 hour</p>
              <p>Last delivery: about 23 hours</p>
              <p>Languages: Bengali, English</p>
            </div>
            <p>
              DevScout is a trusted Fiverr agency from Bangladesh, specializing
              in web design, mobile app design & development, custom software
              solutions, and IT consulting. We craft innovative, scalable, and
              high-performance digital solutions tailored to diverse business
              needs. Our team stays ahead with the latest technologies to ensure
              seamless user experiences. Whether you're launching a new project
              or enhancing an existing one, we're here to turn your ideas into
              reality. Let's build something exceptional, reach out today!
            </p>
          </div>
        </div>
        <div className="gig-sidebar">
          <GigPackage gig={defaultGig} />
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
                  src={review.avatar}
                  alt="Reviewer Avatar"
                  className="reviewer-avatar"
                />
                <div className="review-content">
                  <h4>
                    {review.user}{" "}
                    {review.isRepeatClient && (
                      <span className="repeat-client">
                        <i className="fas fa-redo"></i> Repeat Client
                      </span>
                    )}
                  </h4>
                  <p className="review-meta">
                    <img
                      src={`https://flagsapi.com/${review.country_code}/flat/32.png`}
                      alt="Country Flag"
                      className="country-flag"
                    />{" "}
                    {review.country} • {review.time}
                  </p>
                  <p className="review-rating">★ {review.rating}</p>
                  <p className="review-text">{review.text}</p>
                  <div className="review-details-bottom">
                    <div className="review-price-duration">
                      <p className="price">{review.priceRange}</p>
                      <p className="duration">{review.duration}</p>
                    </div>
                    {review.sellerResponse && (
                      <div className="seller-response-wrapper">
                        <div
                          className="seller-response-toggle"
                          onClick={() =>
                            setExpandedReviewId(
                              expandedReviewId === review.id ? null : review.id
                            )
                          }
                        >
                          <img
                            src="https://via.placeholder.com/30"
                            alt="Seller Avatar"
                            className="seller-response-avatar"
                          />
                          <span>Seller's Response</span>
                          <i
                            className={`fas fa-chevron-${
                              expandedReviewId === review.id ? "up" : "down"
                            }`}
                          ></i>
                        </div>
                        {expandedReviewId === review.id && (
                          <div className="seller-response-text">
                            <p>{review.sellerResponse}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="review-helpful">
                    <p>Helpful?</p>
                    <button className="helpful-button">
                      <i className="far fa-thumbs-up"></i> Yes
                    </button>
                    <button className="helpful-button">
                      <i className="far fa-thumbs-down"></i> No
                    </button>
                  </div>
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