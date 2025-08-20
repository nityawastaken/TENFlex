"use client";
import useScreenWidth from "@/Hooks/useScreenWidth";
import React, { useEffect, useState } from "react";
import ISO6391 from "iso-639-1";
import axios from "axios";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { FaTrash, FaRegEdit } from "react-icons/fa";

const Updateform = () => {
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editRole, setEditRole] = useState("student");
  const [editUsePurpose, setEditUsePurpose] = useState("personal");
  const [file, setFile] = useState(null);
  const [languages, setLanguages] = useState([]);
  const width = useScreenWidth();
  const [langInput, setLangInput] = useState("");
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState([]);
  // const [haveProfilePic, setHaProfilePic] = useState(false)

  const [langDropdown, setLangDropdown] = useState(false);

  const router = useRouter();

  const handleAddLanguage = (e) => {
    e.preventDefault();
    const trimmed = langInput.trim().toLowerCase();
    const langCode = ISO6391.getCode(trimmed);
    if (langCode && !languages.includes(langCode)) {
      setLanguages([...languages, langCode]);
    }
    setLangInput("");
  };

  const handleChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setEditContact(value);
    const regex = /^\+91\d{10}$/;
    if (value.length === 0 || value === null) {
      setIsError(false);
    } else {
      setIsError(!regex.test(value));
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      const userr = userString ? JSON.parse(userString) : null;
      setUser(userr);
      console.log(userr);
      setEditFirstName(userr?.first_name);
      setEditLastName(userr?.last_name);
      setEditBio(userr?.bio);
      setEditContact(userr?.contact_number);
      setEditLocation(userr?.location);
      setFile(userr?.profile_picture_url);
      setLanguages(userr.lang_spoken);
    }
  }, []);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSave = async () => {
    try {
      if (file instanceof File) {
        const formData = new FormData();
        formData.append("first_name", editFirstName);
        formData.append("last_name", editLastName);
        formData.append("location", editLocation);
        formData.append("contact_number", editContact);
        formData.append("bio", editBio);
        formData.append("role", editRole);
        formData.append("use_purpose", editUsePurpose);
        languages.forEach((lang) => {
          formData.append("lang_spoken", lang);
        });
        formData.append("profile_picture", file);

        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/base/users/${user.id}/`,
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        // console.log("response : ", response);
        if (response.data.id) {
          toast.success("Profile update succcess!");

          // Update local storage
          const updatedUser = {
            ...user,
            ...response.data,
          };
          // console.log("updated User : ", updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("userUpdated"));
          setTimeout(() => {
            router.push(`/client-profile/${user.id}/`);
          }, 3000);
        }
      } else {
        const updatedData = {
          first_name: editFirstName,
          last_name: editLastName,
          contact_number: editContact,
          location: editLocation,
          bio: editBio,
          role: editRole,
          use_purpose: editUsePurpose,
          lang_spoken: languages,
        };
        // console.log("updated Data : ", updatedData);
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/base/users/${user.id}/`,
          updatedData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        // console.log("response : ", response);
        if (response.data.id) {
          toast.success("Profile update succcess!");
          // Update local storage
          const updatedUser = {
            ...user,
            ...response.data,
          };
          // console.log("updated User : ", updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("userUpdated"));
          setTimeout(() => {
            router.push(`/client-profile/${user.id}/`);
          }, 3000);
        }
      }
    } catch (err) {
      console.error("Error saving profile data:", err);
      toast.error("Error saving profile data!");
    }
  };

  const hasProfilePic =
    file instanceof File || (typeof file === "string" && file.trim() !== "");

  return (
    <div
      className={`${
        width <= 786 ? "pt-18" : "pt-28 "
      } w-full h backdrop-blur-2xl pb-8`}
    >
      <ToastContainer position="bottom-right" autoClose={3000} />
      <form
        className={`${
          width <= 786 ? "relative top-6 px-2 pt-2" : " -28"
        } w-full max-w-2xl md:w-[600px] mx-auto z-30 left-0 right-0 bg-gradient-to-br from-[#24194a] via-[#1a0d2b] to-[#28163a] p-6 md:p-8  rounded-xl shadow-2xl space-y-4 border border-purple-900 h-[90vh] overflow-y-scroll scrollbar-hide `}
        onSubmit={(e) => {
          e.preventDefault();
          !isError && handleSave();
        }}
      >
        <h2 className="text-2xl font-bold text-white text-center mb-4 tracking-wide">
          Update Profile
        </h2>

        {/* first_name last_name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-purple-200 mb-1 font-medium">
              First Name
            </label>
            <input
              className="w-full bg-[#2d2357] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={editFirstName}
              onChange={(e) => setEditFirstName(e.target.value)}
              placeholder="First Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-purple-200 mb-1 font-medium">
              Last Name
            </label>
            <input
              className="w-full bg-[#2d2357] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
              placeholder="Last Name"
              required
            />
          </div>
        </div>

        {/* contact location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-purple-200 mb-1 font-medium">
              Contact Number
            </label>
            <div>
              <input
                className="w-full bg-[#2d2357] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                value={editContact}
                onChange={handleChange}
                type="tel"
                placeholder="eg +919123456780"
              />
            </div>
            {isError && (
              <p className="text-red-500 ml-2 pt-0.5 text-xs leading-tight">
                Enter a valid phone number (e.g. +919876543210).
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-purple-200 mb-1 font-medium">
              Location
            </label>
            <input
              className="w-full bg-[#2d2357] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              placeholder="Your Location"
              type="text"
            />
          </div>
        </div>

        {/* role use_purpose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-purple-200 mb-1 font-medium">
              Role
            </label>
            <select
              name="Role"
              id="role"
              className="px-2 py-2 w-full rounded cursor-pointer bg-[#2d2357] text-white"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="organization">Organization</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-purple-200 mb-1 font-medium">
              Use Purpose
            </label>
            <select
              name="Use_purpose"
              id="use_purpose"
              className="px-2 py-2 w-full rounded cursor-pointer bg-[#2d2357] text-white"
              value={editUsePurpose}
              onChange={(e) => setEditUsePurpose(e.target.value)}
            >
              <option value="">Personal</option>
              <option value="business">Business</option>
              <option value="academic">Academic</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* bio */}
        <div>
          <label className="block text-sm text-purple-200 mb-1 font-medium">
            Bio
          </label>
          <textarea
            className="w-full bg-[#2d2357] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none"
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            maxLength="100"
            placeholder="Max 100 characters..."
            rows={4}
          />
        </div>

        {/* languages */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col relative">
            <label className="block text-sm text-purple-200 mb-1 font-medium">
              Languages
            </label>
            <input
              type="text"
              value={langInput}
              onChange={(e) => {
                setLangInput(e.target.value);
                setLangDropdown(true);
              }}
              placeholder="Enter a language (e.g., French)"
              className="w-full bg-[#2d2357] rounded-lg px-2 py-2 h-12 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />

            {/* Dropdown */}
            {langInput.length > 0 && langDropdown && (
              <ul className="absolute z-10 top-20 w-full bg-[#1a1333] border border-green-700 rounded-lg shadow-lg max-h-48 overflow-y-auto text-sm">
                {ISO6391.getAllNames()
                  .filter((name) =>
                    name.toLowerCase().includes(langInput.toLowerCase())
                  )
                  .map((name) => (
                    <li
                      key={name}
                      className="px-4 py-2 cursor-pointer hover:bg-green-700/40 text-green-200"
                      onClick={() => {
                        const code = ISO6391.getCode(name);
                        if (code && !languages.includes(code)) {
                          setLanguages([...languages, code]);
                        }
                        setLangInput("");
                        setLangDropdown(false);
                      }}
                    >
                      {name}
                    </li>
                  ))}
              </ul>
            )}

            {/* Selected Languages */}
            <div className="flex gap-2 flex-wrap mt-2">
              {languages.map((lang, idx) => (
                <span
                  key={idx}
                  onClick={() =>
                    setLanguages(languages.filter((l) => l !== lang))
                  }
                  className="bg-purple-900/70 text-green-200 px-3 py-1 rounded-full text-sm border border-purple-700 shadow-sm cursor-pointer hover:bg-purple-700/60"
                >
                  {lang} ✕
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-end">
          {/* profile pic input */}
          <div className="flex-1 flex flex-col items-center justify-end">
            {file && (
              <p className="text-xs text-gray-300 mb-3 truncate w-full text-center">
                Selected: {file.name}
              </p>
            )}
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
            <label
              htmlFor="fileUpload"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg shadow cursor-pointer hover:scale-105 transition text-center w-full"
            >
              Upload Profile Picture
            </label>
          </div>
          {hasProfilePic && (
            <div>
              <button
                className="px-4 py-2 flex items-center bg-gradient-to-l from-red-500 to-red-800 text-white font-semibold rounded-lg shadow cursor-pointer hover:scale-105 transition text-center w-full"
                onClick={(e) => {
                  e.preventDefault();
                  setFile("");
                  axios
                    .patch(
                      `${process.env.NEXT_PUBLIC_API_URL}/base/users/${user.id}/`,
                      { profile_picture: null },
                      {
                        headers: {
                          Authorization: `Token ${token}`,
                        },
                      }
                    )
                    .then((res) => {
                      toast.success("Profile picture removed.");
                      setFile("");
                    })
                    .catch((err) =>
                      toast.error("Failed to remove profile picture!")
                    );
                }}
              >
                <FaTrash className="mr-2" /> Remove Picture
              </button>
            </div>
          )}
        </div>

        {/* buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <button
            type="submit"
            className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg shadow hover:scale-105 transition w-full sm:w-auto ${
              !isError ? "cursor-pointer" : "cursor-not-allowed"
            } `}
          >
            Save
          </button>
          <Link
            href={`/client-profile/${user.id}/`}
            type="button"
            className="px-6 py-2 cursor-pointer bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-800 transition w-full sm:w-auto text-center items-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Updateform;
