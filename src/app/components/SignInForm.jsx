"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/contexts/UserContext";
import { authService } from "@/utils/auth";
import { apiCall, endpoints } from "@/utils/api";
import { useDispatch } from "react-redux";
import { setReduxUser } from "@/utils/redux/slices/userSlice";
import axios from "axios";

export default function SignInForm() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { loginUser } = useUserContext();

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    } else {
      setChecking(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the auth service to login - this will handle fetching user data
      const response = await authService.login(form);
      
      if (response.token) {
        // The authService.login method already fetches and stores user data in localStorage
        // We just need to get it from localStorage and use it
        const userData = authService.getCurrentUser();
        
        if (userData) {
          // Use the user data that was already fetched and stored by authService.login
          const userToStore = {
            ...userData,
            token: response.token,
          };
          
          console.log("SignIn - User data loaded:", userToStore);
          console.log("SignIn - is_freelancer field:", userToStore.is_freelancer);
          
          loginUser(userToStore);
          authService.updateUserData(userToStore);
          alert("Sign in successful!");
          router.push("/");
        } else {
          alert("Sign in successful but failed to load user data. Please try again.");
        }
      } else {
        alert("Sign in failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <div className="text-white font-sans min-h-screen flex flex-col items-center py-12 px-4 mt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto mt-2"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Sign In
        </h2>
        <hr className="text-white/80 mb-10" />

        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-3 rounded-lg transition"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="mt-4 text-center">
          <span>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-purple-400 hover:underline transition-all duration-200"
            >
              Sign Up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
} 