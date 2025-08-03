"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import { toast } from "react-toastify";
import { FaCopy, FaRegEdit } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { useSkillsAPI } from "@/Hooks/useSkillsAPI";
import { useCategoriesAPI } from "@/Hooks/useCategoriesAPI";
import dynamic from 'next/dynamic';

// Use an environment variable or fallback to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Dynamically import Select to avoid hydration issues
const DynamicSelect = dynamic(() => Promise.resolve(Select), {
  ssr: false,
  loading: () => <div className="w-full px-4 py-2 rounded bg-[#18112c] border border-purple-700 text-gray-400">Loading...</div>
});

// Dynamically import AsyncPaginate to avoid hydration issues
const DynamicAsyncPaginate = dynamic(() => Promise.resolve(AsyncPaginate), {
  ssr: false,
  loading: () => <div className="w-full px-4 py-2 rounded bg-[#18112c] border border-purple-700 text-gray-400">Loading...</div>
});

const LANGUAGE_CODE_TO_NAME = {
  en: 'English',
  hi: 'Hindi',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  zh: 'Chinese',
  ru: 'Russian',
};

export default function CreateGig() {
  const router = useRouter();
  const { loadOptions: loadSkillsOptions, loading: skillsAPILoading, error: skillsAPIError, handleInputChange: handleSkillsInputChange, handleKeyDown: handleSkillsKeyDown, inputValue: skillsInputValue, searchSkills, isInitialized: skillsInitialized } = useSkillsAPI();
  const { loadOptions: loadCategoriesOptions, loading: categoriesAPILoading, error: categoriesAPIError, handleInputChange: handleCategoriesInputChange, handleKeyDown: handleCategoriesKeyDown, inputValue: categoriesInputValue, searchCategories, isInitialized: categoriesInitialized } = useCategoriesAPI();
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: [], // always an array
    price: "",
    delivery_time: "",
    picture: null,
  });
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [completionPercent, setCompletionPercent] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [category, setCategory] = useState(null);
  const TITLE_MAX_LENGTH = 80;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Add this state to force re-render

  // Add a manual skill search function that will be triggered on Enter
  const handleSkillSearch = useCallback((e) => {
    if (e.key === 'Enter' && skillsInputValue.trim().length > 0) {
      e.preventDefault();
      console.log('Manual search triggered for:', skillsInputValue);
      searchSkills(skillsInputValue).then(() => {
        // Force component update after search results are updated
        setForceUpdate(prev => prev + 1);
      });
    }
  }, [skillsInputValue, searchSkills]);

  // Add a manual category search function that will be triggered on Enter
  const handleCategorySearch = useCallback((e) => {
    if (e.key === 'Enter' && categoriesInputValue.trim().length > 0) {
      e.preventDefault();
      console.log('Manual category search triggered for:', categoriesInputValue);
      searchCategories(categoriesInputValue).then(() => {
        // Force component update after search results are updated
        setForceUpdate(prev => prev + 1);
      });
    }
  }, [categoriesInputValue, searchCategories]);

  // Add useEffect to log when forceUpdate changes
  useEffect(() => {
    console.log('Component forced to update, iteration:', forceUpdate);
  }, [forceUpdate]);

  useEffect(() => {
    // Fetch user data for sidebar
    async function fetchUser() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        if (!token) {
          router.push("/signin");
          return;
        }
        const res = await fetch(`${API_URL}/base/users/${user.id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUserData({
          id: data.id,
          profile_picture: data.profile_picture || "",
          name: data.name || data.username || "",
          email: data.email || "",
          contact: data.contact_number || data.phone || data.contact || "",
          location: data.location || "",
          experience: data.experience_display || data.experience || "",
          avgRating: data.avg_rating ?? "N/A",
          ongoingOrders: data.inline_orders ?? 0,
          completedOrders: data.completed_orders ?? 0,
          languages: data.languages || [],
          lang_spoken: data.lang_spoken,
        });
        setIsOwnProfile(true); // Always true for Create Gig
        
        // Check if user is freelancer
        if (!data.is_freelancer) {
          toast.error("Only freelancers can create gigs");
          router.push("/profile");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      }
    }
    fetchUser();
    
    // Fetch profile completion percent
    async function fetchCompletionPercent() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        if (!token) return;
        const res = await fetch(`${API_URL}/base/users/get-completion-percentage/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch completion percent');
        const percent = await res.json();
        setCompletionPercent(percent);
      } catch (err) {
        console.error("Failed to fetch profile completion:", err);
        setCompletionPercent(null);
      }
    }
    fetchCompletionPercent();
    
    // Skills and categories will be loaded dynamically via search hooks
    
  }, [router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      setForm((prev) => ({ ...prev, picture: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillsChange = (selected) => {
    setForm((prev) => ({ ...prev, skills: selected || [] }));
  };

  // No need for a separate loadSkills function as we're using the one from useSkillsAPI

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.length > TITLE_MAX_LENGTH) {
      toast.error(`Title must be at most ${TITLE_MAX_LENGTH} characters.`);
      return;
    }
    if (!category) {
      toast.error('Please select a category.');
      return;
    }
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      if (!token) {
        toast.error("You must be logged in to create a gig.");
        setLoading(false);
        router.push("/signin");
        return;
      }
      
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('delivery_time', form.delivery_time);
      
      if (form.picture) {
        formData.append('picture', form.picture);
      }
      
      // Add category names (backend expects category_names as array of strings)
      formData.append('category_names', category.label);
      
      // Add skills
      form.skills.forEach(skill => {
        formData.append('skill_names', skill.label);
      });
      
      // Send request to backend
      const response = await fetch(`${API_URL}/base/gigs/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create gig");
      }
      
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error creating gig:", err);
      toast.error(err.message || "Error creating gig");
    } finally {
      setLoading(false);
    }
  };

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

  // Helper to get profile image URL
  const getProfileImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  // Section/card fade-in and hover effect (copied from edit profile page)
  const cardClass = "mb-8 bg-[#1a1333] rounded-lg shadow-lg p-6 animate-fadeInUp animate-popIn transition-all duration-700 ease-out backdrop-blur-md border-2 border-transparent hover:border-gradient-to-r from-purple-400 to-pink-400 hover:scale-105 hover:shadow-2xl";

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
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-[#1a1333] to-[#2d1a4d] text-white p-6 pt-28 flex">
        {/* Sidebar - unchanged */}
        <aside className="w-64 mr-8 hidden md:block animate-fadeInUp glass-sidebar transition-all duration-500" style={{ animationDelay: '0.2s', minWidth: '260px' }}>
          <div className="flex flex-col items-center gap-6 py-8 px-6 bg-white/10 rounded-xl shadow-xl border border-white/10 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-popIn" style={{ animationDelay: '0.25s' }}>
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-md bg-gray-900 flex items-center justify-center">
                {userData?.profile_picture ? (
                  <img src={getProfileImageUrl(userData.profile_picture)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-gray-200">{userData?.name?.[0] || 'U'}</span>
                )}
              </div>
              {/* Progress Ring */}
              {completionPercent !== null && (
                <div className="absolute -inset-2">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="rgba(156, 163, 175, 0.2)" strokeWidth="3" fill="none" />
                    <circle cx="50" cy="50" r="45" stroke="url(#progressGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 45}`} strokeDashoffset={`${2 * Math.PI * 45 * (1 - completionPercent / 100)}`} className="transition-all duration-1000 ease-out" />
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
            <div className="text-xl font-semibold text-white text-center">{userData?.name || 'User Name'}</div>
            <div className="flex items-center gap-2 text-gray-300 text-sm group">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" />
              </svg>
              <span>{userData?.email || 'email@email.com'}</span>
              <button onClick={() => copyContactInfo('email', userData?.email)} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-purple-400 hover:text-purple-300 p-1" title="Copy Email">
                <FaCopy className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm group">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 001.21-.502l4.493 1.498a1 1 0 00.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{userData?.contact || 'Contact'}</span>
              <button onClick={() => copyContactInfo('phone', userData?.contact)} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-purple-400 hover:text-purple-300 p-1" title="Copy Phone">
                <FaCopy className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm"><CiLocationOn className="text-gray-400 text-lg" />{userData?.location || 'Location'}</div>
            <div className="h-px w-full bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 opacity-30 my-4"></div>
            <div className="w-full flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-400">Experience</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-100 font-medium tracking-wide min-w-[60px] text-center">{userData?.experience || userData?.experience_display || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-400">Avg. Rating</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-yellow-300 font-semibold flex items-center gap-1 min-w-[60px] justify-center">{userData?.avgRating ?? 'N/A'} <svg className="w-3.5 h-3.5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg></span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-400">Ongoing Orders</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-blue-200 font-semibold min-w-[60px] text-center">{userData?.ongoingOrders || 0}</span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-400">Completed Orders</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-green-200 font-semibold min-w-[60px] text-center">{userData?.completedOrders || 0}</span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-400">Languages</span>
                <div className="relative group">
                  <span className="px-2 py-0.5 rounded bg-gray-800 text-purple-300 font-medium text-center max-w-[120px] truncate">
                    {(() => {
                      if (Array.isArray(userData?.languages) && userData.languages.length > 0) {
                        const languageNames = userData.languages.map(lang => {
                          const languageName = lang.language || lang;
                          return LANGUAGE_CODE_TO_NAME[languageName] || languageName;
                        });
                        if (languageNames.length === 1) {
                          return languageNames[0];
                        } else {
                          return `${languageNames[0]} +${languageNames.length - 1}`;
                        }
                      } else if (Array.isArray(userData?.lang_spoken) && userData.lang_spoken.length > 0) {
                        const languageNames = userData.lang_spoken.map(code => LANGUAGE_CODE_TO_NAME[code] || code);
                        if (languageNames.length === 1) {
                          return languageNames[0];
                        } else {
                          return `${languageNames[0]} +${languageNames.length - 1}`;
                        }
                      } else {
                        return 'N/A';
                      }
                    })()}
                  </span>
                  {/* Hover Popup for multiple languages */}
                  {(() => {
                    let languageNames = [];
                    if (Array.isArray(userData?.languages) && userData.languages.length > 0) {
                      languageNames = userData.languages.map(lang => {
                        const languageName = lang.language || lang;
                        return LANGUAGE_CODE_TO_NAME[languageName] || languageName;
                      });
                    } else if (Array.isArray(userData?.lang_spoken) && userData.lang_spoken.length > 0) {
                      languageNames = userData.lang_spoken.map(code => LANGUAGE_CODE_TO_NAME[code] || code);
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
          </div>
        </aside>
        {/* Main Content - match edit profile page */}
        <div className="flex-1 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="w-full" id="create-gig-form">
            {/* Basic Info Section */}
            <div className={cardClass} style={{ animationDelay: '0.3s' }}>
              <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.35s' }}>Basic Info</h2>
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-[#18112c] border border-purple-700 text-white"
                  required
                  maxLength={TITLE_MAX_LENGTH + 1}
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className={form.title.length > TITLE_MAX_LENGTH ? 'text-red-400' : 'text-purple-300'}>
                    {form.title.length}/{TITLE_MAX_LENGTH} characters
                  </span>
                  {form.title.length > TITLE_MAX_LENGTH && (
                    <span className="text-red-400">Title is too long!</span>
                  )}
                </div>
              </div>
            </div>
            {/* Description Section */}
            <div className={cardClass} style={{ animationDelay: '0.4s' }}>
              <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.45s' }}>Description</h2>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-[#18112c] border border-purple-700 text-white"
                  rows={4}
                  required
                />
              </div>
            </div>
            {/* Skills Section */}
            <div className={cardClass} style={{ animationDelay: '0.5s' }}>
              <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.55s' }}>Skills</h2>
              <div>
                <label className="block mb-1">Skills</label>
                {skillsAPIError ? (
                  <div className="text-red-400 py-2">{skillsAPIError}</div>
                ) : (
                  <DynamicAsyncPaginate
                    isMulti
                    name="skills"
                    value={form.skills}
                    onChange={handleSkillsChange}
                    loadOptions={loadSkillsOptions}
                    onInputChange={handleSkillsInputChange}
                    onKeyDown={handleSkillSearch}
                    inputValue={skillsInputValue}
                    placeholder={!skillsInitialized ? "Loading skills..." : "Type to search skills and press Enter..."}
                    isLoading={skillsAPILoading}
                    className="text-black"
                    classNamePrefix="select"
                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                    key={`skills-select-${forceUpdate}`} // Add key to force re-render
                    styles={{
                      menuPortal: base => ({ ...base, zIndex: 9999 }),
                      menu: base => ({ ...base, backgroundColor: '#18112c', color: 'white', zIndex: 9999 }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? '#6d28d9' : '#18112c',
                        color: 'white',
                        cursor: 'pointer',
                      }),
                      control: base => ({ ...base, backgroundColor: '#18112c', borderColor: '#a78bfa', color: 'white', boxShadow: 'none' }),
                      singleValue: base => ({ ...base, color: 'white' }),
                      multiValue: base => ({ ...base, backgroundColor: '#a78bfa', color: 'white' }),
                      multiValueLabel: base => ({ ...base, color: 'white' }),
                      input: base => ({ ...base, color: 'white' }),
                      placeholder: base => ({ ...base, color: '#a78bfa' }),
                    }}
                  />
                )}
              </div>
            </div>
            {/* Category Section */}
            <div className={cardClass} style={{ animationDelay: '0.45s' }}>
              <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.5s' }}>Category</h2>
              <div>
                <label className="block mb-1">Category</label>
                {categoriesAPIError ? (
                  <div className="text-red-400 py-2">{categoriesAPIError}</div>
                ) : (
                  <DynamicAsyncPaginate
                    name="category"
                    value={category}
                    onChange={setCategory}
                    loadOptions={loadCategoriesOptions}
                    onInputChange={handleCategoriesInputChange}
                    onKeyDown={handleCategorySearch}
                    inputValue={categoriesInputValue}
                    placeholder={!categoriesInitialized ? "Loading categories..." : "Type to search categories and press Enter..."}
                    isLoading={categoriesAPILoading}
                    className="text-black"
                    classNamePrefix="select"
                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                    key={`categories-select-${forceUpdate}`} // Add key to force re-render
                    styles={{
                      menuPortal: base => ({ ...base, zIndex: 9999 }),
                      menu: base => ({ ...base, backgroundColor: '#18112c', color: 'white', zIndex: 9999 }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? '#6d28d9' : '#18112c',
                        color: 'white',
                        cursor: 'pointer',
                      }),
                      control: base => ({ ...base, backgroundColor: '#18112c', borderColor: '#a78bfa', color: 'white', boxShadow: 'none' }),
                      singleValue: base => ({ ...base, color: 'white' }),
                      input: base => ({ ...base, color: 'white' }),
                      placeholder: base => ({ ...base, color: '#a78bfa' }),
                    }}
                  />
                )}
              </div>
            </div>
            {/* Pricing & Delivery Section */}
            <div className={cardClass} style={{ animationDelay: '0.6s' }}>
              <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.65s' }}>Pricing & Delivery</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#18112c] border border-purple-700 text-white"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1">Delivery Time (days)</label>
                  <input
                    type="number"
                    name="delivery_time"
                    value={form.delivery_time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#18112c] border border-purple-700 text-white"
                    required
                  />
                </div>
              </div>
            </div>
            {/* Image Upload Section */}
            <div className={cardClass} style={{ animationDelay: '0.7s' }}>
              <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.75s' }}>Image Upload</h2>
              <div>
                <label className="block mb-1">Image</label>
                <input
                  type="file"
                  name="picture"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-[#18112c] border border-purple-700 text-white"
                />
              </div>
            </div>
          </form>
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              form="create-gig-form"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded text-white font-bold transition-all duration-200 shadow-lg text-lg"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Gig"}
            </button>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#24194a] rounded-lg shadow-2xl p-8 relative animate-fadeIn flex flex-col items-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Gig Created Successfully!</h2>
            <p className="text-white mb-6">Your gig has been created and is now live.</p>
            <button
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-bold transition-all duration-200"
              onClick={() => {
                setShowSuccessModal(false);
                if (userData && userData.id) {
                  router.push(`/profile/${userData.id}`);
                } else {
                  router.push("/profile");
                }
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
} 