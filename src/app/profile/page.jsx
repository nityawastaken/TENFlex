"use client";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userService, orderService, gigService } from "@/utils/services";
import { apiCall, endpoints } from "@/utils/api";
import { FaRegEdit } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [myGigs, setMyGigs] = useState([]);
  const [orders, setOrders] = useState({ pending: [], ongoing: [], completed: [] });
  const [completionPercent, setCompletionPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  const LANGUAGE_CODE_TO_NAME = {
    en: 'English',
    hi: 'Hindi',
    fr: 'French',
    es: 'Spanish',
    de: 'German',
    zh: 'Chinese',
    ru: 'Russian',
    // Add more as needed
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only extract token and id from localStorage, never use user data from there
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          router.push("/signin");
          return;
        }

        let userId = null;
        let token = null;
        try {
          const userData = JSON.parse(storedUser);
          userId = userData.id;
          token = userData.token;
        } catch (e) {
          toast.error("Corrupted user session, please login again");
          router.push("/signin");
          return;
        }

        if (!userId || !token) {
          toast.error("User ID or token not found, please login again");
          router.push("/signin");
          return;
        }

        // Always fetch latest user data from backend
        let freshUser = null;
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/base/users/${userId}/`, {
            headers: { Authorization: `Token ${token}` },
          });
          if (!response.ok) throw new Error("Failed to fetch user profile");
          freshUser = await response.json();
          setUser(freshUser);
          // Debug: Log the values for inline_orders and completed_orders
          // console.log("Fetched user from backend:", freshUser);
          // Update localStorage only for token/id, not for rendering
          localStorage.setItem("user", JSON.stringify({ ...freshUser, token }));
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load user data");
          setUser(null);
          return;
        }

        // Fetch profile completion percentage
        try {
          const completionRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/base/users/get-completion-percentage/`, {
            headers: { Authorization: `Token ${token}` },
          });
          if (completionRes.ok) {
            const percent = await completionRes.json();
            setCompletionPercent(percent);
          }
        } catch (err) {
          console.error("Failed to fetch profile completion:", err);
        }

        // For freelancers, fetch their gigs
        if (freshUser.is_freelancer) {
          // console.log("Fetching gigs for userId:", userId);
          try {
            const gigsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/base/user/${userId}/gigs/`, {
              headers: { Authorization: `Token ${token}` },
            });
            if (gigsRes.ok) {
              const gigsData = await gigsRes.json();
              // console.log("Fetched gigs data:", gigsData);
              setMyGigs(gigsData || []);
            }
          } catch (err) {
            console.error("Failed to fetch gigs:", err);
            setMyGigs([]);
          }
        }

        // Fetch orders
        try {
          const ordersEndpoint = freshUser.is_freelancer ? 'freelancer/orders/' : 'buyer/orders/';
          const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/base/${ordersEndpoint}`, {
            headers: { Authorization: `Token ${token}` },
          });
          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            setOrders({
              pending: ordersData.pending || [],
              ongoing: ordersData.ongoing || [],
              completed: ordersData.completed || [],
            });
          }
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // Helper to get full profile image URL
  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) return null;
    if (profileImage.startsWith('http')) return profileImage;
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${profileImage}`;
  };

  // Get initials from name
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format language names
  const getLanguageDisplay = () => {
    if (!user) return 'N/A';
    
    if (Array.isArray(user.languages) && user.languages.length > 0) {
      const languageNames = user.languages.map(lang => {
        const languageName = lang.language || lang;
        return LANGUAGE_CODE_TO_NAME[languageName] || languageName;
      });
      if (languageNames.length === 1) {
        return languageNames[0];
      } else {
        return `${languageNames[0]} +${languageNames.length - 1}`;
      }
    } else if (Array.isArray(user.lang_spoken) && user.lang_spoken.length > 0) {
      // Show first language + count if multiple
      const languages = user.lang_spoken.map(code => LANGUAGE_CODE_TO_NAME[code] || code);
      if (languages.length === 1) {
        return languages[0];
      } else {
        return `${languages[0]} +${languages.length - 1}`;
      }
    }
    
    return 'N/A';
  };

  // Calculate counts from orders state
  const ongoingOrdersCount = (orders.ongoing?.length || 0) + (orders.pending?.length || 0);
  const completedOrdersCount = orders.completed?.length || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
        <p className="text-xl mb-6">User profile not found</p>
        <button 
          onClick={() => router.push('/signin')}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white mt-20 flex">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6">
        <h2 className="text-xl font-bold mb-6">My Account</h2>

        {/* Profile Summary */}
        <div className="mb-6 flex flex-col items-center">
          {/* DEBUG: Show raw user object for troubleshooting */}
          <pre style={{color: 'lime', background: '#222', padding: 4, fontSize: 10, width: '100%', overflowX: 'auto'}}>
            {JSON.stringify(user, null, 2)}
          </pre>
          <div className="relative mb-3">
            {user.profile_picture ? (
              <img
                src={getProfileImageUrl(user.profile_picture)}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
                {getInitials(user.username || user.first_name || "U")}
              </div>
            )}
            {/* Profile Completion Ring */}
            <svg className="w-24 h-24 absolute -top-2 -left-2" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" stroke="#2d1a4d" strokeWidth="6" fill="none" />
              <circle 
                cx="50" 
                cy="50" 
                r="46" 
                stroke="#a855f7" 
                strokeWidth="6" 
                fill="none" 
                strokeDasharray={`${2 * Math.PI * 46}`} 
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - completionPercent/100)}`} 
                transform="rotate(-90, 50, 50)"
              />
              <text x="50" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                {completionPercent}%
              </text>
            </svg>
          </div>
          <h3 className="text-lg font-bold">{user.username}</h3>
          <p className="text-sm text-gray-400">{user.email}</p>
          <div className="flex items-center gap-2 text-gray-300 text-sm mt-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {/* Always use user.contact_number for contact */}
            {user.contact_number || "No contact number"}
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm mt-1">
            <CiLocationOn className="text-gray-400 text-lg" />
            {user.location || "No location specified"}
          </div>
        </div>
        {/* Stats */}
        {/* {console.log("Sidebar user object:", user)} */}
        <div className="space-y-3 mb-6">
          {user.is_freelancer && (
            <>
              {/* Debug: Print experience value at render time */}
              {/* {console.log("Sidebar user.experience:", user.experience)} */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Experience</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-white">
                  {user.experience === 'beginner' ? 'Beginner' : 
                   user.experience === 'intermediate' ? 'Intermediate' : 
                   user.experience === 'expert' ? 'Expert' : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg. Rating</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-yellow-300 flex items-center gap-1">
                  {user.avg_rating || 'N/A'} 
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ongoing Orders</span>
                {/* Ongoing Orders must always display user.inline_orders (from backend), not a calculated value */}
                <span className="px-2 py-0.5 rounded bg-gray-800 text-blue-200 font-semibold min-w-[60px] text-center">{user.inline_orders ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completed Orders</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-green-200 font-semibold min-w-[60px] text-center">{user.completed_orders ?? 0}</span>
              </div>
            </>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Languages</span>
            <span className="px-2 py-0.5 rounded bg-gray-800 text-purple-300 relative group cursor-default">
              {getLanguageDisplay()}
              {/* Language hover popup */}
              {Array.isArray(user.lang_spoken) && user.lang_spoken.length > 1 && (
                <div className="absolute z-10 bottom-full right-0 mb-2 w-48 bg-gray-800 rounded-md shadow-lg p-3 invisible group-hover:visible transition-all duration-200 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-1">
                  <h4 className="text-xs font-semibold text-gray-300 border-b border-gray-700 pb-1 mb-2">All Languages:</h4>
                  <div className="space-y-1">
                    {user.lang_spoken.map((code, idx) => (
                      <div key={idx} className="text-xs text-purple-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                        <span>{LANGUAGE_CODE_TO_NAME[code] || code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </span>
          </div>
          
          {/* Edit Profile Button in sidebar */}
          <Link 
            href={`/profile/${user.id}/edit`}
            className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm flex items-center justify-center gap-2"
          >
            <FaRegEdit /> Edit Profile
          </Link>

          {/* Create Gig Button for freelancers */}
          {user.is_freelancer && (
            <Link 
              href="/gigs/create"
              className="w-full mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Gig
            </Link>
          )}
        </div>

        {/* Navigation */}
        <ul className="space-y-4 text-lg">
          <li
            onClick={() => setActiveTab("info")}
            className={`cursor-pointer ${
              activeTab === "info" ? "text-purple-400" : ""
            }`}
          >
            Personal Info
          </li>
          {user.is_freelancer && (
            <li
              onClick={() => setActiveTab("gigs")}
              className={`cursor-pointer ${
                activeTab === "gigs" ? "text-purple-400" : ""
              }`}
            >
              My Gigs
            </li>
          )}
          {!user.is_freelancer && (
          <li
            onClick={() => setActiveTab("projects")}
            className={`cursor-pointer ${
              activeTab === "projects" ? "text-purple-400" : ""
            }`}
          >
            My Projects
          </li>
          )}
          <li
            onClick={() => setActiveTab("orders")}
            className={`cursor-pointer ${
              activeTab === "orders" ? "text-purple-400" : ""
            }`}
          >
            My Orders
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-10">
        {/* Personal Info */}
        {activeTab === "info" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Profile Information</h2>
              <Link 
                href={`/profile/${user.id}/edit`}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white flex items-center gap-2"
              >
                <FaRegEdit /> Edit Profile
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Username</p>
                    <p>{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p>{user.email}</p>
                  </div>
              <div>
                    <p className="text-sm text-gray-400">Contact Number</p>
                    <p>{user.contact_number || "Not specified"}</p>
              </div>
              <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p>{user.location || "Not specified"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {user.bio || "No bio provided."}
                </p>
              </div>

              {/* Freelancer-specific sections */}
              {user.is_freelancer && (
                <>
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Skills</h3>
                    {user.skills && user.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill) => (
                          <span 
                            key={skill.id} 
                            className="px-3 py-1 bg-purple-900 rounded-full text-sm"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No skills added yet.</p>
                    )}
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Categories</h3>
                    {user.category_tags && user.category_tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.category_tags.map((category) => (
                          <span 
                            key={category.id} 
                            className="px-3 py-1 bg-indigo-900 rounded-full text-sm"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No categories added yet.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Gigs tab - for freelancers */}
        {activeTab === "gigs" && user.is_freelancer && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Gigs</h2>
              <Link 
                href="/gigs/create"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                >
                + Create New Gig
              </Link>
            </div>

            {myGigs.length === 0 ? (
              <div className="text-center py-10 bg-gray-800 rounded-lg">
                <p className="text-gray-400 mb-4">You haven't created any gigs yet.</p>
                <Link 
                  href="/gigs/create"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                >
                  Create Your First Gig
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myGigs.map((gig) => (
                  <div key={gig.id} className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      {gig.picture ? (
                        <img 
                          src={getProfileImageUrl(gig.picture)} 
                          alt={gig.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-2 text-purple-300">{gig.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{gig.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 font-bold">₹{gig.price}</span>
                        <div className="flex gap-2">
                          <Link 
                            href={`/gigDetails/${gig.id}`}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                          >
                            View
                          </Link>
                          <Link 
                            href={`/gigs/edit/${gig.id}`}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Projects - for clients */}
        {activeTab === "projects" && !user.is_freelancer && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Projects</h2>
              <Link 
                href="/projects/create"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
              >
                + Post New Project
              </Link>
            </div>

            <div className="text-center py-10 bg-gray-800 rounded-lg">
              <p className="text-gray-400 mb-4">Projects section is under development.</p>
              <Link 
                href="/projects"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
              >
                Browse Projects
              </Link>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            {/* DEBUG: Show raw orders object for troubleshooting */}
            <pre style={{color: 'yellow', background: '#222', padding: 4, fontSize: 10, width: '100%', overflowX: 'auto'}}>
              {JSON.stringify(orders, null, 2)}
            </pre>

            {/* Status/Type filter logic (defensive, always lowercase) */}
            {/* Example: statusOptions = ['all', 'pending', 'ongoing', 'completed'] */}
            {/* Assume you have a state: selectedStatus, default 'all' */}
            {/* If not, just show all three sections as before */}

            {/* Pending Orders */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Pending Orders</h3>
              {orders.pending && orders.pending.length === 0 ? (
                <p className="text-gray-400 py-4">No pending orders.</p>
              ) : (
                <div className="space-y-4">
                  {orders.pending && orders.pending.map((order, idx) => (
                    <div key={order.id || idx} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-purple-300">
                            {order.type === 'gig' ? order.gig_title : order.project_title}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {user.is_freelancer ? `Client: ${order.buyer_name}` : `Provider: ${order.freelancer_name}`}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-900 text-yellow-300 rounded-full text-sm">
                          Pending
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ongoing Orders */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Ongoing Orders</h3>
              {orders.ongoing && orders.ongoing.length === 0 ? (
                <p className="text-gray-400 py-4">No ongoing orders.</p>
              ) : (
                <div className="space-y-4">
                  {orders.ongoing && orders.ongoing.map((order, idx) => (
                    <div key={order.id || idx} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-purple-300">
                            {order.type === 'gig' ? order.gig_title : order.project_title}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {user.is_freelancer ? `Client: ${order.buyer_name}` : `Provider: ${order.freelancer_name}`}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm">
                          Ongoing
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Orders */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-400">Completed Orders</h3>
              {orders.completed && orders.completed.length === 0 ? (
                <p className="text-gray-400 py-4">No completed orders.</p>
              ) : (
                <div className="space-y-4">
                  {orders.completed && orders.completed.map((order, idx) => (
                    <div key={order.id || idx} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-purple-300">
                            {order.type === 'gig' ? order.gig_title : order.project_title}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {user.is_freelancer ? `Client: ${order.buyer_name}` : `Provider: ${order.freelancer_name}`}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
