"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserContext } from "@/app/contexts/UserContext";
import { CiLocationOn } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { FaRegEdit } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { FaRegImage } from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns';

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { NavBtn } from "@/app/components/UserProfile/NavBtn";
import { SectionContainer } from "@/app/components/UserProfile/SectionContainer";
import { SectionParagraph } from "@/app/components/UserProfile/SectionParagraph";
import "react-toastify/dist/ReactToastify.css";
import { gigService } from '@/utils/services';
import GigImage from "@/app/components/GigImage";
import { orderService } from '@/utils/services';

// Add this mapping at the top of the file
const LANGUAGE_CODE_TO_NAME = {
  en: 'English',
  hi: 'Hindi',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  zh: 'Chinese',
  ru: 'Russian',
  // Add more as needed
};

// Add fade-in animation keyframes

// Add fade-in and slide-up animation keyframes (if not already present)

// Modal component
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#24194a] rounded-lg shadow-2xl p-8 relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-2xl hover:text-purple-400 transition-colors">&times;</button>
        {children}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { currentUser, loading: userLoading } = useUserContext();
  const [selectedSection, setSelectedSection] = useState("home");
  const selectedOption = useRef();
  const [selectedOrderFilter, setSelectedOrderFilter] = useState("ongoing");
  const params = useParams();
  const router = useRouter();
  const userIdFromURL = params?.id;
  const [profileUser, setProfileUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("ongoing");
  const [selectedOrderType, setSelectedOrderType] = useState('gig');
  const [orders, setOrders] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [proficiencyLevels, setProficiencyLevels] = useState([]);
  const [completionPercent, setCompletionPercent] = useState(null);

  // After fetching orders, set as_freelancer and as_buyer arrays
  const [freelancerOrders, setFreelancerOrders] = useState([]);
  const [buyerOrders, setBuyerOrders] = useState([]);

  // Fetch available languages and proficiency levels
  useEffect(() => {
    async function fetchLanguageData() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        
        const [languagesRes, proficiencyRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/languages/`, {
            headers: token ? { Authorization: `Token ${token}` } : {},
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/proficiency-levels/`, {
            headers: token ? { Authorization: `Token ${token}` } : {},
          })
        ]);

        if (languagesRes.ok) {
          const languagesData = await languagesRes.json();
          setAvailableLanguages(languagesData);
        }

        if (proficiencyRes.ok) {
          const proficiencyData = await proficiencyRes.json();
          setProficiencyLevels(proficiencyData);
        }
      } catch (error) {
        console.error("Error fetching language data:", error);
      }
    }

    fetchLanguageData();
  }, []);

  // Fetch orders
useEffect(() => {
    async function fetchOrders() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/my_orders/`, {
          headers: token ? { Authorization: `Token ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        console.log('Fetched orders:', data);
        setFreelancerOrders(Array.isArray(data.as_freelancer) ? data.as_freelancer : []);
        setBuyerOrders(Array.isArray(data.as_buyer) ? data.as_buyer : []);
      } catch (err) {
        setFreelancerOrders([]);
        setBuyerOrders([]);
      }
    }
    fetchOrders();
  }, []);

  // Use freelancerOrders for the Orders section (as freelancer)
  const gigOrders = freelancerOrders.filter(o => o.type === 'gig');
  const projectOrders = freelancerOrders.filter(o => o.type === 'project');

  // Calculate ongoing and completed orders (gig + project)
  const ongoingOrdersCount = freelancerOrders.filter(o => {
    const status = o.status && o.status.toLowerCase();
    return status === 'ongoing' || status === 'pending';
  }).length;
  const completedOrdersCount = freelancerOrders.filter(o => o.status && o.status.toLowerCase() === 'completed').length;
  
  // Normalize status comparison and add debug logs
  const filteredGigOrders = gigOrders.filter(
    o => !selectedOrderStatus || (o.status && o.status.toLowerCase() === selectedOrderStatus.toLowerCase())
  );
  const filteredProjectOrders = projectOrders.filter(
    o => !selectedOrderStatus || (o.status && o.status.toLowerCase() === selectedOrderStatus.toLowerCase())
  );
  console.log('gigOrders:', gigOrders);
  console.log('filteredGigOrders:', filteredGigOrders);
  const orderStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
  ];

  // Fetch profile completion percentage
  useEffect(() => {
    async function fetchCompletionPercent() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/users/get-completion-percentage/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch completion percent');
        const percent = await res.json();
        setCompletionPercent(percent);
      } catch (err) {
        setCompletionPercent(null);
      }
    }
    fetchCompletionPercent();
  }, []);

  // Guard for invalid or missing ID
  if (!userIdFromURL || userIdFromURL === "undefined") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Invalid profile URL.
      </main>
    );
  }

