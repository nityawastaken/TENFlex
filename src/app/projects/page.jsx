"use client";
import React, { useState, useEffect } from "react";
import { ArrowUpRight, Users, Clock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectPage = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [showModal, setShowModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [currentBidIndex, setCurrentBidIndex] = useState(null);
  const [expandedBids, setExpandedBids] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [user, setUser] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [tags, setTags] = useState([]);
  const [skills, setSkills] = useState([]);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data); // ← directly use data (no .projects)
  };

const handleAddProject = async (e) => {
  e.preventDefault();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) {
    toast.error("You must be logged in to post a project.");
    return;
  }

  const form = e.target;

  const newProject = {
    title: form.title.value,
    description: form.description.value,
    postDate: form.postDate.value,
    deadline: form.deadline.value,
    budget: form.budget.value,
    tags,              // ✅ use tags state
    skills,            // ✅ use skills state
    postedBy: storedUser.name,
    email: storedUser.email, // ✅ include user email
    datePosted: new Date().toISOString().slice(0, 10),
    bids: [],
  };

  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });

    const data = await res.json();
    if (res.ok) {
      setProjects((prev) => [data.project, ...prev]);
      toast.success("Project posted successfully!");
      setShowModal(false);
      // clear tag and skill inputs
      setTags([]);
      setSkills([]);
    } else {
      toast.error(data.message || "Failed to post project");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong!");
  }
};





  const handleBidSubmit = async (e, projectId) => {
    e.preventDefault();
    const name = e.target.name.value;
    const amount = e.target.amount.value;

    const res = await fetch(`/api/projects/${projectId}/bid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amount }),
    });

    if (res.ok) {
      fetchProjects();
      setShowBidModal(false);
    }
  };

  const toggleBids = (index) => {
    setExpandedBids((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleFilter = (value, setState, state) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => project.tags.includes(tag));
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.every((skill) => project.skills.includes(skill));
    return matchesSearch && matchesTags && matchesSkills;
  });


  return (
    <div className="main mt-[87px]">
      {/* Toast container at bottom right */}
      <ToastContainer position="bottom-right" autoClose={3000} />
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Active Projects</p>
            <h2 className="text-2xl font-bold">{projects.length}</h2>
          </div>
          <ArrowUpRight className="text-blue-500" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Freelancers</p>
            <h2 className="text-2xl font-bold">15,234</h2>
          </div>
          <Users className="text-green-600" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Avg. Response Time</p>
            <h2 className="text-2xl font-bold">2.4 hrs</h2>
          </div>
          <Clock className="text-purple-500" />
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full flex justify-center mt-20">
        <div className="bg-gray-100 p-2 rounded-md inline-flex">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-2 rounded-md font-medium ${
              activeTab === "projects"
                ? "bg-white text-black shadow"
                : "text-gray-500"
            }`}
          >
            Browse Projects
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-2 rounded-md font-medium ${
              activeTab === "categories"
                ? "bg-white text-black shadow"
                : "text-gray-500"
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 pt-4 space-y-4">
        <div className="bg-white shadow-sm p-6 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[80%] px-4 py-2 rounded-md border outline-none"
            />
            <div className="relative">
              <button
                onClick={() => setShowFilterPopover(!showFilterPopover)}
                className="bg-gray-100 px-4 py-2 rounded-md font-medium"
              >
                Filter
              </button>
              {showFilterPopover && (
                <div className="absolute z-10 mt-2 right-0 bg-white border shadow-md p-4 rounded-xl w-[300px] sm:w-[350px]">
                  <h4 className="font-semibold mb-2">Filter by Tags</h4>
                  {["HTML", "CSS", "JavaScript", "React"].map((tag) => (
                    <label key={tag} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() =>
                          toggleFilter(tag, setSelectedTags, selectedTags)
                        }
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                  <h4 className="font-semibold mt-4 mb-2">Filter by Skills</h4>
                  {["Frontend", "Backend", "Full Stack"].map((skill) => (
                    <label key={skill} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() =>
                          toggleFilter(skill, setSelectedSkills, selectedSkills)
                        }
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Latest Projects</h2>
          <div className="relative group">
            <button
              onClick={() => {
                if (!user) {
                  toast.error("Please sign in to post a project.");
                } else {
                  setShowModal(true);
                }
              }}
              className={`ml-auto px-5 py-2 rounded-md transition font-semibold ${
                user
                  ? "bg-[#0f172a] text-white hover:bg-[#1e293b]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Post Project
            </button>
            {!user && (
              <span className="absolute top-full mt-1 left-0 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                Login required to post
              </span>
            )}
          </div>
        </div>

        {filteredProjects.map((project, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 mb-6 shadow-sm bg-white"
          >
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="text-gray-500 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-600 mb-4 flex justify-between items-center">
              <span>Deadline: {project.deadline}</span>
              <span>Budget: ₹{project.budget}</span>
              <span>{project.bids?.length || 0} bids</span>
              <button
                onClick={() => {
                  setCurrentBidIndex(index);
                  setShowBidModal(true);
                }}
                className="bg-black text-white px-4 py-1 rounded"
              >
                Place Bid
              </button>
            </div>
            {/* Show last bid */}
            {project.bids?.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-semibold mb-1">Latest Bid:</p>
                <p className="text-sm text-gray-600">
                  {project.bids[project.bids.length - 1].name} - ₹
                  {project.bids[project.bids.length - 1].amount}
                </p>
              </div>
            )}
            {/* Show All Bids Toggle */}
            {project.bids.length > 1 && (
              <button
                onClick={() => toggleBids(index)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                {expandedBids[index]
                  ? "Hide all bids"
                  : `View all ${project.bids.length} bids`}
              </button>
            )}

            {/* Render Older Bids */}
            {expandedBids[index] && (
              <div className="space-y-2 mt-3">
                {project.bids
                  .slice(0, project.bids.length - 1)
                  .map((bid, i) => (
                    <div
                      key={i}
                      className="bg-white p-2 rounded-md border shadow-sm flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{bid.name}</p>
                        <p className="text-sm text-gray-500">₹{bid.amount}</p>
                      </div>
                      <span className="text-xs text-gray-400">{bid.time}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] sm:w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Post New Project</h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <input
                name="title"
                required
                placeholder="Title"
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                required
                placeholder="Description"
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="postDate"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="deadline"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="budget"
                required
                placeholder="Budget ₹"
                className="w-full p-2 border rounded"
              />

              {/* Tags */}
              <div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Tag"
                    className="flex-grow p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      tagInput && setTags([...tags, tagInput]) & setTagInput("")
                    }
                    className="bg-black text-white px-3 py-1 rounded"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Skill"
                    className="flex-grow p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      skillInput &&
                      setSkills([...skills, skillInput]) & setSkillInput("")
                    }
                    className="bg-black text-white px-3 py-1 rounded"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] sm:w-[400px]">
            <h2 className="text-xl font-bold mb-4">Place Your Bid</h2>
            <form
              onSubmit={(e) =>
                handleBidSubmit(e, projects[currentBidIndex]._id)
              }
              className="space-y-4"
            >
              <input
                name="name"
                required
                placeholder="Your Name"
                className="w-full p-2 border rounded"
              />
              <input
                name="amount"
                type="number"
                required
                placeholder="Bid Amount ₹"
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
