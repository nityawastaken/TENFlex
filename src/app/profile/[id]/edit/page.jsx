"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Edit() {
  const router = useRouter();
  const { id } = useParams();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const proficiencyRef = useRef("");
  const languageRef = useRef("");

  useEffect(() => {
    if (!id) return;

    async function fetchUser() {
      try {
        const token = localStorage.getItem("token"); // <- moved inside
        if (!token) {
          router.push("/login"); // or show a login modal
          return;
        }

        const res = await fetch(`${API_URL}/base/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUserData(data);
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
    setUserData({
      ...userData,
      languages: [
        ...userData.languages,
        {
          name: languageRef.current.value,
          proficiency: proficiencyRef.current.value,
        },
      ],
    });
    handleLanguageModal();
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token"); // <- safely inside the function
      if (!token) {
        alert("User not logged in");
        return;
      }

      const response = await fetch(`${API_URL}/base/users/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to update user");

      const updatedUser = await response.json();
      router.push(`/profile/${updatedUser.name}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving changes");
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center py-32">Loading user data...</div>
    );
  }

  if (!userData) {
    return <div className="text-white text-center py-32">User not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col text-indigo-50 bg-black py-32">
      <main className="p-4 flex flex-col flex-grow gap-4 md:gap-6 md:px-8 lg:w-[1000px] lg:self-center lg:py-12">
        <div className="flex flex-row justify-between">
          <h1 className="font-bold text-xl md:text-2xl">Editing Profile</h1>
          <div className="flex flex-row gap-2">
            <button
              className="text-xl lg:text-2xl cursor-pointer hover:text-red-500"
              onClick={() => router.push(`/profile/${userData.name}`)}
            >
              <IoClose />
            </button>
            <button
              className="text-xl lg:text-2xl cursor-pointer hover:text-green-500"
              onClick={saveChanges}
            >
              <LuSave />
            </button>
          </div>
        </div>

        {/* Profile Picture */}
        <section className="flex flex-col gap-2 md:gap-6">
          <label className="text-base md:text-lg font-bold">
            Profile Picture
          </label>
          {userData.profile_picture && (
            <img
              src={userData.profile_picture}
              alt="Profile"
              className="w-32 h-32 md:w-36 md:h-36 object-cover rounded-full border border-gray-400"
            />
          )}
          <label
            htmlFor="profile-upload"
            className="bg-indigo-400 text-white px-4 py-2 rounded w-fit text-sm md:text-base cursor-pointer hover:bg-indigo-300 transition-all"
          >
            Choose New Photo
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setUserData({ ...userData, profile_picture: reader.result });
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />
        </section>

        {/* Location */}
        <section className="flex flex-col gap-2">
          <label htmlFor="location" className="text-base font-bold md:text-lg">
            Location
          </label>
          <input
            type="text"
            value={userData.location}
            onChange={(e) =>
              setUserData({ ...userData, location: e.target.value })
            }
            className="border border-gray-600 rounded w-2/3 px-2 py-1 md:text-lg md:w-fit"
          />
        </section>

        {/* About */}
        <section className="flex flex-col gap-2">
          <label htmlFor="about" className="text-base font-bold md:text-lg">
            About
          </label>
          <textarea
            value={userData.about}
            onChange={(e) =>
              setUserData({ ...userData, about: e.target.value })
            }
            rows={10}
            className="border border-gray-600 rounded px-2 py-1 md:text-lg"
          />
        </section>

        {/* Languages */}
        <section className="flex flex-col gap-2 md:gap-4">
          <h2 className="text-base font-bold md:text-lg">Languages</h2>
          <ul className="flex flex-col gap-2">
            {userData.languages.length > 0 ? (
              userData.languages.map((language, key) => (
                <li
                  key={key}
                  className="flex flex-row items-center gap-2 md:text-lg hover:text-red-500"
                >
                  <button
                    className="cursor-pointer"
                    onClick={() => deleteLanguage(key)}
                  >
                    <FaTrash />
                  </button>
                  {language.name} - {language.proficiency}
                </li>
              ))
            ) : (
              <p className="text-sm text-indigo-300">No languages added yet.</p>
            )}
          </ul>

          {isLanguageModalOpen ? (
            <form className="flex flex-col gap-4">
              <div className="flex flex-row gap-4 md:text-lg">
                <input
                  type="text"
                  className="border border-gray-700 rounded px-2 py-1 w-2/3"
                  ref={languageRef}
                  placeholder="Language name"
                />
                <select
                  ref={proficiencyRef}
                  className="border border-gray-700 rounded px-2 py-1"
                >
                  {["A1", "A2", "B1", "B2", "C1", "C2", "Native"].map(
                    (level) => (
                      <option key={level} value={level} className="text-black">
                        {level}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 w-[220px]">
                <button
                  className="py-1 px-2 bg-red-300 text-black rounded text-sm md:text-base cursor-pointer hover:bg-red-200"
                  onClick={handleLanguageModal}
                >
                  Cancel
                </button>
                <button
                  className="py-1 px-2 bg-green-300 text-black rounded text-sm md:text-base cursor-pointer hover:bg-green-200"
                  onClick={addLanguage}
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <button
              className="w-fit px-4 py-2 rounded-sm text-white bg-indigo-400 text-sm md:text-base cursor-pointer hover:bg-indigo-300 transition-all"
              onClick={handleLanguageModal}
            >
              Add New Language
            </button>
          )}
        </section>
      </main>
    </div>
  );
}
