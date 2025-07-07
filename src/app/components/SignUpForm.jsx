"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/utils/auth";
import ErrorAlert from "./ErrorAlert";

export default function SignUpForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    userType: "freelancer",
  });

  const [errors, setErrors] = useState({});
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const [isError, setIsError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
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

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/;
    return regex.test(value);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email address.";
    if (!form.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (!validatePassword(form.password)) {
      newErrors.password =
        "Password must include at least 1 lowercase, 1 uppercase, and 1 special character.";
    }
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!form.location.trim()) newErrors.location = "Location is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getStrength = (password) => {
    let strength = 0;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    if (password.length >= 6) strength += 1;

    if (strength <= 1) {
      return {
        label: "Weak",
        percent: 25,
        color: "bg-red-500",
        textColor: "text-red-400",
      };
    } else if (strength === 2 || strength === 3) {
      return {
        label: "Medium",
        percent: 60,
        color: "bg-yellow-500",
        textColor: "text-yellow-400",
      };
    } else {
      return {
        label: "Strong",
        percent: 100,
        color: "bg-green-500",
        textColor: "text-green-400",
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      // Use the auth service to signup
      const response = await authService.signup({
        username: form.name,
        email: form.email,
        password: form.password,
        location: form.location,
        is_freelancer: form.userType === "freelancer",
      });

      // alert("Sign-up successful!");
      router.push("/signin");
    } catch (err) {
      console.error("Signup error:", err);
      // alert(err.message || "Something went wrong. Try again.");
      setError(err.message || "Something went wrong. Try again.");
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
    <div className="bg-gray-950 text-white font-sans min-h-screen flex flex-col items-center py-12 px-4 mt-20">
      {isError && <ErrorAlert error={error} />}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Create an Account
        </h2>
        <hr className="text-white/80 mb-10" />

        {/* Full Name */}
        <label className="block mb-2 text-sm">Full Name</label>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className={`w-full p-3 mb-2 rounded-lg bg-gray-800 text-white focus:outline-none ${
            errors.name ? "border border-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-4">{errors.name}</p>
        )}

        {/* Email */}
        <label className="block mb-2 text-sm">Email Address</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={`w-full p-3 mb-2 rounded-lg bg-gray-800 text-white focus:outline-none ${
            errors.email ? "border border-red-500" : ""
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-4">{errors.email}</p>
        )}

        {/* Password */}
        <label className="block mb-2 text-sm">Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className={`w-full p-3 mb-2 rounded-lg bg-gray-800 text-white focus:outline-none ${
            errors.password ? "border border-red-500" : ""
          }`}
        />

        {/* Strength Meter */}
        {form.password && (
          <div className="mb-2">
            <div className="h-2 w-full rounded bg-gray-700 overflow-hidden mb-1">
              <div
                className={`h-full transition-all duration-300 ${
                  getStrength(form.password).color
                }`}
                style={{ width: `${getStrength(form.password).percent}%` }}
              />
            </div>
            <p className={`text-sm ${getStrength(form.password).textColor}`}>
              {getStrength(form.password).label}
            </p>
          </div>
        )}
        {errors.password && (
          <p className="text-red-500 text-sm mb-4">{errors.password}</p>
        )}

        {/* Confirm Password */}
        <label className="block mb-2 text-sm">Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          className={`w-full p-3 mb-2 rounded-lg bg-gray-800 text-white focus:outline-none ${
            errors.confirmPassword ? "border border-red-500" : ""
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-4">{errors.confirmPassword}</p>
        )}

        {/* Location */}
        <label className="block mb-2 text-sm">Location</label>
        <input
          name="location"
          type="text"
          value={form.location}
          onChange={handleChange}
          className={`w-full p-3 mb-2 rounded-lg bg-gray-800 text-white focus:outline-none ${
            errors.location ? "border border-red-500" : ""
          }`}
        />
        {errors.location && (
          <p className="text-red-500 text-sm mb-4">{errors.location}</p>
        )}

        {/* User Type */}
        <label className="block mb-2 text-sm">I want to</label>
        <div className="flex gap-4 mb-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="userType"
              value="freelancer"
              checked={form.userType === "freelancer"}
              onChange={handleChange}
              className="mr-2"
            />
            <span>Offer Services</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="userType"
              value="client"
              checked={form.userType === "client"}
              onChange={handleChange}
              className="mr-2"
            />
            <span>Hire Services</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-3 rounded-lg transition mb-4"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="text-center">
          <span>
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-purple-400 hover:underline transition-all duration-200"
            >
              Sign In
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
