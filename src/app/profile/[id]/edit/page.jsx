"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaTrash, FaRegEdit } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { Tooltip } from 'react-tooltip';
import { useParams, useRouter } from "next/navigation";
import { CiLocationOn } from "react-icons/ci";
import Select from 'react-select';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Edit() {
  const router = useRouter();
  const { id } = useParams();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [proficiencyLevels, setProficiencyLevels] = useState([]);
  const [languagesLoading, setLanguagesLoading] = useState(true);

  const proficiencyRef = useRef("");
  const languageRef = useRef("");

  // Fetch available languages and proficiency levels
  useEffect(() => {
    async function fetchLanguageData() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        
        const [languagesRes, proficiencyRes] = await Promise.all([
          fetch(`${API_URL}/base/languages/`, {
            headers: token ? { Authorization: `Token ${token}` } : {},
          }),
          fetch(`${API_URL}/base/proficiency-levels/`, {
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
      } finally {
        setLanguagesLoading(false);
      }
    }

    fetchLanguageData();
  }, []);

  useEffect(() => {
    if (!id) return;

    async function fetchUser() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        if (!token) {
          router.push("/signin");
          return;
        }

        const res = await fetch(`${API_URL}/base/users/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        console.log("Fetched user data:", data);
        console.log("Languages from backend:", data.languages);
        setUserData({
          about: data.bio || "",
          location: data.location || "",
          languages: data.languages || data.lang_spoken || [],
          profile_picture: data.profile_picture || "",
          name: data.name || data.username || "",
          email: data.email || "",
          contact: data.phone || data.contact || "",
          experience: data.experience_display || data.experience || "",
          avgRating: data.avg_rating ?? "N/A",
          ongoingOrders: data.inline_orders ?? 0,
          completedOrders: data.completed_orders ?? 0,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  const handleLanguageModal = () => {
    setIsLanguageModalOpen(!isLanguageModalOpen);
  };

  const deleteLanguage = (key) => {
    const updatedLanguages = userData.languages.filter(
      (_, index) => index !== key
    );
    setUserData({ ...userData, languages: updatedLanguages });
  };

  const addLanguage = (e) => {
    e.preventDefault();
    const selectedLanguage = languageRef.current.value;
    const selectedProficiency = proficiencyRef.current.value;
    
    if (!selectedLanguage || !selectedProficiency) {
      alert("Please select both language and proficiency level");
      return;
    }

    const languageExists = userData.languages.some(
      lang => lang.language === selectedLanguage
    );
    
    if (languageExists) {
      alert("This language is already added");
      return;
    }

    setUserData({
      ...userData,
      languages: [
        ...userData.languages,
        {
          language: selectedLanguage,
          proficiency: selectedProficiency,
        },
      ],
    });
    
    languageRef.current.value = "";
    proficiencyRef.current.value = "";
    handleLanguageModal();
  };

  const saveChanges = async () => {
    try {
      // Validate contact field
      if (userData.contact && userData.contact.length !== 10) {
        alert("Contact number must be exactly 10 characters long.");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      if (!token) {
        alert("User not logged in");
        return;
      }

      let response;
      if (userData.profile_picture instanceof File) {
        const formData = new FormData();
        formData.append('location', userData.location);
        formData.append('bio', userData.about);
        formData.append('contact', userData.contact);
        formData.append('profile_picture', userData.profile_picture);
        formData.append('languages', JSON.stringify(userData.languages));
        response = await fetch(`${API_URL}/base/users/${id}/`, {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
        });
      } else {
        const body = {
          location: userData.location,
          bio: userData.about,
          contact: userData.contact,
          languages: userData.languages,
          ...(userData.profile_picture === "" && { profile_picture: null }),
        };
        response = await fetch(`${API_URL}/base/users/${id}/`, {
          method: "PATCH",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response not ok:", response.status, errorText);
        throw new Error(`Failed to update user: ${response.status} - ${errorText}`);
      }

      const updatedUser = await response.json();
      console.log("Updated user response:", updatedUser);
      router.push(`/profile/${id}`);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Something went wrong while saving changes: " + error.message);
    }
  };

  if (loading || languagesLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
      </main>
    );
  }

  if (!userData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        User not found.
      </main>
    );
  }

  // Section/card fade-in and hover effect
  const cardClass = "mb-8 bg-[#1a1333] rounded-lg shadow-lg p-6 animate-fadeIn transition-all duration-700 ease-out backdrop-blur-md border-2 border-transparent hover:border-gradient-to-r from-purple-400 to-pink-400 hover:scale-105 hover:shadow-2xl";
  const cardInnerClass = "bg-[#24194a] p-3 rounded mb-2 hover:scale-105 hover:shadow-xl transition-transform duration-300";
  const buttonClass = "px-4 py-2 bg-purple-600 hover:bg-purple-800 rounded text-white font-semibold transition-transform duration-200 hover:scale-105 hover:shadow-lg";

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
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
        
        {/* Sidebar */}
        <aside className="w-64 mr-8 hidden md:block animate-fadeInUp glass-sidebar transition-all duration-500" style={{ animationDelay: '0.2s', minWidth: '260px' }}>
          <div className="flex flex-col items-center gap-6 py-8 px-6 bg-white/10 rounded-xl shadow-xl border border-white/10 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-popIn" style={{ animationDelay: '0.25s' }}>
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-md mb-2 bg-gray-900 flex items-center justify-center">
              {userData?.profile_picture ? (
                <img src={typeof userData.profile_picture === 'string' ? userData.profile_picture : URL.createObjectURL(userData.profile_picture)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-gray-200">{userData?.name?.[0] || 'U'}</span>
              )}
            </div>
            <div className="text-xl font-semibold text-white text-center">{userData?.name || 'User Name'}</div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" />
              </svg>
              {userData?.email || 'email@email.com'}
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {userData?.contact || 'Contact'}
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <CiLocationOn className="text-gray-400 text-lg" />
              {userData?.location || 'Location'}
            </div>
            <div className="h-px w-full bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 opacity-30 my-4"></div>
            <div className="w-full flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-400">Experience</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-100 font-medium tracking-wide min-w-[60px] text-center">{userData?.experience || 'N/A'}</span>
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
              {/* Languages (non-editable, with hover popup) */}
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-400">Languages</span>
                <div className="relative group">
                  <span className="px-2 py-0.5 rounded bg-gray-800 text-purple-300 font-medium text-center max-w-[120px] truncate">
                    {(() => {
                      let languageNames = [];
                      if (Array.isArray(userData?.languages) && userData.languages.length > 0) {
                        languageNames = userData.languages.map(lang => {
                          const languageName = availableLanguages.find(l => l.code === lang.language)?.name || lang.language;
                          return languageName;
                        });
                      }
                      return languageNames.length > 0 ? languageNames.join(', ') : 'N/A';
                    })()}
                  </span>
                  {/* Hover Popup for multiple languages */}
                  {(() => {
                    let languageNames = [];
                    if (Array.isArray(userData?.languages) && userData.languages.length > 0) {
                      languageNames = userData.languages.map(lang => {
                        const languageName = availableLanguages.find(l => l.code === lang.language)?.name || lang.language;
                        return languageName;
                      });
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
          
          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={saveChanges}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <LuSave className="text-lg" /> Save Changes
            </button>
            <button
              onClick={() => router.push(`/profile/${id}`)}
              className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <IoClose className="text-lg" /> Cancel
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto">
          {/* Header */}
          <div className={cardClass + " animate-fadeInUp animate-popIn transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"} style={{ animationDelay: '0.3s' }}>
            <h1 className="text-2xl font-bold text-purple-400 mb-2 animate-popIn" style={{ animationDelay: '0.35s' }}>
              Edit Profile
            </h1>
            <p className="text-gray-300">Update your profile information and settings</p>
        </div>

          {/* Profile Picture Section */}
          <div className={cardClass + " animate-fadeInUp animate-popIn transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"} style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.45s' }}>Profile Picture</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-purple-400 shadow-lg bg-gray-800 flex items-center justify-center">
                  {userData.profile_picture ? (
                    <img 
                      src={typeof userData.profile_picture === 'string' ? userData.profile_picture : URL.createObjectURL(userData.profile_picture)} 
              alt="Profile"
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-4xl font-bold text-gray-400">{userData?.name?.[0] || 'U'}</span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors">
                  <label htmlFor="profile-upload" className="cursor-pointer">
                    <FaRegEdit className="text-white text-sm" />
          </label>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor="profile-upload" className={buttonClass + " text-sm cursor-pointer w-fit flex items-center gap-2"}>
                  <FaRegEdit /> Choose New Photo
          </label>
                {userData.profile_picture && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded transition-all duration-200 hover:scale-105 hover:shadow-lg text-sm flex items-center gap-2"
                    onClick={() => setUserData({ ...userData, profile_picture: "" })}
                  >
                    <FaTrash /> Remove Photo
                  </button>
                )}
              </div>
            </div>
            <input id="profile-upload" type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setUserData({ ...userData, profile_picture: file }); } }} className="hidden" />
          </div>

          {/* Personal Information Section */}
          <div className={cardClass + " animate-fadeInUp animate-popIn transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"} style={{ animationDelay: '0.5s' }}>
            <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.55s' }}>Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-purple-300">Location</label>
          <input
            type="text"
            value={userData.location}
                  onChange={(e) => setUserData({ ...userData, location: e.target.value })} 
                  placeholder="Enter your location"
                  className="w-full border border-purple-700 rounded-lg px-4 py-3 bg-[#24194a] text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-purple-300">Contact Number</label>
                <input 
                  type="text" 
                  value={userData.contact} 
                  onChange={(e) => setUserData({ ...userData, contact: e.target.value })} 
                  placeholder="Enter 10-digit phone number" 
                  maxLength={10}
                  className="w-full border border-purple-700 rounded-lg px-4 py-3 bg-[#24194a] text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" 
                />
                {userData.contact && userData.contact.length < 10 && (
                  <span className="text-red-400 text-xs">Contact number must be exactly 10 characters long. Current: {userData.contact.length}/10</span>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className={cardClass + " animate-fadeInUp animate-popIn transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"} style={{ animationDelay: '0.6s' }}>
            <h2 className="text-xl font-bold text-purple-400 mb-4 animate-popIn" style={{ animationDelay: '0.65s' }}>About</h2>
            <div className="space-y-2">
          <textarea
            value={userData.about}
                onChange={(e) => setUserData({ ...userData, about: e.target.value })} 
                rows={6} 
                placeholder="Tell us about yourself..."
                className="w-full border border-purple-700 rounded-lg px-4 py-3 bg-[#24194a] text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none" 
              />
              <div className="flex justify-between items-center">
                <span className={`text-sm ${userData.about?.length > 500 ? 'text-red-400' : 'text-purple-300'}`}>
                  Maximum 500 characters allowed. {userData.about?.length || 0}/500 characters
                </span>
              </div>
            </div>
          </div>

          {/* Languages Section */}
          <div className={cardClass + " animate-fadeInUp animate-popIn transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"} style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-400 animate-popIn" style={{ animationDelay: '0.75s' }}>Languages</h2>
              <button 
                className={buttonClass + " py-2 px-4 text-sm flex items-center gap-2"} 
                onClick={handleLanguageModal}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Language
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData.languages.length > 0 ? (
              userData.languages.map((language, key) => (
                  <div key={key} className={cardInnerClass + " flex items-center justify-between p-4"}>
                    <div className="flex-1">
                      <div className="font-semibold text-purple-200">
                        {availableLanguages.find(lang => lang.code === language.language)?.name || language.language}
                      </div>
                      <div className="text-sm text-purple-300">
                        {proficiencyLevels.find(prof => prof.code === language.proficiency)?.name || language.proficiency}
                      </div>
                    </div>
                  <button
                      className="text-red-400 hover:text-red-200 transition-colors p-2" 
                    onClick={() => deleteLanguage(key)}
                  >
                    <FaTrash />
                  </button>
                  </div>
              ))
            ) : (
                <div className="col-span-full text-center py-8 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p>No languages added yet.</p>
                  <p className="text-sm">Click "Add Language" to get started</p>
                </div>
              )}
            </div>

            {/* Language Modal */}
            {isLanguageModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-md animate-fadeIn">
                <div className="bg-gradient-to-br from-[#1a1333] to-[#24194a] rounded-2xl shadow-2xl p-8 relative animate-popIn max-w-md w-full mx-4 border border-purple-500/30">
                  <button onClick={handleLanguageModal} className="absolute top-4 right-4 text-white text-2xl hover:text-purple-400 transition-colors bg-purple-600/20 hover:bg-purple-600/40 rounded-full w-8 h-8 flex items-center justify-center">&times;</button>
                  <h3 className="text-xl font-bold text-purple-400 mb-6">Add New Language</h3>
                  <form className="space-y-4" onSubmit={addLanguage}>
                    <div>
                      <label className="block text-sm font-semibold text-purple-300 mb-2">Language</label>
                      <Select
                  ref={languageRef}
                        options={availableLanguages.map(lang => ({ value: lang.code, label: lang.name }))}
                        classNamePrefix="rs"
                        placeholder="Search or select language..."
                        onChange={option => languageRef.current = { value: option.value, label: option.label }}
                        styles={{
                          control: (base) => ({ ...base, backgroundColor: '#24194a', borderColor: '#a78bfa', color: 'white', boxShadow: 'none' }),
                          menu: (base) => ({ ...base, backgroundColor: '#24194a', color: 'white' }),
                          option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#6d28d9' : '#24194a', color: 'white', cursor: 'pointer' }),
                          singleValue: (base) => ({ ...base, color: 'white' }),
                          input: (base) => ({ ...base, color: 'white' }),
                          placeholder: (base) => ({ ...base, color: '#a78bfa' }),
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-purple-300 mb-2">Proficiency Level</label>
                <select
                  ref={proficiencyRef}
                        className="w-full border border-purple-700 rounded-lg px-4 py-3 bg-[#24194a] text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      >
                        <option value="">Select Level</option>
                        {proficiencyLevels.map((level) => (
                          <option key={level.code} value={level.code} className="text-black">
                            {level.name}
                      </option>
                        ))}
                </select>
              </div>
                    <div className="flex gap-3 pt-4">
                <button
                        type="button" 
                        className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105" 
                  onClick={handleLanguageModal}
                >
                  Cancel
                </button>
                <button
                        type="submit" 
                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                >
                        Add Language
                </button>
              </div>
            </form>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
    </>
  );
}
