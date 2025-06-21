"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    userType: "freelancer",
  });

  const [errors, setErrors] = useState({});
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    } else {
      setChecking(false);
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

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          location: form.location,
          role: form.userType,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Sign-up successful!");
        router.push("/signin");
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  if (checking) return null;

  return (
    <div className="bg-gray-950 text-white font-sans min-h-screen flex flex-col items-center py-12 px-4 mt-20">
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
        {errors.name && <p className="text-red-500 text-sm mb-4">{errors.name}</p>}

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
        {errors.email && <p className="text-red-500 text-sm mb-4">{errors.email}</p>}

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
                className={`h-full transition-all duration-300 ${getStrength(form.password).color}`}
                style={{ width: `${getStrength(form.password).percent}%` }}
              />
            </div>
            <p className={`text-sm ${getStrength(form.password).textColor}`}>
              {getStrength(form.password).label}
            </p>
          </div>
        )}

        {/* Password Requirements */}
        <div className="text-sm text-gray-300 space-y-1 mb-4">
          <p className={/[a-z]/.test(form.password) ? "text-green-400" : "text-red-400"}>
            {/[a-z]/.test(form.password) ? "✓" : "✗"} Must include a lowercase letter
          </p>
          <p className={/[A-Z]/.test(form.password) ? "text-green-400" : "text-red-400"}>
            {/[A-Z]/.test(form.password) ? "✓" : "✗"} Must include an uppercase letter
          </p>
          <p className={/[^a-zA-Z0-9]/.test(form.password) ? "text-green-400" : "text-red-400"}>
            {/[^a-zA-Z0-9]/.test(form.password) ? "✓" : "✗"} Must include a special character
          </p>
          <p className={form.password.length >= 6 ? "text-green-400" : "text-red-400"}>
            {form.password.length >= 6 ? "✓" : "✗"} At least 6 characters
          </p>
        </div>

        {errors.password && <p className="text-red-500 text-sm mb-4">{errors.password}</p>}

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
        {errors.location && <p className="text-red-500 text-sm mb-4">{errors.location}</p>}

        {/* User Type */}
        <label className="block mb-2 text-sm">Are you a Freelancer or Client?</label>
        <select
          name="userType"
          value={form.userType}
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white focus:outline-none"
        >
          <option value="freelancer">Freelancer</option>
          <option value="customer">Client</option>
        </select>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Sign Up
        </button>

        <div className="mt-4 text-center">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-purple-400 hover:underline transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
