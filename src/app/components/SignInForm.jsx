"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Sign in successful!");
    router.push("/"); // Home page par redirect
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto mt-35">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Sign In</h2>
      <input type="email" placeholder="Email" required className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white" />
      <input type="password" placeholder="Password" required className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white" />
      <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition">Sign In</button>
      <div className="mt-4 text-center">
        <Link href="/signup" className="text-purple-400 hover:underline">Don't have an account? Sign Up</Link>
      </div>
    </form>
  );
}