"use client";
import React, { useEffect, useState, useRef, use } from "react";
import { useUserContext } from "../contexts/UserContext";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setReduxUser } from "@/utils/redux/slices/userSlice";
import SuccesAlert from "../components/SuccessAlert";

// Mock data for demonstration
const mockProjects = [
  { id: 1, title: "Website Redesign", status: "active" },
  { id: 2, title: "Logo Design", status: "closed" },
];
const mockOrders = [
  { id: 1, title: "SEO Optimization", status: "completed" },
  { id: 2, title: "App UI/UX", status: "ongoing" },
  { id: 3, title: "Content Writing", status: "pending" },
];
const mockReviews = [
  { id: 1, text: "Great work!", for: "John Doe" },
  { id: 2, text: "Very professional.", for: "Jane Smith" },
];
const mockGiglists = [
  { id: 1, name: "Design Inspiration", gigs: ["Logo", "Banner"] },
  { id: 2, name: "Marketing", gigs: ["SEO", "Copywriting"] },
];
const mockFreelancers = [
  { id: 1, name: "John Doe", skill: "Web Developer" },
  { id: 2, name: "Jane Smith", skill: "Graphic Designer" },
];

const Section = React.forwardRef(({ title, children, id }, ref) => (
  <div ref={ref} id={id} className="mb-8 bg-[#1a1333] rounded-lg shadow-lg p-6">
    <h2 className="text-xl font-bold text-purple-400 mb-4">{title}</h2>
    {children}
  </div>
));
Section.displayName = "Section";

