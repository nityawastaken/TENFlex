"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpForm() {
  const [userType, setUserType] = useState("freelancer");
  const router = useRouter();

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    alert("Sign-up successful!");
    router.push("/signin");
  };

  return (
    <div className="bg-gray-950 text-white font-sans min-h-screen flex flex-col items-center py-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Create an Account</h2>
      <form onSubmit={handleSignUpSubmit} className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl">
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
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-purple-400 hover:underline bg-transparent border-0"
          >
            <Link href="/signin">Already have an account? Sign In</Link>
          </button>
        </div>
      </form>
    </div>
  );
}