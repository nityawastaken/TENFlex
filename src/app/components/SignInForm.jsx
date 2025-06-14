"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  // 🔒 Redirect if already logged in
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
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Sign in successful!");

      // Use native redirect instead of router for full reload
      window.location.href = "/";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Sign in error:", err);
    alert("Something went wrong. Please try again.");
  }
};
  if (checking) return null; // Prevent flash if already logged in

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
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
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
            Don't have an account?{" "}
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