const page = () => {
  const userData = useSelector((state) => state.user);

  const { loading } = useUserContext();
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [giglists, setGiglists] = useState([]);
  const [freelancers, setFreelancers] = useState([]);

  // Profile edit state
  const [editMode, setEditMode] = useState(false);
  const [editFirstName, setEditFirstName] = useState(
    userData?.currentUser?.first_name || ""
  );
  const [editLastName, setEditLastName] = useState(
    userData?.currentUser?.last_name || ""
  );
  const [editEmail, setEditEmail] = useState(
    userData?.currentUser?.email || ""
  );
  const [editBio, setEditBio] = useState(userData?.currentUser?.bio || "");
  const [editLocation, setEditLocation] = useState(
    userData?.currentUser?.location || ""
  );
  const [editContact, setEditContact] = useState(
    userData?.currentUser?.contact || ""
  );
  const [editProfilePicture, setEditProfilePicture] = useState(
    userData?.currentUser?.profile_picture || ""
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("ongoing");

  const dispatch = useDispatch();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const router = useRouter();

  // Section refs for scrolling
  const profileRef = useRef(null);
  const projectsRef = useRef(null);
  const ordersRef = useRef(null);
  const reviewsRef = useRef(null);
  const giglistsRef = useRef(null);
  const freelancersRef = useRef(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/base/users/${userData.currentUser.id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      // console.log("User data fetched successfully:", response);
      dispatch(setReduxUser(response.data));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchUserData();
    setProjects(mockProjects);
    setOrders(mockOrders);
    setReviews(mockReviews);
    setGiglists(mockGiglists);
    setFreelancers(mockFreelancers);

    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false);
        setError("");
      }, 5000);
      return () => clearTimeout(timer); // Clean up
    }
  }, []);

  // Handle status change from dropdown
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  if (!userData.currentUser) {
    return <div className="text-center mt-24 text-purple-300 ">Loading...</div>;
  }

  // Save handler
  const handleSave = async () => {
    try {
      const newUserData = {
        first_name: editFirstName,
        last_name: editLastName,
        email: editEmail,
        contact: editContact,
        location: editLocation,
        bio: editBio,
      };
      const response = await axios.patch(
        "http://127.0.0.1:8000/base/users/14/",
        newUserData,
        {
          headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.id) {
        dispatch(setReduxUser(response.data));
        setIsSuccess(true);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (err) {
      console.error("Error saving profile data:", err);
    }
    setEditMode(false);
  };

  // Sidebar navigation handler
  const handleNav = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (isSuccess) {
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1333] to-[#2d1a4d] text-white p-6 pt-28 flex">
      {isSuccess && <SuccesAlert message={"Update Success"} />}
      {/* Sidebar */}
      <aside className="w-56 mr-8 hidden md:block">
        <nav className="sticky top-32 bg-[#24194a] rounded-lg shadow-lg p-4">
          <ul className="space-y-4">
            <li>
              <button
                className="w-full text-left text-purple-300 hover:text-purple-400 font-semibold"
                onClick={() => handleNav(profileRef)}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className="w-full text-left text-purple-300 hover:text-purple-400 font-semibold"
                onClick={() => handleNav(projectsRef)}
              >
                Projects
              </button>
            </li>
            <li>
              <button
                className="w-full text-left text-purple-300 hover:text-purple-400 font-semibold"
                onClick={() => handleNav(ordersRef)}
              >
                Orders
              </button>
            </li>
            <li>
              <button
                className="w-full text-left text-purple-300 hover:text-purple-400 font-semibold"
                onClick={() => handleNav(reviewsRef)}
              >
                Reviews
              </button>
            </li>
            <li>
              <button
                className="w-full text-left text-purple-300 hover:text-purple-400 font-semibold"
                onClick={() => handleNav(freelancersRef)}
              >
                Saved Freelancers
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto">
        {/* Basic Details */}
        <Section ref={profileRef} id="profile" title="Profile">
          <div className="flex items-center gap-6 ">
            <div className="w-20 h-20 rounded-full bg-purple-700 flex items-center justify-center text-3xl font-bold">
              {editProfilePicture ? (
                <div>
                  <img
                    src={editProfilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              ) : (
                <div> {editFirstName?.[0] || "U"} </div>
              )}
            </div>
            <div className="flex-1">
              {editMode ? (
                <form
                  className="space-y-2 "
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                >
                  {/* <div>
                    <input type="file" className="" />
                  </div> */}
                  <div>
                    <div className="flex gap-3 mb-1 justify-around">
                      <input
                        className="w-full bg-[#24194a] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                      />
                      <input
                        className="w-full bg-[#24194a] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                      />
                    </div>
                    {/* <input
                      className="w-full bg-[#24194a] text-white rounded px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="Email"
                      type="email"
                      required
                    /> */}
                    <div className="flex gap-3 mb-1 justify-around">
                      <input
                        className="w-full bg-[#24194a] text-white rounded px-3 py-2  focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={editContact}
                        onChange={(e) => setEditContact(e.target.value)}
                        placeholder="Contact Number"
                        type="number"
                      />
                      <input
                        className="w-full bg-[#24194a] text-white rounded px-3 py-2  focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder="Your Location"
                        type="text"
                        // required
                      />
                    </div>
                    <textarea
                      className="w-full bg-[#24194a] text-white rounded px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Bio"
                      rows={2}
                    />

                    <div className="flex gap-2 mt-2">
                      <button
                        type="submit"
                        className="px-4 py-1 bg-purple-600 hover:bg-purple-800 rounded"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="px-4 py-1 bg-gray-600 hover:bg-gray-800 rounded"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <>
                  <div className="text-2xl font-semibold">
                    {editFirstName + " " + editLastName || "User Name"}
                  </div>

                  <>
                    {" "}
                    <div className="text-purple-300">
                      {editEmail || "email@emai.com"}
                    </div>
                    <div className="mt-2 text-gray-300">
                      {editContact || "contact"}
                    </div>
                    <div className="mt-2 text-gray-300">
                      {editLocation || "location"}
                    </div>
                    <div className="mt-2 text-gray-300">{editBio || "bio"}</div>{" "}
                  </>

                  <button
                    className="mt-3 px-4 py-1 bg-purple-600 hover:bg-purple-800 rounded text-sm"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </Section>

        {/* Projects (Bids) */}
        <Section ref={projectsRef} id="projects" title="Your Projects">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg text-purple-300 mb-2">Active Bids</h3>
              {projects.filter((p) => p.status === "active").length === 0 ? (
                <div className="text-gray-400">No active bids.</div>
              ) : (
                projects
                  .filter((p) => p.status === "active")
                  .map((p) => (
                    <div key={p.id} className="bg-[#24194a] p-3 rounded mb-2">
                      {p.title}
                    </div>
                  ))
              )}
            </div>
            <div>
              <h3 className="text-lg text-purple-300 mb-2">Closed Bids</h3>
              {projects.filter((p) => p.status === "closed").length === 0 ? (
                <div className="text-gray-400">No closed bids.</div>
              ) : (
                projects
                  .filter((p) => p.status === "closed")
                  .map((p) => (
                    <div key={p.id} className="bg-[#24194a] p-3 rounded mb-2">
                      {p.title}
                    </div>
                  ))
              )}
            </div>
          </div>
        </Section>

        {/* Orders */}
        <Section ref={ordersRef} id="orders" title="Your Orders">
          {/* Dropdown for status filter */}
          <div className="mb-4">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="px-4  py-2 border border-purple-700 rounded bg-[#24194a] text-white"
            >
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full ">
            {["completed", "ongoing", "pending"].map((status) => {
              // Only show the selected status
              if (status !== selectedStatus) return null;

              return (
                <div key={status} className="w-full">
                  <h3 className="text-lg text-purple-300 mb-2 capitalize w-full">
                    {status}
                  </h3>
                  {mockOrders.filter((o) => o.status === status).length ===
                  0 ? (
                    <div className="text-gray-400 w-full">
                      No {status} orders.
                    </div>
                  ) : (
                    mockOrders
                      .filter((o) => o.status === status)
                      .map((o) => (
                        <div
                          key={o.id}
                          className="bg-[#24194a] p-3 rounded mb-2 flex justify-between items-center w-full "
                        >
                          <span>{o.title}</span>
                          {/* <button
                        className="ml-2 px-3 py-1 bg-purple-600 hover:bg-purple-800 rounded text-xs"
                        title="Repeat Order"
                      >
                        Repeat
                      </button> */}
                        </div>
                      ))
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Reviews */}
        <Section ref={reviewsRef} id="reviews" title="Your Reviews">
          {reviews.length === 0 ? (
            <div className="text-gray-400">
              You haven't posted any reviews yet.
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-[#24194a] p-3 rounded mb-2">
                <div className="text-purple-200">For: {r.for}</div>
                <div>{r.text}</div>
              </div>
            ))
          )}
        </Section>

        {/* Giglists */}
        <Section ref={giglistsRef} id="giglists" title="Your Giglists">
          {giglists.length === 0 ? (
            <div className="text-gray-400">No giglists created yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {giglists.map((g) => (
                <div key={g.id} className="bg-[#24194a] p-3 rounded mb-2">
                  <div className="font-semibold text-purple-300">{g.name}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {g.gigs.map((gig, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-700 px-2 py-1 rounded text-xs"
                      >
                        {gig}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Saved Freelancers */}
        <Section
          ref={freelancersRef}
          id="saved_freelancers"
          title="Saved Freelancers"
        >
          {freelancers.length === 0 ? (
            <div className="text-gray-400">No freelancers saved yet.</div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {freelancers.map((f) => (
                <div
                  key={f.id}
                  className="bg-[#24194a] p-4 rounded flex flex-col items-center w-40"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center text-xl font-bold mb-2">
                    {f.name[0]}
                  </div>
                  <div className="font-semibold">{f.name}</div>
                  <div className="text-purple-300 text-sm">{f.skill}</div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
};

export default page;
