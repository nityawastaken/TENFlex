"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { Tooltip } from 'react-tooltip';
import { useParams, useRouter } from "next/navigation";
import { CiLocationOn } from "react-icons/ci";
import Select from 'react-select';

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
          router.push("/signin"); // or show a login modal
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
          experience: data.experience_display || data.experience || "",
          avgRating: data.avg_rating ?? "N/A",
          ongoingOrders: data.inline_orders ?? 0,
          completedOrders: data.completed_orders ?? 0,
          // add more fields as needed for your form
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

    // Check if language already exists
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
    
    // Reset form
    languageRef.current.value = "";
    proficiencyRef.current.value = "";
    handleLanguageModal();
  };

  const saveChanges = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      if (!token) {
        alert("User not logged in");
        return;
      }

      let response;
      // If uploading a file, use FormData
      if (userData.profile_picture instanceof File) {
        const formData = new FormData();
        formData.append('location', userData.location);
        formData.append('bio', userData.about);
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
        // Otherwise, send JSON
        const body = {
          location: userData.location,
          bio: userData.about,
          languages: userData.languages,
          // Only include profile_picture if user wants to remove it
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
      <div className="text-white text-center py-32">Loading user data...</div>
    );
  }

  if (!userData) {
    return <div className="text-white text-center py-32">User not found.</div>;
  }

  // Section/card fade-in and hover effect
  const cardClass = "mb-8 bg-[#1a1333] rounded-lg shadow-lg p-6 animate-fadeIn transition-all duration-700 ease-out backdrop-blur-md border-2 border-transparent hover:border-gradient-to-r from-purple-400 to-pink-400 hover:scale-105 hover:shadow-2xl";
  const cardInnerClass = "bg-[#24194a] p-3 rounded mb-2 hover:scale-105 hover:shadow-xl transition-transform duration-300";
  const buttonClass = "px-4 py-2 bg-purple-600 hover:bg-purple-800 rounded text-white font-semibold transition-transform duration-200 hover:scale-105 hover:shadow-lg";

  return (
    <div className="min-h-screen flex flex-col text-indigo-50 bg-gradient-to-br from-[#1a1333] to-[#2d1a4d] p-6 pt-28">
      <main className="flex flex-col flex-grow gap-4 md:gap-6 md:px-8 max-w-2xl mx-auto w-full">
        <div className={cardClass + " flex flex-row justify-between items-center"}>
          <h1 className="font-bold text-xl md:text-2xl text-purple-400 flex items-center gap-2">Editing Profile <IoClose className="text-xl lg:text-2xl cursor-pointer hover:text-red-500 transition-colors duration-200" onClick={() => router.push(`/profile/${userData.name}`)} data-tooltip-id="close-tip" /><Tooltip id="close-tip">Cancel</Tooltip></h1>
          <button className={buttonClass + " flex items-center gap-2"} onClick={saveChanges} data-tooltip-id="save-tip"><LuSave className="text-lg" /> Save <Tooltip id="save-tip">Save Changes</Tooltip></button>
        </div>
        {/* Profile Picture */}
        <div className={cardClass + " flex flex-col gap-4 items-center"}>
          <label className="text-base md:text-lg font-bold text-purple-300">Profile Picture</label>
          {userData.profile_picture && (
            <img src={typeof userData.profile_picture === 'string' ? userData.profile_picture : URL.createObjectURL(userData.profile_picture)} alt="Profile" className="w-32 h-32 md:w-36 md:h-36 object-cover rounded-full border-4 border-purple-400 shadow-lg" />
          )}
          <div className="flex gap-2">
            <label htmlFor="profile-upload" className={buttonClass + " text-sm md:text-base cursor-pointer w-fit"}>Choose New Photo</label>
            {userData.profile_picture && (
              <button
                type="button"
                className={buttonClass + " bg-red-500 hover:bg-red-600 text-white text-sm md:text-base"}
                onClick={() => setUserData({ ...userData, profile_picture: "" })}
          >
                Remove Photo
              </button>
            )}
          </div>
          <input id="profile-upload" type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setUserData({ ...userData, profile_picture: file }); } }} className="hidden" />
        </div>
        {/* Location */}
        <div className={cardClass + " flex flex-col gap-2"}>
          <label htmlFor="location" className="text-base font-bold md:text-lg text-purple-300">Location</label>
          <input type="text" value={userData.location} onChange={(e) => setUserData({ ...userData, location: e.target.value })} className="border border-purple-700 rounded w-2/3 px-2 py-1 md:text-lg md:w-fit bg-[#24194a] text-white focus:ring-2 focus:ring-purple-400 transition-all" />
        </div>
        {/* About */}
        <div className={cardClass + " flex flex-col gap-2"}>
          <label htmlFor="about" className="text-base font-bold md:text-lg text-purple-300">About</label>
          <textarea value={userData.about} onChange={(e) => setUserData({ ...userData, about: e.target.value })} rows={10} className="border border-purple-700 rounded px-2 py-1 md:text-lg bg-[#24194a] text-white focus:ring-2 focus:ring-purple-400 transition-all" />
          <span className={`text-sm ${userData.about?.length > 500 ? 'text-red-400' : 'text-purple-300'}`}>Maximum 500 characters allowed. {userData.about?.length || 0}/500 characters</span>
        </div>
        {/* Languages */}
        <div className={cardClass + " flex flex-col gap-4"}>
          <h2 className="text-base font-bold md:text-lg text-purple-300 flex items-center gap-2">Languages <button className={buttonClass + " py-1 px-2 ml-2 text-xs"} onClick={handleLanguageModal} data-tooltip-id="add-lang-tip">Add<Tooltip id="add-lang-tip">Add New Language</Tooltip></button></h2>
          <ul className="flex flex-col gap-2">
            {userData.languages.length > 0 ? (
              userData.languages.map((language, key) => (
                <li key={key} className={cardInnerClass + " flex flex-row items-center gap-2 md:text-lg"}>
                  <button className="cursor-pointer text-red-400 hover:text-red-200 transition-colors" onClick={() => deleteLanguage(key)} data-tooltip-id={`del-lang-tip-${key}`}><FaTrash /><Tooltip id={`del-lang-tip-${key}`}>Delete</Tooltip></button>
                  {availableLanguages.find(lang => lang.code === language.language)?.name || language.language} - {proficiencyLevels.find(prof => prof.code === language.proficiency)?.name || language.proficiency}
                </li>
              ))
            ) : (
              <p className="text-sm text-purple-300">No languages added yet.</p>
            )}
          </ul>
          {isLanguageModalOpen ? (
            <form className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex flex-row gap-4 md:text-lg">
                <div className="w-2/3">
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
                <select ref={proficiencyRef} className="border border-purple-700 rounded px-2 py-1 bg-[#24194a] text-white">
                  <option value="">Select Level</option>
                  {proficiencyLevels.map((level) => (
                    <option key={level.code} value={level.code} className="text-black">
                      {level.name}
                      </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 w-[220px]">
                <button type="button" className={buttonClass + " bg-red-400 hover:bg-red-300 text-black"} onClick={handleLanguageModal}>Cancel</button>
                <button type="submit" className={buttonClass + " bg-green-400 hover:bg-green-300 text-black"} onClick={addLanguage}>Save</button>
              </div>
            </form>
          ) : null}
        </div>
      </main>
    </div>
  );
}
