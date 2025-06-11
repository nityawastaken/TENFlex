"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [showSignIn, setShowSignIn] = useState(true);
  const [userType, setUserType] = useState("freelancer");
  const [tab, setTab] = useState("freelancer");

  // Handlers
  const handleSignInSubmit = (e) => {
    e.preventDefault();

    alert("Sign in successful!");
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    alert("Sign-up successful!");
    setShowSignIn(true);
  };

  return (
    <div className="bg-gray-950 text-white font-sans min-h-screen flex flex-col items-center py-12 px-4">
      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-10">
        <button
          className={`px-6 py-2 rounded-lg ${showSignIn ? "bg-purple-600" : "bg-gray-700"}`}
          onClick={() => setShowSignIn(true)}
        >
          Sign In
        </button>
        <button
          className={`px-6 py-2 rounded-lg ${!showSignIn ? "bg-purple-600" : "bg-gray-700"}`}
          onClick={() => setShowSignIn(false)}
        >
          Sign Up
        </button>
      </div>

      {/* Sign In Section */}
      {showSignIn && (
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>
          <div className="flex justify-between bg-gray-800 p-1 rounded-lg mb-6">
            <button
              className={`w-1/2 py-2 text-center rounded-lg ${tab === "freelancer" ? "bg-purple-600" : ""}`}
              onClick={() => setTab("freelancer")}
            >
              Freelancer
            </button>
            <button
              className={`w-1/2 py-2 text-center rounded-lg ${tab === "client" ? "bg-purple-600" : ""}`}
              onClick={() => setTab("client")}
            >
              Client
            </button>
          </div>
          <form onSubmit={handleSignInSubmit}>
            <label className="block mb-2 text-sm">Email Address</label>
            <input
              type="email"
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="you@example.com"
              required
            />
            <label className="block mb-2 text-sm">Password</label>
            <input
              type="password"
              className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="••••••••"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Sign In
            </button>
            <div className="my-6 text-center text-gray-400">— or sign in with —</div>
            <div className="flex gap-4">
              <button
                type="button"
                className="flex-1 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Google
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sign Up Section */}
      {!showSignIn && (
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Create an Account</h2>
          <form onSubmit={handleSignUpSubmit}>
            <label className="block mb-2 text-sm">Full Name</label>
            <input
              type="text"
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none"
              required
            />
            <label className="block mb-2 text-sm">Email Address</label>
            <input
              type="email"
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none"
              required
            />
            <label className="block mb-2 text-sm">Password</label>
            <input
              type="password"
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none"
              required
            />
            <label className="block mb-2 text-sm">Location</label>
            <input
              type="text"
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none"
              required
            />
            <label className="block mb-2 text-sm">Are you a Freelancer or Client?</label>
            <select
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
            {userType === "freelancer" && (
              <div>
                <label className="block mb-2 text-sm">Skills</label>
                <input
                  type="text"
                  className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none"
                  placeholder="e.g. Web Development"
                />
                <label className="block mb-2 text-sm">Qualification</label>
                <input
                  type="text"
                  className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none"
                  placeholder="e.g. B.Tech CSE"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      )}
      <div className="mt-4 text-center">
        <Link href="/signin" className="text-purple-400 hover:underline">
          Sign In / Sign Up
        </Link>
      </div>
    </div>
  );
}