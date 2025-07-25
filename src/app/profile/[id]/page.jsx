"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserContext } from "@/app/contexts/UserContext";
import { CiLocationOn } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaRegEdit, FaCopy, FaPencilAlt, FaTrash } from 'react-icons/fa';
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
import { userService } from '@/utils/services';
import { reviewService } from '@/utils/services';
// Remove: import GigCard from "@/app/components/GigCard";
// Remove: import "@/app/gig-list/GigList.css";

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

// Add fade-in and slide-up animation keyframes (if not already present)x`

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

// Add a simple 3-dots menu component
function ThreeDotsMenu({ options, onSelect }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className={`text-gray-400 hover:text-purple-400 text-xl focus:outline-none ${options.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => options.length > 0 && setOpen((v) => !v)}
        aria-label="Order options"
        type="button"
        disabled={options.length === 0}
        title={options.length === 0 ? 'No actions available' : 'Change order status'}
      >
        <span className="inline-block w-6 h-6 flex items-center justify-center">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </span>
      </button>
      {open && options.length > 0 && (
        <div className="absolute right-0 top-8 bg-[#2d225a] border border-purple-700 rounded shadow-lg z-40 min-w-[140px] flex flex-col">
          {options.map((opt) => (
            <button
              key={opt.value}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-purple-600 transition-colors whitespace-nowrap"
              onClick={() => {
                setOpen(false);
                onSelect(opt.value);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper to always attach token
function authFetch(url, options = {}) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
  });
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
  // Add loading state for order status change
  const [orderStatusLoading, setOrderStatusLoading] = useState(false);

  // Copy contact info function
  const copyContactInfo = async (type, value) => {
    let textToCopy = '';
    let successMessage = '';
    
    switch(type) {
      case 'email':
        textToCopy = value;
        successMessage = 'Email copied to clipboard!';
        break;
      case 'phone':
        textToCopy = value;
        successMessage = 'Phone number copied to clipboard!';
        break;
      default:
        return;
    }
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(successMessage, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error('Failed to copy to clipboard', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Fetch available languages and proficiency levels
  useEffect(() => {
    async function fetchLanguageData() {
      try {
        const [languagesRes, proficiencyRes] = await Promise.all([
          authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/languages/`),
          authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/proficiency-levels/`)
        ]);
        if (languagesRes.ok) {
          const languagesData = await languagesRes.json();
          setAvailableLanguages(languagesData);
        } else {
          setAvailableLanguages([]);
        }
        if (proficiencyRes.ok) {
          const proficiencyData = await proficiencyRes.json();
          setProficiencyLevels(proficiencyData);
        } else {
          setProficiencyLevels([]);
        }
      } catch (error) {
        setAvailableLanguages([]);
        setProficiencyLevels([]);
      }
    }
    fetchLanguageData();
  }, []);

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        const [buyerRes, freelancerRes] = await Promise.all([
          authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/buyer/orders/`),
          authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/freelancer/orders/`)
        ]);
        const buyerData = buyerRes.ok ? await buyerRes.json() : {};
        const freelancerData = freelancerRes.ok ? await freelancerRes.json() : {};
        // Combine all orders for filtering and display
        const allOrders = [
          ...(freelancerData.pending || []),
          ...(freelancerData.ongoing || []),
          ...(freelancerData.completed || [])
        ];
        setFreelancerOrders(allOrders);
        setBuyerOrders(Array.isArray(buyerData.completed) ? buyerData.completed : []);
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
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/users/get-completion-percentage/`);
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
    Promise.all([
      userService.getUserProfile(userIdFromURL),
      reviewService.getAllReviews({ reviewee_id: userIdFromURL })
    ])
      .then(async ([profileData, reviewsData]) => {
        // Map backend fields to frontend fields
        const gigIds = profileData.gig_ids || (profileData.debug_info && profileData.debug_info.gig_ids) || [];
        const getProfilePictureUrl = (picture) => {
          if (!picture) return null;
          if (picture.startsWith('http')) return picture;
          return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${picture}`;
        };
        const mappedProfile = {
          name: (`${profileData.first_name || ""} ${profileData.last_name || ""}`.trim()) || profileData.username,
          location: profileData.location,
          email: profileData.email,
          contact: profileData.contact_number || profileData.phone || profileData.contact,
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
          last_updated: profileData.last_updated,
        };
        setProfileUser(mappedProfile);
        setReviews(reviewsData.results || reviewsData);
        // Fetch gig details for each gig_id
        if (gigIds.length > 0) {
          const gigDetails = await Promise.all(
            gigIds.map(id => gigService.getGigById(id).catch(() => null))
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
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
    if (!confirmDelete) return;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/users/delete-account/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete account");
      }
      const data = await res.json();
      toast.success(data.message || "Account deleted successfully", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("Delete response:", data);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Could not delete account. Try again.", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDeleteGig = async (gigId, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this gig? This action is irreversible.");
    if (!confirmDelete) return;
    
    try {
      await gigService.deleteGig(gigId);
      toast.success("Gig deleted successfully", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Refresh the gigs list
      const updatedGigs = gigs.filter(gig => gig.id !== gigId);
      setGigs(updatedGigs);
    } catch (error) {
      console.error("Error deleting gig:", error);
      toast.error("Could not delete gig. Try again.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Move the handler inside the component so it can access the state
  async function handleOrderStatusChange(orderId, newStatus) {
    if (orderStatusLoading) return;
    setOrderStatusLoading(true);
    try {
      // Map 'completed' to 'complete' for backend compatibility
      const backendStatus = newStatus === 'completed' ? 'complete' : newStatus;
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/orders/${orderId}/update-status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: backendStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || data.message || 'Failed to update order status.');
        return;
      }
      toast.success('Order status updated!');
      setFreelancerOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update order status.');
    } finally {
      setOrderStatusLoading(false);
    }
  }

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
        {/* Sidebar */}
        <aside className="w-64 mr-8 hidden md:block animate-fadeInUp glass-sidebar transition-all duration-500" style={{ animationDelay: '0.2s', minWidth: '260px' }}>
          <div className="flex flex-col items-center gap-6 py-8 px-6 bg-white/10 rounded-xl shadow-xl border border-white/10 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-popIn" style={{ animationDelay: '0.25s' }}>
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-md bg-gray-900 flex items-center justify-center">
                {profileUser?.profile_picture ? (
                  <img src={profileUser.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-gray-200">{profileUser?.name?.[0] || 'U'}</span>
                )}
              </div>
              {/* Progress Ring */}
              {completionPercent !== null && (
                <div className="absolute -inset-2">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgba(156, 163, 175, 0.2)"
                      strokeWidth="3"
                      fill="none"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="url(#progressGradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - completionPercent / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#A020F0" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
            </div>
            <div className="text-xl font-semibold text-white text-center">{profileUser?.name || 'User Name'}</div>
            <div className="flex items-center gap-2 text-gray-300 text-sm group">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" />
              </svg>
              <span>{profileUser?.email || 'email@email.com'}</span>
              {isOwnProfile && (
                <button 
                  onClick={() => copyContactInfo('email', profileUser?.email)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-purple-400 hover:text-purple-300 p-1"
                  title="Copy Email"
                >
                  <FaCopy className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm group">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 001.21-.502l4.493 1.498a1 1 0 00.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{profileUser?.contact || 'Contact'}</span>
              {isOwnProfile && (
                <button 
                  onClick={() => copyContactInfo('phone', profileUser?.contact)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-purple-400 hover:text-purple-300 p-1"
                  title="Copy Phone"
                >
                  <FaCopy className="w-3 h-3" />
                </button>
              )}
            </div>
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
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-400">Languages</span>
                <div className="relative group">
                  <span className="px-2 py-0.5 rounded bg-gray-800 text-purple-300 font-medium text-center max-w-[120px] truncate">
                    {(() => {
                      if (Array.isArray(profileUser?.languages) && profileUser.languages.length > 0) {
                        const languageNames = profileUser.languages.map(lang => {
                          const languageName = availableLanguages.find(l => l.code === lang.language)?.name || lang.language;
                          return languageName;
                        });
                        return languageNames.join(', ');
                      } else if (Array.isArray(profileUser?.lang_spoken) && profileUser.lang_spoken.length > 0) {
                        const languageNames = profileUser.lang_spoken.map(code => LANGUAGE_CODE_TO_NAME[code] || code);
                        return languageNames.join(', ');
                      } else {
                        return 'N/A';
                      }
                    })()}
                  </span>
                  {/* Hover Popup for multiple languages */}
                  {(() => {
                    let languageNames = [];
                    if (Array.isArray(profileUser?.languages) && profileUser.languages.length > 0) {
                      languageNames = profileUser.languages.map(lang => {
                        const languageName = availableLanguages.find(l => l.code === lang.language)?.name || lang.language;
                        return languageName;
                      });
                    } else if (Array.isArray(profileUser?.lang_spoken) && profileUser.lang_spoken.length > 0) {
                      languageNames = profileUser.lang_spoken.map(code => LANGUAGE_CODE_TO_NAME[code] || code);
                    }
                    
                    if (languageNames.length > 1) {
                      return (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10">
                          <div className="bg-[#1a1333] border border-purple-500/30 rounded-lg shadow-2xl p-3 min-w-[200px] max-w-[300px] backdrop-blur-md">
                            <div className="text-xs font-semibold text-purple-300 mb-2 border-b border-purple-500/30 pb-1">All Languages:</div>
                            <div className="space-y-1">
                              {languageNames.map((lang, index) => (
                                <div key={index} className="text-xs text-gray-200 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                  {lang}
                                </div>
                              ))}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1a1333]"></div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
            {isOwnProfile && (
              <div className="w-full mt-4">
                <Link href={`/profile/${profileUser?.id}/edit`} className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2" style={{textDecoration: 'none'}}>
                  <FaRegEdit className="text-base" /> Edit Profile
                </Link>
              </div>
            )}
          </div>
          <div className="h-px w-full bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 opacity-30 my-4"></div>
          <nav className="sticky top-32 p-0">
            <ul className="space-y-2">
              <li><a href="#about" className="w-full block text-left px-4 py-2 rounded-lg font-semibold text-purple-300 hover:text-white hover:bg-purple-700/40 transition-all duration-200 sidebar-nav-item" data-tooltip-id="about-tip">About</a><Tooltip id="about-tip">About</Tooltip></li>
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
                </h2>
            <div className="text-base text-gray-200">{profileUser?.bio || "No bio yet."}</div>
              </div>
          {/* Gigs Section (was Services) */}
          <div id="gigs" className={cardClass + " animate-fadeInUp animate-popIn transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"} style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-400 animate-popIn" style={{ animationDelay: '0.45s' }}>Gigs</h2>
              {isOwnProfile && (
                <button 
                  onClick={() => router.push('/gigs/create')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Gig
                </button>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {gigs.length === 0 ? (
                <div className="text-gray-300">No gigs found.</div>
              ) : (
                gigs.map(gig => {
                  const imageUrl = gig.picture
                    ? (gig.picture.startsWith("http")
                        ? gig.picture
                        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${gig.picture}`)
                    : "https://via.placeholder.com/300x200?text=No+Image";
                  return (
                    <div
                      key={gig.id}
                      className="bg-gradient-to-br from-gray-900 via-[#1a1333] to-[#24194a] rounded-xl shadow-lg border border-purple-900/30 hover:border-purple-500 hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden group w-[270px] min-w-[270px] flex-shrink-0 cursor-pointer"
                      onClick={() => router.push(`/gigDetails/${gig.id}`)}
                    >
                      <div className="relative w-full h-[130px] bg-gray-800 flex items-center justify-center">
                        <img src={imageUrl} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <button className="absolute top-2 right-2 bg-transparent border-none text-xl text-gray-400 hover:text-[#A020F0] transition-colors">♡</button>
                        {isOwnProfile && (
                          <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <button 
                              className="bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded-md transition-all duration-200 hover:scale-110 shadow-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/gigs/edit/${gig.id}`);
                              }}
                              title="Edit Gig"
                            >
                              <FaPencilAlt className="w-3 h-3" />
                            </button>
                            <button 
                              className="bg-purple-600 hover:bg-red-600 text-white p-1.5 rounded-md transition-all duration-200 hover:scale-110 shadow-lg"
                              onClick={(e) => handleDeleteGig(gig.id, e)}
                              title="Delete Gig"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col p-3 gap-2">
                        <div className="flex items-center gap-2 mb-1">
                          <img src={imageUrl} alt={gig.name || gig.freelancer || "Unknown"} className="w-6 h-6 rounded-full object-cover border border-purple-500 bg-gray-900" />
                          <span className="text-sm font-semibold text-purple-200 truncate">{gig.freelancer || gig.name || "Unknown"}</span>
                        </div>
                        <div className="font-semibold text-purple-100 text-sm line-clamp-2 group-hover:text-white transition break-words">{gig.title || "Untitled"}</div>
                        {gig.created_at && (
                          <div className="text-xs text-purple-300 mt-1">Created: {new Date(gig.created_at).toLocaleDateString()}</div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-yellow-400">
                          <span>★ {gig.avg_rating ?? gig.rating ?? 0}</span>
                          <span className="text-gray-400">({gig.review_count ?? gig.reviews ?? 0})</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-purple-400 text-sm">From ₹{(gig.price ?? 0).toLocaleString()}</span>
                          <span className="text-xs text-gray-300">{gig.delivery_time ?? gig.duration ?? 0}d</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span>Scroll horizontally to see more gigs</span>
                <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
          {/* Orders Section */}
          <div id="orders" className={cardClass + " animate-fadeInUp animate-popIn transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"} style={{ animationDelay: '0.45s' }}>
            <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.5s' }}>Orders</h2>
            <div className="mb-4 flex gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">Order Type</label>
                <select 
                  className="px-4 py-2 border border-purple-700 rounded bg-[#24194a] text-white" 
                  value={selectedOrderType} 
                  onChange={e => setSelectedOrderType(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="gig">Gig Orders</option>
                  <option value="project">Project Orders</option>
              </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">Status</label>
                <select 
                  className="px-4 py-2 border border-purple-700 rounded bg-[#24194a] text-white" 
                  value={selectedOrderStatus} 
                  onChange={e => setSelectedOrderStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  {orderStatusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-6">
              {(() => {
                let filteredOrders = [];
                if (selectedOrderType === 'all') {
                  filteredOrders = freelancerOrders;
                } else if (selectedOrderType === 'gig') {
                  filteredOrders = gigOrders;
                } else if (selectedOrderType === 'project') {
                  filteredOrders = projectOrders;
                }
                
                // Apply status filter
                if (selectedOrderStatus) {
                  filteredOrders = filteredOrders.filter(
                    o => o.status && o.status.toLowerCase() === selectedOrderStatus.toLowerCase()
                  );
                }
                
                return filteredOrders.length === 0 ? (
                  <div className="text-gray-300">No orders found.</div>
                ) : (
                  <>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                      {filteredOrders.map((order, index) => {
                        // Determine menu options based on status
                        let menuOptions = [];
                        if (order.status === 'pending') {
                          menuOptions = [
                            { value: 'ongoing', label: 'Move to Ongoing' },
                            { value: 'completed', label: 'Move to Completed' },
                          ];
                        } else if (order.status === 'ongoing') {
                          menuOptions = [
                            { value: 'pending', label: 'Move to Pending' },
                            { value: 'completed', label: 'Move to Completed' },
                          ];
                        } else if (order.status === 'completed') {
                          menuOptions = [
                            { value: 'pending', label: 'Move to Pending' },
                            { value: 'ongoing', label: 'Move to Ongoing' },
                          ];
                        }
                        return (
                        <div 
                          key={order.id} 
                            className="bg-[#18112c] rounded-lg p-4 shadow-md border border-purple-900/30 w-[320px] h-[200px] flex-shrink-0 relative flex flex-col transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-purple-500 animate-fadeInUp overflow-visible"
                          style={{ 
                            animationDelay: `${index * 0.1}s`,
                              animationFillMode: 'both',
                              zIndex: 1
                          }}
                        >
                            {/* 3-dots menu for state change (absolute top-right of card) */}
                            <div className="absolute top-3 right-3 z-30">
                              <ThreeDotsMenu
                                options={menuOptions}
                                onSelect={(newStatus) => handleOrderStatusChange(order.id, newStatus)}
                              />
                            </div>
                            {/* Type badge, at the bottom-right */}
                            <span className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${order.type === 'gig' ? 'bg-purple-600 text-white' : 'bg-pink-500 text-white'}`}>{order.type === 'gig' ? 'GIG' : 'PROJECT'}</span>
                          
                          {order.type === 'gig' ? (
                            // Gig Order Display
                            <div className="space-y-2 flex-1">
                              <div className="text-sm font-semibold mb-2 text-purple-200 break-words hyphens-auto leading-relaxed pr-16">
                                Gig: {order.gig_title || 'Untitled Gig'}
                              </div>
                              <div className="space-y-1 text-xs">
                                <div>
                                  <span className="text-gray-400">Order Placed:</span>
                                  <div className="text-purple-200 font-medium">
                                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-400">Client:</span>
                                  <div className="text-purple-200 font-medium truncate">{order.buyer_name || 'Unknown'}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400">Price:</span>
                                  <div className="text-green-400 font-bold">${order.price || 'N/A'}</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Project Order Display
                            <div className="space-y-2 flex-1">
                              <div className="text-sm font-semibold mb-2 text-purple-200 break-words hyphens-auto leading-relaxed pr-16">
                                Project: {order.project_title || 'Untitled Project'}
                              </div>
                              <div className="space-y-1 text-xs">
                                <div>
                                  <span className="text-gray-400">Order Placed:</span>
                                  <div className="text-purple-200 font-medium">
                                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-400">Client:</span>
                                  <div className="text-purple-200 font-medium truncate">{order.buyer_name || 'Unknown'}</div>
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
                        </div>
                        );
                      })}
                    </div>
                    {/* Horizontal Scroll Indicator */}
                    <div className="flex justify-center mt-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        <span>Scroll horizontally to see more orders</span>
                        <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </>
                );
              })()}
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
