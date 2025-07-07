"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/utils/auth";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage
  useEffect(() => {
    const user = authService.getCurrentUser();
    const token = authService.getToken();

    if (!user || !token) {
      setLoading(false);
      return;
    }

    setCurrentUser(user);
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    setCurrentUser(userData);
    authService.updateUserData(userData);
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
    <UserContext.Provider value={{ 
      currentUser, 
      loading, 
      loginUser, 
      logoutUser, 
      updateUser,
      isAuthenticated: authService.isAuthenticated()
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
