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
import { getLanguageNames } from '@/utils/languageUtils';

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
  const options = ["None", "Most relevant", "Most recent", "Highest Rating"];
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(5);
  const [user, setUser] = useState("")
  const [addToGiglist, setAddToGiglist] = useState(false)
  const [addReviewError, setAddReviewError] = useState("");
  const [freelancerProfile, setFreelancerProfile] = useState(null);
  const [showContactTooltip, setShowContactTooltip] = useState(false);

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

  // Fetch freelancer profile data using username
  const fetchFreelancerProfile = async (username) => {
    try {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      console.log('Fetching profile for username:', username);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add auth header if token exists
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
      
      // First, get the user ID from username
      const userResponse = await fetch(`${apiHost}/base/get_user_by_username/${username}/`, {
        headers
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('User data from username:', userData);
        
        // Then, get the full profile data using the user ID
        const profileResponse = await fetch(`${apiHost}/base/users/${userData.id}/`, {
          headers
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('Full profile data:', profileData);
          setFreelancerProfile(profileData);
        } else {
          console.error('Failed to fetch profile data:', profileResponse.status);
        }
      } else {
        console.error('Failed to fetch user data:', userResponse.status);
      }
    } catch (err) {
      console.error('Failed to fetch freelancer profile:', err);
    }
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
        
        // Fetch freelancer profile data using the username
        if (data.freelancer) {
          await fetchFreelancerProfile(data.freelancer);
        }
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
    setAddReviewError("");
    
    // Debug: Log user and gig info to see what we're comparing
    console.log('Current user:', currentUser);
    console.log('Gig data:', gig);
    console.log('Comparing:', currentUser?.id, 'with', gig?.user_id);
    
    // Check if current user is the gig owner - prevent API call entirely
    if (currentUser && gig.user_id && currentUser.id === gig.user_id) {
      setAddReviewError('You cannot add a review on your own gig.');
      return;
    }
    
    // Also check if user is not logged in
    if (!currentUser) {
      setAddReviewError('You must be logged in to add a review.');
      return;
    }
    
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
      let msg = err?.response?.data?.detail || err?.message || 'Unknown error';
      setAddReviewError(msg);
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
    } else if (option === "Highest Rating") {
      // Sort by rating (highest to lowest)
      sortedReviews.sort((a, b) => b.rating - a.rating);
    }

    setFilteredReviews(sortedReviews);
  };

  //searching reviews
  const handleSearch = (term) => {
    const filtered = reviews.filter((review) =>
      (review.comment || "").toLowerCase().includes((term || "").toLowerCase())
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
      {/* <Breadcrumbs /> */}

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
            {addToGiglist && <AddToGigList setAddToGiglist={setAddToGiglist} gigId={gigId}/>}
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
            {/* Removed 'Services I Provide' section */}
          </div>

          {/* About this agency section - replaced with freelancer info */}
          <div className="about-agency">
            <h2>Get to know {gig.freelancer}</h2>
            <div className="agency-info">
              <img
                src={freelancerProfile?.profile_picture 
                  ? (freelancerProfile.profile_picture.startsWith('http') 
                    ? freelancerProfile.profile_picture 
                    : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${freelancerProfile.profile_picture}`)
                  : "https://via.placeholder.com/80"}
                alt={gig.freelancer}
                className="agency-logo"
              />
              <div className="agency-details">
                <h3>{gig.freelancer}</h3>
                <div className="freelancer-status-contact">
                  <span className="freelancer-status online">● Online</span>
                  <div className="contact-button-container">
                    <button 
                      className="contact-us-agency-button"
                      onClick={() => setShowContactTooltip(!showContactTooltip)}
                    >
                      Contact me
                    </button>
                    {showContactTooltip && (
                      <div className="contact-tooltip">
                        <div className="tooltip-item">
                          <strong>Email:</strong> {freelancerProfile?.email || "Email not available"}
                        </div>
                        <div className="tooltip-item">
                          <strong>Phone:</strong> {freelancerProfile?.contact_number || "Contact number not available"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="agency-stats">
              <p>From: {freelancerProfile?.location || "India"}</p>
              <p>Member since: {freelancerProfile?.date_joined
                ? new Date(freelancerProfile.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : gig.created_at
                ? new Date(gig.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : "May 2025"}</p>
              <p>Languages: {freelancerProfile?.lang_spoken 
                ? (() => {
                    const languageMap = {
                      'en': 'English', 'hi': 'Hindi', 'fr': 'French', 'es': 'Spanish', 
                      'de': 'German', 'zh': 'Chinese', 'ru': 'Russian', 'ja': 'Japanese',
                      'ko': 'Korean', 'ar': 'Arabic', 'pt': 'Portuguese', 'it': 'Italian',
                      'nl': 'Dutch', 'sv': 'Swedish', 'no': 'Norwegian', 'da': 'Danish',
                      'fi': 'Finnish', 'pl': 'Polish', 'tr': 'Turkish', 'he': 'Hebrew',
                      'th': 'Thai', 'vi': 'Vietnamese', 'id': 'Indonesian', 'ms': 'Malay',
                      'tl': 'Tagalog', 'bn': 'Bengali', 'ta': 'Tamil', 'te': 'Telugu',
                      'mr': 'Marathi', 'gu': 'Gujarati', 'kn': 'Kannada', 'ml': 'Malayalam',
                      'pa': 'Punjabi', 'or': 'Odia', 'as': 'Assamese', 'ne': 'Nepali',
                      'si': 'Sinhala', 'my': 'Burmese', 'km': 'Khmer', 'lo': 'Lao',
                      'mn': 'Mongolian', 'ka': 'Georgian', 'hy': 'Armenian', 'az': 'Azerbaijani',
                      'kk': 'Kazakh', 'ky': 'Kyrgyz', 'uz': 'Uzbek', 'tg': 'Tajik',
                      'tk': 'Turkmen', 'af': 'Afrikaans', 'zu': 'Zulu', 'xh': 'Xhosa',
                      'sw': 'Swahili', 'am': 'Amharic', 'ha': 'Hausa', 'yo': 'Yoruba',
                      'ig': 'Igbo', 'rw': 'Kinyarwanda', 'sn': 'Shona', 'st': 'Sesotho',
                      'tn': 'Tswana', 'ts': 'Tsonga', 've': 'Venda', 'ss': 'Swati',
                      'nd': 'Northern Ndebele', 'nr': 'Southern Ndebele', 'ny': 'Chichewa',
                      'mg': 'Malagasy', 'so': 'Somali', 'om': 'Oromo', 'ti': 'Tigrinya',
                      'aa': 'Afar', 'ab': 'Abkhazian', 'ak': 'Akan', 'an': 'Aragonese',
                      'av': 'Avaric', 'ay': 'Aymara', 'ba': 'Bashkir', 'be': 'Belarusian',
                      'bg': 'Bulgarian', 'bh': 'Bihari', 'bi': 'Bislama', 'bm': 'Bambara',
                      'bo': 'Tibetan', 'br': 'Breton', 'bs': 'Bosnian', 'ca': 'Catalan',
                      'ce': 'Chechen', 'ch': 'Chamorro', 'co': 'Corsican', 'cr': 'Cree',
                      'cs': 'Czech', 'cv': 'Chuvash', 'cy': 'Welsh', 'dv': 'Divehi',
                      'dz': 'Dzongkha', 'ee': 'Ewe', 'eo': 'Esperanto', 'et': 'Estonian',
                      'eu': 'Basque', 'fa': 'Persian', 'ff': 'Fulah', 'fo': 'Faroese',
                      'fy': 'Western Frisian', 'ga': 'Irish', 'gd': 'Scottish Gaelic',
                      'gl': 'Galician', 'gn': 'Guarani', 'gv': 'Manx', 'ht': 'Haitian',
                      'hu': 'Hungarian', 'ia': 'Interlingua', 'ie': 'Interlingue',
                      'ik': 'Inupiaq', 'io': 'Ido', 'is': 'Icelandic', 'iu': 'Inuktitut',
                      'jv': 'Javanese', 'ki': 'Kikuyu', 'kj': 'Kuanyama', 'ku': 'Kurdish',
                      'kv': 'Komi', 'kw': 'Cornish', 'lb': 'Luxembourgish', 'lg': 'Ganda',
                      'li': 'Limburgan', 'ln': 'Lingala', 'lt': 'Lithuanian', 'lu': 'Luba-Katanga',
                      'lv': 'Latvian', 'mh': 'Marshallese', 'mi': 'Maori', 'mk': 'Macedonian',
                      'mo': 'Moldavian', 'mt': 'Maltese', 'na': 'Nauru', 'nb': 'Norwegian Bokmål',
                      'nd': 'Northern Ndebele', 'ng': 'Ndonga', 'nn': 'Norwegian Nynorsk',
                      'nr': 'Southern Ndebele', 'nv': 'Navajo', 'oc': 'Occitan', 'oj': 'Ojibwa',
                      'os': 'Ossetian', 'pi': 'Pali', 'ps': 'Pushto', 'qu': 'Quechua',
                      'rm': 'Romansh', 'rn': 'Rundi', 'ro': 'Romanian', 'sa': 'Sanskrit',
                      'sc': 'Sardinian', 'sd': 'Sindhi', 'se': 'Northern Sami', 'sg': 'Sango',
                      'sk': 'Slovak', 'sl': 'Slovenian', 'sm': 'Samoan', 'sq': 'Albanian',
                      'sr': 'Serbian', 'su': 'Sundanese', 'wa': 'Walloon', 'wo': 'Wolof',
                      'yi': 'Yiddish', 'za': 'Zhuang'
                    };
                    return freelancerProfile.lang_spoken.map(lang => languageMap[lang] || lang).join(', ');
                  })()
                : "Hindi, English"}</p>
            </div>
            <p>
              {freelancerProfile?.bio || `Hey there! I'm ${gig.freelancer}, a passionate Front-End Developer and B.Tech CSE student at Maharaja Agrasen College. I specialize in crafting clean, responsive UIs using HTML, CSS, JavaScript and React. I've worked on freelance gigs building sleek, user-friendly interfaces for clients, and I also love turning my own ideas into reality, like RateMate, a smart currency converter, and a Food Waste Reduction app aimed at real-world impact. I'm always building, learning, and ready to take on exciting web projects that make a difference!`}
            </p>
          </div>

          {/* Contact Popup */}
          {/* Removed Contact Popup */}
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

      {/* Reviews section */}
      <div className="gig-reviews">
        <div className="content-wrapper">
          {/* Reviews Header */}
          <div className="reviews-header">
            <h2>Reviews</h2>
            <div className="reviews-count">{reviews.length} reviews for this Gig</div>
          </div>

          {/* Reviews Summary Card */}
          <div className="reviews-summary-card">
            <div className="summary-left">
              <div className="star-breakdown">
                <h4>Rating Breakdown</h4>
                <div className="star-rows">
                  <div className="star-row">
                    <span>5 Stars</span>
                    <span className="star-count">({reviews.filter((r) => Math.round(r.rating) === 5).length})</span>
                  </div>
                  <div className="star-row">
                    <span>4 Stars</span>
                    <span className="star-count">({reviews.filter((r) => Math.round(r.rating) === 4).length})</span>
                  </div>
                  <div className="star-row">
                    <span>3 Stars</span>
                    <span className="star-count">({reviews.filter((r) => Math.round(r.rating) === 3).length})</span>
                  </div>
                  <div className="star-row">
                    <span>2 Stars</span>
                    <span className="star-count">({reviews.filter((r) => Math.round(r.rating) === 2).length})</span>
                  </div>
                  <div className="star-row">
                    <span>1 Star</span>
                    <span className="star-count">({reviews.filter((r) => Math.round(r.rating) === 1).length})</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="summary-right">
              <div className="average-ratings">
                <h4>Average Ratings</h4>
                <div className="rating-item">
                  <span>Seller communication level</span>
                  <span className="rating-value">★ {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}</span>
                </div>
                <div className="rating-item">
                  <span>Quality of delivery</span>
                  <span className="rating-value">★ {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}</span>
                </div>
                <div className="rating-item">
                  <span>Value of delivery</span>
                  <span className="rating-value">★ {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Sort Controls */}
          <div className="reviews-controls">
            <div className="search-section">
              <input
                type="text"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearch(searchTerm);
                  }
                }}
                placeholder="Search reviews..."
                className="search-input"
              />
              <button onClick={() => handleSearch(searchTerm)} className="search-btn">
                Search
              </button>
            </div>
            <div className="sort-section">
              <div className="dropdown-wrapper">
                <div className="dropdown">
                  <button
                    className="sort-btn"
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
          </div>

          {/* Add Review Section */}
          <div className="add-review-section">
            <h4>Write a Review</h4>
            <div className="review-form">
              <div className="rating-selector">
                <span className="rating-label">Your Rating:</span>
                <div className="star-selector">
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
              </div>
              <textarea
                value={newReviewText}
                onChange={e => setNewReviewText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey && newReviewText.trim()) {
                    e.preventDefault();
                    handleAddReview();
                  }
                }}
                placeholder="Write your review..."
                rows={4}
                className="review-textarea"
              />
              <button
                onClick={handleAddReview}
                className="submit-review-btn"
                disabled={!newReviewText.trim()}
              >
                Add Review
              </button>
              {addReviewError && (
                <div className="error-message">
                  {addReviewError}
                </div>
              )}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="reviews-list">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => {
                const isOwnReview = currentUser && (review.reviewer_id === currentUser.id || review.reviewer_name === currentUser.username);
                return (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <img
                        src={review.avatar || 'https://via.placeholder.com/40'}
                        alt="Reviewer Avatar"
                        className="reviewer-avatar"
                      />
                      <div className="reviewer-info">
                        <h5 className="reviewer-name">{review.reviewer_name}</h5>
                        <div className="review-meta">
                          {review.country_code && review.country && (
                            <img
                              src={`https://flagsapi.com/${review.country_code}/flat/32.png`}
                              alt="Country Flag"
                              className="country-flag"
                            />
                          )}
                          <span className="review-location">
                            {review.country ? `${review.country} • ` : ''}
                            {review.created_at ?
                              formatDistanceToNow(new Date(review.created_at), { addSuffix: true }) :
                              (review.time || '')
                            }
                          </span>
                        </div>
                      </div>
                      <div className="review-rating-display">★ {review.rating}</div>
                    </div>
                    
                    <div className="review-content">
                      {editReviewId === review.id ? (
                        <div className="edit-review-form">
                          <div className="edit-rating-selector">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`star ${star <= editReviewRating ? "active" : ""}`}
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
                            className="edit-textarea"
                          />
                          <div className="edit-actions">
                            <button
                              onClick={() => handleSaveEdit(review)}
                              className="save-btn"
                            >
                              <FaCheck /> Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="cancel-btn"
                            >
                              <FaTimes /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="review-text">{review.comment}</div>
                      )}
                      
                      {isOwnReview && editReviewId !== review.id && (
                        <div className="review-actions">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="edit-btn"
                          >
                            <FaPencilAlt /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review)}
                            className="delete-btn"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-reviews">
                <p>No reviews found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;