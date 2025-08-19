"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const UpdateProject = ({
  updateProject,
  setUpdateModal,
  tagInput,
  setTagInput,
  setSkills,
  skillInput,
  setSkillInput,
  skills,
  setTags,
  tags,
  selectedProject,
  closeUpdateModal,
}) => {
  const [fields, setFields] = useState({
    title: selectedProject?.title || "",
    description: selectedProject?.description || "",
    start_date: selectedProject?.created_at
      ? new Date(selectedProject.created_at.replace(/\.\d+Z$/, "Z"))
          .toISOString()
          .split("T")[0]
      : "",
    deadline: selectedProject?.deadline || "",
    budget: selectedProject?.budget || 0,
    categories: selectedProject?.categories || [],
    skills: selectedProject?.skills || [],
  });
  const [query, setQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [skillsDropdownVisible, setSkillsDropdownVisible] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const skillsList = async () => {
    try {
      const response = await axios.get(
        `https://api.apilayer.com/skills?q=${query}`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SKILLS_API_KEY,
          },
        }
      );
      // console.log("Skills fetched:", response.data);
      setSkillSuggestions(response.data || []);
      setSkillsDropdownVisible(true);
    } catch (error) {
      console.log("Error fetching skills:", error);
    }
  };

  const categoryList = async () => {
    try {
      const response = await axios.get(
        `https://api.apilayer.com/skills?q=${categoryQuery}`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SKILLS_API_KEY,
          },
        }
      );
      setCategorySuggestions(response.data || []);
      setCategoryDropdownVisible(true);
    } catch (error) {
      console.log("Error fetching Categories:", error);
    }
  };

  useEffect(() => {
    if (!query) {
      setLoadingSkills(false);
      return;
    }
    setLoadingSkills(true);
    const delayDebounce = setTimeout(() => {
      skillsList().finally(() => setLoadingSkills(false));
    }, 200); // 200ms debounce delay

    return () => {
      clearTimeout(delayDebounce);
      setLoadingSkills(false);
    }; // Cleanup
  }, [query]);

  useEffect(() => {
    if (!categoryQuery) {
      setLoadingCategories(false);
      return;
    }
    setLoadingCategories(true);
    const delayDebounce = setTimeout(() => {
      categoryList().finally(() => setLoadingCategories(false));
    }, 200); // 200ms debounce delay

    return () => {
      clearTimeout(delayDebounce);
      setLoadingCategories(false);
    }; // Cleanup
  }, [categoryQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-gradient-to-br from-[#2d1a4d] via-[#5a2b77] to-[#1a1333] text-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border border-purple-900 scrollbar-hide">
        {/* Close Button */}
        <button
          onClick={() => {
            setUpdateModal(false);
            closeUpdateModal();
          }}
          className="absolute top-4 right-4 text-purple-300 hover:text-red-500 transition-colors "
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-6 text-purple-200 text-center drop-shadow-lg">
          Update Project
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProject(e);
          }}
          className="space-y-6 text-purple-100"
        >
          {/* Title */}
          <label className="block text-sm font-semibold text-purple-300 mb-1">
            Title
          </label>
          <input
            name="title"
            value={fields.title || ""}
            onChange={(e) =>
              setFields((prevFields) => ({
                ...prevFields,
                title: e.target.value,
              }))
            }
            required
            placeholder="Project Title"
            className="w-full p-3 border border-purple-700 bg-[#1a1333] rounded-lg placeholder-purple-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />

          {/* Description */}
          <label className="block text-sm font-semibold text-purple-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={fields.description || ""}
            onChange={(e) =>
              setFields((prevFields) => ({
                ...prevFields,
                description: e.target.value,
              }))
            }
            required
            placeholder="Project Description"
            rows={4}
            className="w-full p-3 border border-purple-700 bg-[#1a1333] rounded-lg placeholder-purple-400 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="postDate"
                value={fields.start_date || ""}
                onChange={(e) =>
                  setFields((prevFields) => ({
                    ...prevFields,
                    start_date: e.target.value,
                  }))
                }
                required
                className="w-full p-3 border border-purple-700 bg-[#1a1333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-1">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={fields.deadline || ""}
                onChange={(e) =>
                  setFields((prevFields) => ({
                    ...prevFields,
                    deadline: e.target.value,
                  }))
                }
                required
                className="w-full p-3 border border-purple-700 bg-[#1a1333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
              />
            </div>
          </div>

          {/* Budget */}
          <label className="block text-sm font-semibold text-purple-300 mb-1">
            Budget
          </label>
          <input
            type="number"
            name="budget"
            value={fields.budget || ""}
            onChange={(e) =>
              setFields((prevFields) => ({
                ...prevFields,
                budget: e.target.value,
              }))
            }
            required
            placeholder="Budget (₹)"
            className="w-full p-3 border border-purple-700 bg-[#1a1333] rounded-lg placeholder-purple-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />

          {/* Tags Section */}
          <div className="relative">
            <label className="block text-sm font-semibold text-purple-300 mb-1">
              Categories
            </label>
            <div className="relative w-full">
              <input
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  setCategoryQuery(e.target.value);
                }}
                onFocus={() => {
                  if (categorySuggestions.length > 0) {
                    setCategoryDropdownVisible(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setCategoryDropdownVisible(false), 100); // allow time for click
                }}
                placeholder="Search category"
                className="w-full p-3 border border-purple-700 bg-[#1a1333] rounded-lg placeholder-purple-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                autoComplete="off"
              />

              {/* Loader positioned over/next to input */}
              {loadingCategories && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1 ">
                  <span className="sr-only">Loading...</span>
                  <div className="h-1 w-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-1 w-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-1 w-1 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
              )}
            </div>
            {/* <button
              type="button"
              onClick={() =>
                tagInput && setTags([...tags, tagInput]) & setTagInput("")
              }
              className="bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition shadow font-semibold"
            >
              Add
            </button> */}

            {categorySuggestions.length > 0 && categoryDropdownVisible && (
              <ul className="absolute z-10 mt-1 w-full bg-[#1a1333] border border-purple-700 rounded-lg shadow-lg max-h-48 overflow-y-auto text-sm">
                {categorySuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-purple-700/40 text-purple-200"
                    onClick={() => {
                      if (!tags.includes(suggestion)) {
                        setTags([...tags, suggestion]);
                      }
                      setTagInput("");
                      setCategoryQuery("");
                      setCategorySuggestions([]);
                      setCategoryDropdownVisible(false);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {tags &&
                tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-purple-900/70 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-700 shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="relative">
            <label className="block text-sm font-semibold text-purple-300 mb-1">
              Skills
            </label>
            <div className="relative w-full">
              <input
                value={skillInput}
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  setQuery(e.target.value);
                }}
                onFocus={() => {
                  if (skillSuggestions.length > 0) {
                    setSkillsDropdownVisible(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setSkillsDropdownVisible(false), 100);
                }}
                placeholder="Search skill"
                className="flex-grow p-3 border border-green-700 bg-[#1a1333] rounded-lg placeholder-green-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm w-full"
                autoComplete="off"
              />

              {/* Loader positioned over/next to input */}
              {loadingSkills && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1 ">
                  <span className="sr-only">Loading...</span>
                  <div className="h-1 w-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-1 w-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-1 w-1 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
              )}
            </div>

            {skillSuggestions.length > 0 && skillsDropdownVisible && (
              <ul className="absolute z-10 mt-1 w-full bg-[#1a1333] border border-green-700 rounded-lg shadow-lg max-h-48 overflow-y-auto text-sm">
                {skillSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-green-700/40 text-green-200"
                    onClick={() => {
                      if (!skills.includes(suggestion)) {
                        setSkills([...skills, suggestion]);
                      }
                      setSkillInput("");
                      setQuery("");
                      setSkillSuggestions([]);
                      setSkillsDropdownVisible(false);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {skills &&
                skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-green-900/70 text-green-200 px-3 py-1 rounded-full text-sm border border-green-700 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setUpdateModal(false);
                closeUpdateModal();
              }}
              className="px-5 py-2 border border-purple-700 text-purple-200 rounded-lg hover:bg-purple-900/40 transition transform hover:scale-105 font-semibold shadow"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white px-5 py-2 rounded-lg transition transform hover:scale-105 font-semibold shadow"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProject;
