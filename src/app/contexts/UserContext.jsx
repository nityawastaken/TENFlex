"use client";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user using userId from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setLoading(false);
      return;
    }

    async function fetchCurrentUser() {
      try {
        const res = await fetch(`${API_URL}/base/users/${userId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) throw new Error("User not found");

        const data = await res.json();
        setCurrentUser(data)
      } catch (err) {
        console.error("Error fetching current user:", err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
