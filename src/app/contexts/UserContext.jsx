"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/utils/auth";
import { useRouter } from "next/navigation";

const UserContext = createContext();

function isProfileIncomplete(user) {
  if (!user) return true;

  // More comprehensive profile completeness check
  const requiredFields = [
    "profile_picture",
    "bio",
    "location",
    "contact_number",
  ];

  // Check if any required field is missing or empty
  for (const field of requiredFields) {
    if (!user[field]) return true;
  }

  // If user is a freelancer, check additional required fields
  if (user.is_freelancer) {
    if (!user.skills || user.skills.length === 0) return true;
    if (!user.experience) return true;
  }

  return false;
}

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const router = useRouter();

  let userMin;

  // Initialize user from localStorage and validate token
  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);

      // Get user from localStorage
      const user = authService.getCurrentUser();
      const token = authService.getToken();

      if (token) {
        // Validate token with backend
        try {
          const isValid = await authService.validateToken();
          if (!isValid) {
            // Token invalid, clear user data
            setCurrentUser(null);
            setLoading(false);
            return;
          }

          // If token is valid but we don't have user data, fetch it
          if (!user && token) {
            try {
              const userData = await authService.fetchUserData(token);
              if (userData) {
                authService.updateUserData(userData);
                setCurrentUser(userData);
              }
            } catch (err) {
              console.error("Error fetching user data:", err);
            }
          } else {
            setCurrentUser(user);
          }
        } catch (err) {
          console.error("Error validating token:", err);
          setCurrentUser(user); // Still set user from localStorage as fallback
        }
      } else {
        setCurrentUser(null);
      }

      setLoading(false);

      // Only show modal if just signed in and profile is incomplete
      if (
        user &&
        token &&
        isProfileIncomplete(user) &&
        sessionStorage.getItem("showProfileModal") === "1"
      ) {
        setShowProfileModal(true);
        sessionStorage.removeItem("showProfileModal");
      }
    };

    initializeUser();

    // Set up periodic token validation (every 15 minutes)
    const tokenCheckInterval = setInterval(async () => {
      if (authService.getToken()) {
        try {
          const isValid = await authService.validateToken();
          if (!isValid && currentUser) {
            setCurrentUser(null);
          }
        } catch (err) {
          console.error("Error during periodic token validation:", err);
        }
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(tokenCheckInterval);
  }, []);

  useEffect(() => {
    if (currentUser) {
      console.log("Current user changed:", currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("userMin");
      userMin = userString ? JSON.parse(userString) : null;
    }
  }, [currentUser]);

  const loginUser = async (userData) => {
    setCurrentUser(userData);
    authService.updateUserData(userData);

    // Set flag to show modal after sign-in if profile is incomplete
    if (isProfileIncomplete(userData)) {
      sessionStorage.setItem("showProfileModal", "1");
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    authService.logout();
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
    authService.updateUserData(userData);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        loading,
        loginUser,
        logoutUser,
        updateUser,
        isAuthenticated: !!currentUser && authService.isAuthenticated(),
        isProfileIncomplete: currentUser
          ? isProfileIncomplete(currentUser)
          : true,
      }}
    >
      {/* Blur and overlay when modal is open */}
      <div className={showProfileModal ? "relative" : ""}>
        {showProfileModal && currentUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/20 animate-fadeIn">
            <div className="relative max-w-md w-full p-0">
              <div className="bg-gray-900 rounded-2xl shadow-lg px-8 py-10 flex flex-col items-center animate-popIn">
                {/* Icon */}
                <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[#A020F0]/20 shadow-lg">
                  <svg
                    className="w-10 h-10 text-[#A020F0]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-2 text-center drop-shadow-lg">
                  Complete Your Profile
                </h2>
                <p className="text-lg text-purple-400 mb-8 text-center">
                  To unlock all features and get the best experience, please
                  complete your profile.
                </p>
                <div className="flex flex-col gap-4 w-full items-center">
                  <button
                    className="w-full py-3 rounded-full bg-[#A020F0] text-white font-bold text-lg shadow-lg hover:bg-purple-700 transition"
                    onClick={() => {
                      setShowProfileModal(false);
                      router.push(
                        userMin?.is_freelancer
                          ? `/profile/${currentUser.id}/edit`
                          : `/client-profile/${userMin.id}/`
                      );
                    }}
                  >
                    Complete Profile
                  </button>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="w-full py-3 rounded-full bg-white/10 text-purple-400 font-semibold text-lg hover:bg-white/20 transition border border-purple-400/30 shadow"
                  >
                    Remind Me Later
                  </button>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-4 right-4 text-white text-3xl hover:text-[#A020F0] transition-colors focus:outline-none"
                >
                  &times;
                </button>
              </div>
            </div>
            <style jsx global>{`
              .animate-popIn {
                animation: popIn 0.45s cubic-bezier(0.4, 0, 0.2, 1) both;
              }
              @keyframes popIn {
                0% {
                  opacity: 0;
                  transform: scale(0.95);
                }
                80% {
                  opacity: 1;
                  transform: scale(1.03);
                }
                100% {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
          </div>
        )}
        <div
          className={
            showProfileModal ? "pointer-events-none select-none blur-sm" : ""
          }
        >
          {children}
        </div>
      </div>
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