useEffect(() => {
    if (!userIdFromURL) return;
    setLoading(true);
    setError(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    Promise.all([
      fetch(`http://localhost:8000/base/users/${userIdFromURL}/`, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      }).then(res => {
        if (!res.ok) throw new Error("Profile not found");
        return res.json();
      }),
      fetch(`http://localhost:8000/base/reviews/?reviewee_id=${userIdFromURL}`, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      }).then(res => res.json())
    ])
      .then(async ([profileData, reviewsData]) => {
        // Log the full profile data for debugging
        console.log("Profile data:", profileData);
        // Get gig IDs from the correct path
        const gigIds = profileData.gig_ids || (profileData.debug_info && profileData.debug_info.gig_ids) || [];
        // Map backend fields to frontend fields
        const getProfilePictureUrl = (picture) => {
          if (!picture) return null;
          if (picture.startsWith('http')) return picture;
          return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${picture}`;
        };
        const mappedProfile = {
          name: (`${profileData.first_name || ""} ${profileData.last_name || ""}`.trim()) || profileData.username,
          location: profileData.location,
          email: profileData.email,
          role: profileData.role_display,
          purpose: profileData.use_purpose_display,
          experience: profileData.experience_display,
          avgRating: profileData.avg_rating ?? "N/A",
          ongoingOrders: profileData.inline_orders ?? 0,
          completedOrders: profileData.completed_orders ?? 0,
          profile_picture: getProfilePictureUrl(profileData.profile_picture),
          username: profileData.username,
          id: profileData.id,
          languages: profileData.languages || [],
          lang_spoken: profileData.lang_spoken,
          bio: profileData.bio,
          skills: profileData.skills,
          category_tags: profileData.category_tags,
          gig_ids: gigIds,
        };
        setProfileUser(mappedProfile);
        setReviews(reviewsData.results || reviewsData); // handle paginated or array
        // Fetch gig details for each gig_id
        if (gigIds.length > 0) {
          const gigDetails = await Promise.all(
            gigIds.map(id =>
              fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/base/gigs/${id}/`)
                .then(res => res.json())
                .catch(() => null)
            )
          );
          setGigs(gigDetails.filter(gig => gig && gig.id));
        } else {
          setGigs([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, [userIdFromURL]);

  const handleSelectOrderFilter = () => {
    setSelectedOrderFilter(selectedOption.current.value);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/base/users/${currentUser.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete account");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      toast.success("Account deleted successfully");
      router.push("/signin");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Could not delete account. Try again.");
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  // Section/card fade-in and hover effect
  const cardClass = "mb-8 bg-[#1a1333] rounded-lg shadow-lg p-6 animate-fadeIn transition-all duration-700 ease-out backdrop-blur-md border-2 border-transparent hover:border-gradient-to-r from-purple-400 to-pink-400 hover:scale-105 hover:shadow-2xl";
  const cardInnerClass = "bg-[#24194a] p-3 rounded mb-2 hover:scale-105 hover:shadow-xl transition-transform duration-300";
  const buttonClass = "px-4 py-2 bg-purple-600 hover:bg-purple-800 rounded text-white font-semibold transition-transform duration-200 hover:scale-105 hover:shadow-lg";

  if (loading || userLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading profile...
      </main>
    );
  }
  if (error || !profileUser) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        {error || "Profile not found."}
      </main>
    );
  }

  // Helper for showing edit/delete only for own profile
  const isOwnProfile = currentUser && profileUser && currentUser.id === profileUser.id;

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadeIn { animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadeInUp { animation: fadeInUp 0.7s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.95); }
          80% { opacity: 1; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-popIn { animation: popIn 0.4s cubic-bezier(0.4,0,0.2,1) both; }
        .glass-card {
          background: rgba(36, 25, 74, 0.7);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .glass-card:hover {
          transform: translateY(-6px) scale(1.025);
          box-shadow: 0 20px 40px 0 rgba(126, 87, 194, 0.25);
        }
        .glass-sidebar {
          background: rgba(36, 25, 74, 0.85);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1.5px solid rgba(255,255,255,0.10);
          transition: box-shadow 0.2s;
        }
        .glass-sidebar:hover {
          box-shadow: 0 16px 32px 0 rgba(126, 87, 194, 0.18);
        }
        .sidebar-nav-item {
          position: relative;
        }
        .sidebar-nav-item:hover, .sidebar-nav-item:focus {
          background: linear-gradient(90deg, rgba(126,87,194,0.10) 0%, rgba(236,72,153,0.10) 100%);
          color: #fff !important;
        }
        .sidebar-nav-item:active {
          background: rgba(126,87,194,0.18);
        }
        html {
          scroll-behavior: smooth;
        }
        .modal-pop {
          animation: popIn 0.35s cubic-bezier(0.4,0,0.2,1) both;
        }
        /* Gigs section card styles - landscape */
        .gig-profile-card-landscape {
          box-shadow: 0 4px 24px 0 rgba(80, 0, 120, 0.13);
          border-radius: 1.25rem;
          border: 1.5px solid rgba(168, 85, 247, 0.10);
          background: linear-gradient(135deg, #18112c 0%, #24194a 100%);
          transition: box-shadow 0.25s, transform 0.25s, border 0.25s;
          display: flex;
          flex-direction: row;
          align-items: stretch;
          min-width: 0;
        }
        .gig-profile-card-landscape:hover {
          box-shadow: 0 12px 48px 0 rgba(160, 32, 240, 0.18);
          border: 1.5px solid #A020F0;
          background: linear-gradient(135deg, #24194a 0%, #18112c 100%);
        }
        @media (max-width: 640px) {
          .gig-profile-card-landscape {
            flex-direction: column;
            height: auto !important;
            min-height: 120px;
          }
          .gig-profile-card-landscape > div:first-child {
            border-radius: 1.25rem 1.25rem 0 0 !important;
            width: 100% !important;
            height: 100px !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-[#1a1333] to-[#2d1a4d] text-white p-6 pt-28 flex">
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
        {/* Sidebar */}
        <aside className="w-64 mr-8 hidden md:block animate-fadeInUp glass-sidebar transition-all duration-500" style={{ animationDelay: '0.2s', minWidth: '260px' }}>
          <div className="flex flex-col items-center gap-6 py-8 px-6 bg-white/10 rounded-xl shadow-xl border border-white/10 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-popIn" style={{ animationDelay: '0.25s' }}>
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-md mb-2 bg-gray-900 flex items-center justify-center">
              {profileUser?.profile_picture ? (
                <img src={profileUser.profile_picture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-gray-200">{profileUser?.name?.[0] || 'U'}</span>
              )}
            </div>
            <div className="text-xl font-semibold text-white text-center">{profileUser?.name || 'User Name'}</div>
            <div className="flex items-center gap-2 text-gray-300 text-sm"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" /></svg>{profileUser?.email || 'email@email.com'}</div>
            <div className="flex items-center gap-2 text-gray-300 text-sm"><CiLocationOn className="text-gray-400 text-lg" />{profileUser?.location || 'Location'}</div>
            <div className="h-px w-full bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 opacity-30 my-4"></div>
            <div className="w-full flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-400">Experience</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-100 font-medium tracking-wide min-w-[60px] text-center">{profileUser?.experience || profileUser?.experience_display || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-400">Avg. Rating</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-yellow-300 font-semibold flex items-center gap-1 min-w-[60px] justify-center">{profileUser?.avgRating ?? 'N/A'} <svg className="w-3.5 h-3.5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg></span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-400">Ongoing Orders</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-blue-200 font-semibold min-w-[60px] text-center">{ongoingOrdersCount}</span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-400">Completed Orders</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-green-200 font-semibold min-w-[60px] text-center">{completedOrdersCount}</span>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 opacity-30 my-4"></div>
          <nav className="sticky top-32 p-0">
            <ul className="space-y-2">
              <li><a href="#about" className="w-full block text-left px-4 py-2 rounded-lg font-semibold text-purple-300 hover:text-white hover:bg-purple-700/40 transition-all duration-200 sidebar-nav-item" data-tooltip-id="about-tip">About</a><Tooltip id="about-tip">About</Tooltip></li>
              <li><a href="#languages" className="w-full block text-left px-4 py-2 rounded-lg font-semibold text-purple-300 hover:text-white hover:bg-purple-700/40 transition-all duration-200 sidebar-nav-item" data-tooltip-id="languages-tip">Languages</a><Tooltip id="languages-tip">Languages</Tooltip></li>
              <li><a href="#gigs" className="w-full block text-left px-4 py-2 rounded-lg font-semibold text-purple-300 hover:text-white hover:bg-purple-700/40 transition-all duration-200 sidebar-nav-item" data-tooltip-id="gigs-tip">Gigs</a><Tooltip id="gigs-tip">Gigs</Tooltip></li>
              <li><a href="#orders" className="w-full block text-left px-4 py-2 rounded-lg font-semibold text-purple-300 hover:text-white hover:bg-purple-700/40 transition-all duration-200 sidebar-nav-item" data-tooltip-id="orders-tip">Orders</a><Tooltip id="orders-tip">Orders</Tooltip></li>
              <li><a href="#reviews" className="w-full block text-left px-4 py-2 rounded-lg font-semibold text-purple-300 hover:text-white hover:bg-purple-700/40 transition-all duration-200 sidebar-nav-item" data-tooltip-id="reviews-tip">Reviews</a><Tooltip id="reviews-tip">Reviews</Tooltip></li>
          </ul>
        </nav>
        </aside>
        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto">
          {/* Profile Completion Progress Bar */}
          {completionPercent !== null && (
            <div className="w-full mb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-purple-400">Profile Completion</span>
                <span className="text-sm font-semibold text-purple-400">{completionPercent}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 shadow-inner">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-[#A020F0] to-purple-400 transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
              ></div>
              </div>
            </div>
          )}
          {/* About Section */}
          <div id="about" className={cardClass + " animate-fadeInUp animate-popIn transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"} style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2 animate-popIn" style={{ animationDelay: '0.35s' }}>
              About
              {isOwnProfile && (
                <Link href={`/profile/${profileUser?.id}/edit`} className={buttonClass + " absolute top-6 right-6 flex items-center gap-2 text-sm"} style={{textDecoration: 'none'}}>
                  <FaRegEdit className="text-base" /> Edit
                </Link>
              )}
                </h2>
            <div className="text-base text-gray-200">{profileUser?.bio || "No bio yet."}</div>
              </div>
          {/* Languages Section */}
          <div id="languages" className={cardClass + " animate-fadeInUp animate-popIn transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"} style={{ animationDelay: '0.35s' }}>
            <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.4s' }}>Languages</h2>
              <ul className="flex flex-col gap-1">
              {Array.isArray(profileUser?.languages) && profileUser.languages.length > 0 ? (
                profileUser.languages.map((lang, i) => {
                  const languageName = availableLanguages.find(l => l.code === lang.language)?.name || lang.language;
                  const proficiencyName = proficiencyLevels.find(p => p.code === lang.proficiency)?.name || lang.proficiency;
                  return (
                    <li key={i} className="text-base text-purple-300">
                      {languageName} ({proficiencyName})
                  </li>
                  );
                })
              ) : Array.isArray(profileUser?.lang_spoken) && profileUser.lang_spoken.length > 0 ? (
                profileUser.lang_spoken.map((code, i) => (
                  <li key={i} className="text-base text-purple-300">
                    {LANGUAGE_CODE_TO_NAME[code] || code}
                    </li>
                ))
              ) : (
                <li className="text-base text-purple-300">N/A</li>
              )}
              </ul>
          </div>
          {/* Gigs Section (was Services) */}
          <div id="gigs" className={cardClass + " animate-fadeInUp animate-popIn transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"} style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.45s' }}>Gigs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.length === 0 ? (
                <div className="text-gray-300">No gigs found.</div>
              ) : (
                gigs.map(gig => {
                  // Helper to get correct image URL
                  const getImageUrl = (picture) => {
                    if (!picture) return undefined;
                    if (picture.startsWith('http')) return picture;
                    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${picture}`;
                  };
                  const imageUrl = getImageUrl(gig.picture);
                  return (
                    <Link key={gig.id} href={`/gigDetails/${gig.id}`} className="block">
                      <div className="gig-profile-card group flex flex-col gap-2 items-center h-full min-h-[260px] transition-transform duration-300 rounded-2xl shadow-lg border border-purple-900/30 bg-gradient-to-br from-gray-900 via-[#1a1333] to-[#24194a] hover:scale-105 hover:shadow-2xl hover:border-purple-500 relative overflow-hidden">
                        <div className="w-full flex justify-center items-center mb-2 h-48 bg-gradient-to-tr from-[#A020F0]/30 to-[#24194a] rounded-xl overflow-hidden relative shadow-md group-hover:shadow-xl transition-all duration-300">
                          {imageUrl ? (
                            <GigImage image={imageUrl} />
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                              <FaRegImage className="text-3xl md:text-4xl mb-1" />
                              <span className="text-xs">No Image</span>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 bg-[#A020F0]/80 text-white text-[10px] px-2 py-0.5 rounded-full shadow font-semibold tracking-wide group-hover:bg-purple-700/90 transition">GIG</div>
                        </div>
                        <div className="font-semibold text-purple-200 text-xs md:text-sm text-center line-clamp-2 group-hover:text-white transition">{gig.title}</div>
                        <div className="font-bold text-purple-400 text-xs md:text-sm text-center group-hover:text-[#A020F0] transition">From ${Number(gig.price).toLocaleString(undefined, { minimumFractionDigits: 0 })}</div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
          {/* Orders Section */}
          <div id="orders" className={cardClass + " animate-fadeInUp animate-popIn transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"} style={{ animationDelay: '0.45s' }}>
            <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.5s' }}>Orders</h2>
            {/* Tabs for Gig Orders and Project Orders */}
            <div className="flex gap-2 mb-4">
              <button
                className={`px-4 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${selectedOrderType === 'gig' ? 'bg-purple-700 text-white' : 'bg-[#24194a] text-purple-300 hover:bg-purple-800/40'}`}
                onClick={() => setSelectedOrderType('gig')}
              >
                Gig Orders
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${selectedOrderType === 'project' ? 'bg-purple-700 text-white' : 'bg-[#24194a] text-purple-300 hover:bg-purple-800/40'}`}
                onClick={() => setSelectedOrderType('project')}
              >
                Project Orders
              </button>
            </div>
            <div className="mb-4">
              <select className="px-4 py-2 border border-purple-700 rounded bg-[#24194a] text-white" value={selectedOrderStatus} onChange={e => setSelectedOrderStatus(e.target.value)}>
                {orderStatusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                </select>
            </div>
            <div className="space-y-6">
              {(selectedOrderType === 'gig' ? filteredGigOrders : filteredProjectOrders).length === 0 ? (
                <div className="text-gray-300">No orders found.</div>
              ) : (
                (selectedOrderType === 'gig' ? filteredGigOrders : filteredProjectOrders).map(order => (
                  <div key={order.id} className="bg-[#18112c] rounded-lg p-6 shadow-md border border-purple-900/30 mb-2 relative">
                    {/* Type badge */}
                    <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${order.type === 'gig' ? 'bg-purple-600 text-white' : 'bg-pink-500 text-white'}`}>{order.type === 'gig' ? 'Gig' : 'Project'}</span>
                    
                    {order.type === 'gig' ? (
                      // Gig Order Display
                      <div className="space-y-3">
                        <div className="text-base font-semibold mb-2 text-purple-200">Gig: {order.gig_title || 'Untitled Gig'}</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Order Placed:</span>
                            <div className="text-purple-200 font-medium">
                              {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Client:</span>
                            <div className="text-purple-200 font-medium">{order.buyer_name || 'Unknown'}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Price:</span>
                            <div className="text-green-400 font-bold">${order.price || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Deadline:</span>
                            <div className="text-purple-200 font-medium">
                              {order.deadline ? new Date(order.deadline).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Project Order Display
                      <div className="space-y-3">
                        <div className="text-base font-semibold mb-2 text-purple-200">Project: {order.project_title || 'Untitled Project'}</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Order Placed:</span>
                            <div className="text-purple-200 font-medium">
                              {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Client:</span>
                            <div className="text-purple-200 font-medium">{order.buyer_name || 'Unknown'}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Price:</span>
                            <div className="text-green-400 font-bold">${order.price || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Deadline:</span>
                            <div className="text-purple-200 font-medium">
                              {order.deadline ? new Date(order.deadline).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-8 mt-4 mb-2">
                      <img src={order.buyer_avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="avatar" className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400 bg-yellow-400" />
                      <div className="flex-1 flex justify-end">
                        <a href={`/${order.type}Details/${order.item_id}`} className="text-purple-400 font-bold underline hover:text-pink-400 transition-colors">View</a>
                      </div>
                    </div>
                    <hr className="border-t border-purple-900/30 mt-4" />
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Reviews Section */}
          <div id="reviews" className={cardClass + " animate-fadeInUp animate-popIn transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"} style={{ animationDelay: '0.5s' }}>
            <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.55s' }}>Reviews</h2>
            <div className="space-y-8">
              {reviews.length === 0 ? (
                <div className="text-gray-400">No reviews yet.</div>
              ) : (
                reviews.map((review, i) => (
                  <div key={review.id || i} className="flex gap-4 items-start border-b border-purple-900/30 pb-6 mb-6">
                    <img
                      src={review.avatar || 'https://via.placeholder.com/40'}
                      alt="Reviewer Avatar"
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-purple-200">{review.reviewer_name}</span>
                        {review.country && (
                          <span className="flex items-center gap-1 text-sm text-purple-300">
                            <img
                              src={review.country_code ? `https://flagsapi.com/${review.country_code}/flat/32.png` : ''}
                              alt="Country Flag"
                              className="w-5 h-5 rounded-sm"
                            />
                            {review.country}
                          </span>
                        )}
                        {/* Time duration */}
                        {review.created_at && (
                          <span className="text-xs text-gray-400 ml-2">
                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx} className={idx < Math.round(review.rating) ? 'text-yellow-400' : 'text-gray-500'}>★</span>
                        ))}
                      </div>
                      <div className="text-gray-200 mb-2">{review.comment}</div>
                      {(review.gig_title || review.project_title) && (
                        <div className="text-sm text-purple-300">
                          on {review.gig_title ? 'gig' : 'project'}: {' '}
                          <a
                            href={`/${review.gig_title ? 'gigDetails' : 'projectDetails'}/${review.gig_id || review.project_id}`}
                            className="underline hover:text-pink-400"
                          >
                            {review.gig_title || review.project_title}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Delete Account Button */}
          {isOwnProfile && (
            <button onClick={handleDeleteAccount} className={buttonClass}>Delete Account</button>
          )}
        </div>
        {(loading || userLoading) && <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div></div>}
      </div>
    </>
  );
}
