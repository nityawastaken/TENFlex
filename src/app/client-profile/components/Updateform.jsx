import useScreenWidth from "@/Hooks/useScreenWidth";
import React, { useState } from "react";
import ISO6391 from "iso-639-1";

const Updateform = ({
  handleSave,
  editFirstName,
  setEditFirstName,
  editLastName,
  setEditLastName,
  editBio,
  setEditBio,
  editContact,
  setEditContact,
  editLocation,
  setEditLocation,
  setEditMode,
  file,
  setFile,
  setEditRole,
  editRole,
  setEditUsePurpose,
  editUsePurpose,
  setLanguages,
  languages,
}) => {
  const width = useScreenWidth();
  const [langInput, setLangInput] = useState("");
  const [isError, setIsError] = useState(false);

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

  return (
    <form
      className={`${
        width <= 786 ? "relative top-6 px-2" : "fixed "
      } w-full max-w-lg md:w-[500px] mx-auto z-30 left-0 right-0 bg-gradient-to-br from-[#24194a] via-[#1a0d2b] to-[#28163a] p-6 md:p-8 pt-2 rounded-xl shadow-2xl space-y-4 border border-purple-900 h-[79vh] overflow-y-scroll scrollbar-hide`}
      onSubmit={(e) => {
        e.preventDefault();
        !isError && handleSave();
      }}
    >
      <h2 className="text-2xl font-bold text-white text-center mb-2 tracking-wide">
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
              required
            />
          </div>
          {isError && (
            <p className="text-red-500 ml-2 pt-0.5 text-xs leading-tight">
              Enter a valid phone number (e.g.
              +919876543210).
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
            <option value="personal">Personal</option>
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
          rows={3}
        />
      </div>

      {/* languages & profile pic */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* languages */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm text-purple-200 mb-1 font-medium">
            Languages
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={langInput}
              onChange={(e) => setLangInput(e.target.value)}
              placeholder="Enter a language (e.g., French)"
              className="w-full bg-[#2d2357] rounded-lg px-2 py-2 h-12 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
              list="language-suggestions"
            />
            <button
              onClick={(e) => {
                handleAddLanguage(e);
              }}
              className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-4 py-2 text-lg font-bold"
            >
              +
            </button>
          </div>
          <datalist id="language-suggestions">
            {ISO6391.getAllNames().map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        {/* profile pic input */}
        <div className="flex-1 flex flex-col items-center justify-end">
          {file && (
            <p className="text-xs text-gray-300 mb-1 truncate w-full text-center">
              Selected: {file.name}
            </p>
          )}
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label
            htmlFor="fileUpload"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg shadow cursor-pointer hover:scale-105 transition text-center w-full"
          >
            Upload Profile Picture
          </label>
        </div>
      </div>

      {/* buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
        <button
          type="submit"
          className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg shadow hover:scale-105 transition w-full sm:w-auto ${!isError? "cursor-pointer" : "cursor-not-allowed"} `}
        >
          Save
        </button>
        <button
          type="button"
          className="px-6 py-2 cursor-pointer bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-800 transition w-full sm:w-auto"
          onClick={() => setEditMode(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Updateform;
