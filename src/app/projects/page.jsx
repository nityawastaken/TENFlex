"use client";
import React, { useState, useEffect } from "react";
import { ArrowUpRight, Users, Clock, X, CheckCircle, AlertCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "@/app/contexts/UserContext";
import projectService from "@/services/projectService";
import skillService from "@/services/skillService";

// Add CSS animations
const projectPageStyles = `
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideIn {
    0% { opacity: 0; transform: translateX(-20px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes scaleIn {
    0% { opacity: 0; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.95); }
    80% { opacity: 1; transform: scale(1.03); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.4,0,0.2,1) both; }
  .animate-fadeInUp { animation: fadeInUp 0.7s cubic-bezier(0.4,0,0.2,1) both; }
  .animate-slideIn { animation: slideIn 0.5s cubic-bezier(0.4,0,0.2,1) both; }
  .animate-scaleIn { animation: scaleIn 0.4s cubic-bezier(0.4,0,0.2,1) both; }
  .animate-popIn { animation: popIn 0.4s cubic-bezier(0.4,0,0.2,1) both; }
  
  .project-card {
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  
  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .bid-item {
    transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
  }
  
  .bid-item:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .modal-overlay {
    backdrop-filter: blur(8px);
    animation: fadeIn 0.3s cubic-bezier(0.4,0,0.2,1) both;
  }
  
  .modal-content {
    animation: popIn 0.4s cubic-bezier(0.4,0,0.2,1) both;
  }
`;

const ProjectPage = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [showModal, setShowModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [currentBidProjectId, setCurrentBidProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [user, setUser] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [tags, setTags] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillsMap, setSkillsMap] = useState({});

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        const backendProjects = await projectService.getAllProjects();
        setProjects(backendProjects);
      } catch (err) {
        setError("An error occurred while fetching projects");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const skillsData = await skillService.getAllSkills();
        const map = {};
        skillsData.forEach(skill => { map[skill.id] = skill.name; });
        setSkillsMap(map);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    }
    fetchSkills();
  }, []);

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
      deadline: form.deadline.value,
      budget: parseFloat(form.budget.value),
      skill_ids: skills.map(skill => parseInt(skill, 10)).filter(id => !isNaN(id)),
      category_ids: tags.map(tag => parseInt(tag, 10)).filter(id => !isNaN(id)),
    };

    try {
      // Use projectService instead of direct fetch
      await projectService.createProject(newProject);
      toast.success("Project posted successfully!");
      setShowModal(false);
      
      // Clear form fields
      setTags([]);
      setSkills([]);
      
      // Refresh projects list
      const updatedProjects = await projectService.getAllProjects();
      setProjects(updatedProjects);
    } catch (error) {
      console.error(error);
      toast.error("Failed to post project. Please try again.");
    }
  };

  // Function to accept a bid
  const handleAcceptBid = async (bidId) => {
    try {
      await projectService.acceptBid(bidId);
      toast.success("Bid accepted successfully!");
      
      // Refresh projects after accepting bid
      const updatedProjects = await projectService.getAllProjects();
      setProjects(updatedProjects);
      
      // Close project popup
      closeProjectPopup();
    } catch (error) {
      console.error("Error accepting bid:", error);
      toast.error("Failed to accept bid. Please try again.");
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.is_freelancer) {
      toast.error("Only freelancers can place a bid. Please sign in as a freelancer.");
      return;
    }
    const amount = e.target.amount.value;
    const message = e.target.message?.value || "";
    try {
      await projectService.placeBid(currentBidProjectId, {
        bid_amount: amount,
        message,
    });
      toast.success("Bid placed successfully!");
      setShowBidModal(false);
    } catch (error) {
      toast.error("An error occurred while placing bid");
    }
  };



  const openProjectPopup = (project) => {
    setSelectedProject(project);
    setShowProjectPopup(true);
  };

  const closeProjectPopup = () => {
    setShowProjectPopup(false);
    setSelectedProject(null);
  };

  const toggleFilter = (value, setState, state) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { currentUser } = useUserContext();
  const isFreelancer = currentUser?.is_freelancer;

  // Debug currentUser changes
  useEffect(() => {
    console.log("Current user changed:", currentUser);
  }, [currentUser]);

  // Dummy projects data
  const dummyProjects = [
    {
      id: 1,
      title: "New customer project 1",
      description: "This is the first posting",
      skills: ["css"],
      deadline: "2025-06-30",
      budget: 12000,
      bids: [
        { id: 1, amount: 200, date: "2025-06-16T22:53:01" },
        { id: 2, amount: 150, date: "2025-06-16T22:58:06" },
        { id: 3, amount: 150, date: "2025-06-16T22:59:24" },
      ],
    },
    {
      id: 2,
      title: "New customer project 2",
      description: "Second project for demo",
      skills: ["react", "nodejs"],
      deadline: "2025-07-10",
      budget: 5000,
      bids: [
        { id: 1, amount: 1000, date: "2025-06-17T10:00:00" },
      ],
    },
  ];

  return (
    <div className="main mt-[87px]">
      {/* Add CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: projectPageStyles }} />
      
      {/* Toast container at bottom right */}
      <ToastContainer position="bottom-right" autoClose={3000} />
      {/* Summary Cards */}
      {/* Remove the Active Projects and Freelancers cards from the top section */}
      {/* Ensure the Browse Projects and Categories toggle section is fully removed */}

      {/* Search and Filters */}
      <div className="p-6 pt-4 space-y-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white shadow-sm p-6 rounded-xl project-card">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="relative w-full sm:w-[80%] group">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-md border outline-none text-black placeholder-black transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
              {searchQuery && (
              <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                  <X size={16} />
              </button>
              )}
              
              {/* Search Hover Popup */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-10">
                <div className="bg-black text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                  Search through all available projects
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold animate-slideIn" style={{ animationDelay: '0.3s' }}>Latest Projects</h2>
          <div className="relative group animate-scaleIn" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => {
                if (!currentUser) {
                  toast.error("Please sign in to post a project.");
                } else if (!isFreelancer) {
                  setShowModal(true);
                } else {
                  toast.info("Freelancers cannot post projects. Please switch to a client account.");
                }
              }}
              className={`ml-auto px-5 py-2 rounded-md transition-all duration-300 font-semibold transform hover:scale-105 ${
                !currentUser || isFreelancer
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#0f172a] text-white hover:bg-[#1e293b] hover:shadow-lg"
              }`}
              disabled={!currentUser || isFreelancer}
            >
              Post Project
            </button>
            {!currentUser && (
              <span className="absolute top-full mt-1 left-0 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0">
                Login required to post
              </span>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12 animate-fadeIn">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Loading projects...</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-fadeIn flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found. Try adjusting your search criteria.</p>
          </div>
        )}
        {filteredProjects.map((project, index) => (
          <div
            key={project.id || index}
            className={`border rounded-xl p-5 mb-6 shadow-sm bg-white project-card animate-fadeInUp${currentUser ? ' cursor-pointer' : ''}`}
            style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            onClick={() => { if (currentUser) openProjectPopup(project); }}
          >
            <h3 className="text-xl font-bold text-black mb-1">{project.title}</h3>
            <p className="text-black mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.categories?.map((category, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {category.name}
                </span>
              ))}
            </div>
            {project.skills_required && project.skills_required.length > 0 && (
              <div className="flex gap-2 mb-2">
                {project.skills_required.map((skillId, idx) => (
                  <span key={skillId || idx} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-semibold border border-gray-200">
                    {skillsMap[skillId] ? skillsMap[skillId].toUpperCase() : ''}
                  </span>
                ))}
              </div>
            )}
            <div className="text-sm text-gray-600 mb-4 flex justify-between items-center">
              <span className="text-black">Deadline: {project.deadline}</span>
              <span className="text-black">Budget: ₹{project.budget}</span>
              <span className="text-black">{project.bids ? project.bids.length : 0} bids</span>
              {isFreelancer && project.is_open && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent popup from opening
                    setCurrentBidProjectId(project.id);
                    setShowBidModal(true);
                  }}
                  className="bg-black text-white px-4 py-1 rounded transition-all duration-300 hover:bg-gray-800 hover:scale-105 transform"
                >
                  Place Bid
                </button>
              )}
              {!project.is_open && (
                <span className="text-green-600 font-semibold">
                  Closed - Bid accepted
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {showModal && (
        <div className="fixed inset-0 modal-overlay bg-black/50 flex items-center justify-center z-50">
          <div className="modal-content bg-white p-6 rounded-xl w-[90%] sm:w-[500px] max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">Post New Project</h2>
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
                  className="px-4 py-2 border rounded transition-all duration-300 hover:bg-gray-100 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded transition-all duration-300 hover:bg-gray-800 transform hover:scale-105"
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
        <div className="fixed inset-0 modal-overlay bg-black/50 flex items-center justify-center z-50">
          <div className="modal-content bg-white p-6 rounded-xl w-[90%] sm:w-[400px] relative">
            <button
              onClick={() => setShowBidModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">Place Your Bid</h2>
            <form
              onSubmit={(e) => handleBidSubmit(e)}
              className="space-y-4"
            >
              {/* Optional: show user name (readonly) */}
              <div className="text-sm text-gray-700">
                Bidding as: <span className="font-semibold">{user?.name}</span>
              </div>

              {/* Bid Amount */}
              <input
                name="amount"
                type="number"
                required
                placeholder="Bid Amount ₹"
                className="w-full p-2 border rounded text-black placeholder-black"
              />

              {/* Optional: Message field */}
              <textarea
                name="message"
                placeholder="Message (optional)"
                className="w-full p-2 border rounded resize-none text-black"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="px-6 py-2 border border-black text-black rounded font-semibold mr-2 bg-white transition-all duration-300 hover:bg-gray-100 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded transition-all duration-300 hover:bg-gray-800 transform hover:scale-105"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Detail Popup */}
      {showProjectPopup && selectedProject && (
        <div className="fixed inset-0 modal-overlay bg-black/50 flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-xl w-[95%] sm:w-[700px] max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeProjectPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X size={24} />
            </button>
            
            <div className="p-6">
              {/* Project Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black mb-2">{selectedProject.title}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Project Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">Project Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-semibold text-black">₹{selectedProject.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-semibold text-black">{selectedProject.deadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold ${selectedProject.is_open ? "text-green-600" : "text-red-600"}`}>
                        {selectedProject.is_open ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted By:</span>
                      <span className="font-semibold text-black">{selectedProject.client_name || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.skills_required && selectedProject.skills_required.length > 0 ? (
                      selectedProject.skills_required.map((skillId, idx) => (
                        <span key={skillId || idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {skillsMap[skillId] ? skillsMap[skillId].toUpperCase() : 'Unknown'}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No specific skills listed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Categories */}
              {selectedProject.categories && selectedProject.categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-black mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.categories.map((category, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bids Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-black text-lg">Bids</h3>
                  <span className="text-sm text-gray-600">
                    {selectedProject.bids?.length || 0} total bids
                  </span>
                </div>

                {/* For Freelancers - Show their bids */}
                {isFreelancer && (
                  <div>
                    {selectedProject.bids?.filter(bid => bid.freelancer_name === currentUser.username)?.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-medium text-black">Your Bids:</h4>
                        {selectedProject.bids
                          .filter(bid => bid.freelancer_name === currentUser.username)
                          .map((bid, index) => (
                            <div key={bid.id} className="bg-green-50 border border-green-200 rounded-lg p-4 bid-item animate-slideIn" style={{ animationDelay: `${index * 0.1}s` }}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-semibold text-green-800">₹{bid.bid_amount}</div>
                                  {bid.message && (
                                    <div className="text-sm text-green-700 mt-1">"{bid.message}"</div>
                                  )}
                                </div>
                                <div className="text-xs text-green-600">
                                  {bid.created_at ? new Date(bid.created_at).toLocaleString() : ''}
                                </div>
                              </div>
                              {bid.is_accepted && (
                                <div className="mt-2 flex items-center text-green-700">
                                  <CheckCircle size={16} className="mr-1" />
                                  <span className="text-sm font-medium">Your bid was accepted!</span>
                                </div>
                              )}
                            </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>You haven't placed any bids on this project yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* For Clients - Show all bids */}
                {!isFreelancer && selectedProject.client === currentUser?.id && (
                  <div>
                    {selectedProject.bids?.length > 0 ? (
                      <div className="space-y-3">
                        {selectedProject.bids.map((bid, index) => (
                          <div key={bid.id} className={`border rounded-lg p-4 bid-item animate-slideIn ${bid.is_accepted ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'}`} style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-semibold text-black">₹{bid.bid_amount}</div>
                                <div className="text-sm text-gray-600 mt-1">Freelancer: {bid.freelancer_name || bid.freelancer}</div>
                                {bid.message && (
                                  <div className="text-sm text-gray-700 mt-1">"{bid.message}"</div>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="text-xs text-gray-500">
                                  {bid.created_at ? new Date(bid.created_at).toLocaleString() : ''}
                                </div>
                                {selectedProject.is_open && !bid.is_accepted && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAcceptBid(bid.id);
                                    }}
                                    className="px-4 py-1 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 transition-all duration-200 hover:scale-105 transform"
                                  >
                                    Accept
                                  </button>
                                )}
                                {bid.is_accepted && (
                                  <div className="flex items-center text-green-700">
                                    <CheckCircle size={16} className="mr-1" />
                                    <span className="text-sm font-medium">Accepted</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No bids have been placed on this project yet.</p>
                      </div>
                    )}
                  </div>
                )}
                {!isFreelancer && selectedProject.client !== currentUser?.id && (
                  <div className="text-center py-8 text-gray-500">
                    <p>You are not the owner of this project.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={closeProjectPopup}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg transition-all duration-300 hover:bg-gray-50 transform hover:scale-105"
                >
                  Close
                </button>
                {isFreelancer && selectedProject.is_open && (
                  <button
                    onClick={() => {
                      closeProjectPopup();
                      setCurrentBidProjectId(selectedProject.id);
                      setShowBidModal(true);
                    }}
                    className="px-6 py-2 bg-black text-white rounded-lg transition-all duration-300 hover:bg-gray-800 transform hover:scale-105"
                  >
                    Place Bid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
