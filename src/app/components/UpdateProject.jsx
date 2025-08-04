"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

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
}) => {
  const [fields, setFields] = useState({
    title: selectedProject?.title || "",
    description: selectedProject?.description || "",
    start_date: selectedProject?.created_at || selectedProject?.start_date ||  "",
    deadline: selectedProject?.deadline || "",
    budget: selectedProject?.budget || 0,
    categories: selectedProject?.categories || [],
    skills: selectedProject?.skills || [],
  });

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm px-4">
      <div className="bg-gradient-to-br from-[#2d1a4d] via-[#5a2b77] to-[#1a1333] text-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border border-purple-900 scrollbar-hide">
        {/* Close Button */}
        <button
          onClick={() => setUpdateModal(false)}
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

          {/* Budget */}
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
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-1">
              Categories
            </label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter category"
                className="flex-grow p-3 border border-purple-700 bg-[#1a1333] rounded-lg placeholder-purple-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
              />
              <button
                type="button"
                onClick={() =>
                  tagInput && setTags([...tags, tagInput]) & setTagInput("")
                }
                className="bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition shadow font-semibold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, idx) => (
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
          <div>
            <label className="block text-sm font-semibold text-green-300 mb-1">
              Skills
            </label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Enter skill"
                className="flex-grow p-3 border border-green-700 bg-[#1a1333] rounded-lg placeholder-green-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              />
              <button
                type="button"
                onClick={() =>
                  skillInput &&
                  setSkills([...skills, skillInput]) & setSkillInput("")
                }
                className="bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 text-white px-4 py-2 rounded-lg transition shadow font-semibold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, idx) => (
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
              onClick={() => setUpdateModal(false)}
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
