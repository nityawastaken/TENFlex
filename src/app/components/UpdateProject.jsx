"use client";

import React from "react";
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
  selectedProject
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-xl scrollbar-hide">
        {/* Close Button */}
        <button
          onClick={() => setUpdateModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Update Project
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProject(e);
          }}
          className="space-y-5 text-gray-800"
        >
          {/* Title */}
          <input
            name="title"
            value={selectedProject?.title}
            onChange={(e) => e.target.value}
            required
            placeholder="Project Title"
            className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Description */}
          <textarea
            name="description"
            value={selectedProject?.description}
            onChange={(e) => e.target.value}
            required
            placeholder="Project Description"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-500 text-black resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              name="postDate"
              value={selectedProject?.start_date}
              onChange={(e) => e.target.value}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="date"
              name="deadline"
              value={selectedProject?.deadline}
              onChange={(e) => e.target.value}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Budget */}
          <input
            type="number"
            name="budget"
            value={selectedProject?.budget}
            onChange={(e) => e.target.value}
            required
            placeholder="Budget (₹)"
            className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Tags Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter tag"
                className="flex-grow p-3 border border-gray-300 rounded-lg placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() =>
                  tagInput && setTags([...tags, tagInput]) & setTagInput("")
                }
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Enter skill"
                className="flex-grow p-3 border border-gray-300 rounded-lg placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() =>
                  skillInput &&
                  setSkills([...skills, skillInput]) & setSkillInput("")
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
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
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition transform hover:scale-105 font-semibold"
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
