"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/contexts/UserContext"; // ✅ IMPORT CONTEXT

export default function SignInForm() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });

  const { loginUser } = useUserContext(); // ✅ USE CONTEXT FUNCTION

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

    try {
      const res = await fetch(`${API_URL}/api-token-auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);

        // ✅ Fetch user details
        const userRes = await fetch(
          `${API_URL}/base/get_user_by_username/${form.username}/`,
          {
            headers: {
              Authorization: `Token ${data.token}`,
            },
          }
        );

        const userData = await userRes.json();

        if (userRes.ok && userData.id) {
          const userToStore = {
            id: userData.id,
            username: userData.username,
            first_name: userData.first_name,
            profile_picture: userData.profile_picture,
            role: userData.is_freelancer ? "freelancer" : "customer",
          };

          // ✅ Use loginUser to update context + localStorage
          loginUser(userToStore);

          alert("Sign in successful!");
          router.push("/");
        } else {
          alert("Could not fetch user info");
        }
      } else {
        console.log("Error response:", data);
        alert(data.detail || JSON.stringify(data));
      }
    } catch (err) {
      console.error("Sign in error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (checking) return null;

  return (
    <div className="bg-gray-950 text-white font-sans min-h-screen flex flex-col items-center py-12 px-4 mt-20">
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
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition"
        >
          Sign In
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
