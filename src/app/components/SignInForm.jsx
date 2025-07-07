"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/contexts/UserContext";
import { authService } from "@/utils/auth";
import { apiCall, endpoints } from "@/utils/api";
import ErrorAlert from "./ErrorAlert";
import Popup from "./PopupModal";
import axios from "axios";

export default function SignInForm() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const { loginUser } = useUserContext();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    } else {
      setChecking(false);
    }
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false);
        setError("");
      }, 5000);
      return () => clearTimeout(timer); // Clean up
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api-token-auth/`,
        form
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);

        const userData = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/base/get_user_by_username/${form.username}`
        );

        if (userData?.data.id) {
          const userToStore = {
            id: userData.id,
            username: userData.username,
            first_name: userData.first_name,
            profile_picture: userData.profile_picture,
            role: userData.is_freelancer ? "freelancer" : "customer",
          };

          loginUser(userToStore);
          // authService.updateUserData(userToStore);

          handlePopup();
        } else {
          // alert("Could not fetch user info");
          setError("Could not fetch user info");
          setIsError(true);
        }
      } else {
        // alert("Login failed. Please check your credentials.");
        setError("Sign in failed. Please try again.");
        setIsError(true);
      }
    } catch (err) {
      console.error("Sign in error:", err);
      // alert(err.message || "Something went wrong. Please try again.");
      setError("Sign in error:", err);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };
  if (isError) {
    setTimeout(() => {
      setIsError(false);
      setError("");
    }, 3000);
  }

  if (checking) return null;

  return (
    <>
      {showPopup ? (
        <div className=" w-full">
          <Popup setShowPopup={setShowPopup} handlePopup={handlePopup} />
        </div>
      ) : (
        <div className="bg-gray-950 text-white font-sans min-h-screen flex flex-col items-center py-12 px-4">
          {isError && <ErrorAlert error={error} />}
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto mt-35"
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
      )}
    </>
  );
}
