"use client";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    profileImage: "",
  });
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setForm({
        name: parsed.name || "",
        phone: parsed.phone || "",
        bio: parsed.bio || "",
        profileImage: parsed.profileImage || "",
      });

      // Fetch user's projects from backend using email
      fetch("/api/projects/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.email }),
      })
        .then((res) => res.json())
        .then((data) => setMyProjects(data.projects || []))
        .catch((err) => {
          console.error("Failed to fetch projects", err);
          toast.error("Error fetching projects");
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;

      const res = await fetch("/api/user/uploadImage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, imageData: base64 }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setForm((prev) => ({ ...prev, profileImage: data.user.profileImage }));
        toast.success("Image uploaded!");
      } else {
        toast.error(data.message || "Upload failed");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/user/updateInfo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, ...form }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Profile updated!");
    } else {
      toast.error(data.message || "Update failed");
    }
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (!user) {
    return (
      <p className="text-center mt-20 text-white animate-pulse">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white mt-20 flex">
      <ToastContainer position="bottom-right" />

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6">
        <h2 className="text-xl font-bold mb-6">My Account</h2>
        <ul className="space-y-4 text-lg">
          <li
            onClick={() => setActiveTab("info")}
            className={`cursor-pointer ${
              activeTab === "info" ? "text-purple-400" : ""
            }`}
          >
            Personal Info
          </li>
          <li
            onClick={() => setActiveTab("projects")}
            className={`cursor-pointer ${
              activeTab === "projects" ? "text-purple-400" : ""
            }`}
          >
            My Projects
          </li>
          <li
            onClick={() => setActiveTab("orders")}
            className={`cursor-pointer ${
              activeTab === "orders" ? "text-purple-400" : ""
            }`}
          >
            My Orders
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-10">
        {/* Personal Info */}
        {activeTab === "info" && (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center mb-6">
              {form.profileImage ? (
                <img
                  src={form.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-purple-500 mb-2"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold mb-2">
                  {getInitials(form.name || user.name)}
                </div>
              )}
              <label className="cursor-pointer text-sm text-purple-400 hover:underline">
                Change Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  About You
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded transition"
              >
                Update Profile
              </button>
            </div>
          </form>
        )}

        {/* Projects */}
        {activeTab === "projects" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Projects</h2>

            {myProjects.length === 0 ? (
              <p className="text-gray-400">You haven’t posted any projects yet.</p>
            ) : (
              myProjects.map((proj, i) => (
                <div
                  key={i}
                  className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-900"
                >
                  <h3 className="text-lg font-semibold mb-1 text-purple-400">
                    {proj.title}
                  </h3>
                  <p className="text-gray-300 mb-2">{proj.description}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Budget: ₹{proj.budget} | Deadline: {proj.deadline}
                  </p>

                  {/* Bids */}
                  <h4 className="font-semibold mt-4 text-white">Bids:</h4>
                  {proj.bids.length === 0 ? (
                    <p className="text-gray-500 text-sm">No bids yet.</p>
                  ) : (
                    <ul className="space-y-2 mt-2">
                      {proj.bids.map((bid, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-200 bg-gray-800 rounded px-3 py-2"
                        >
                          <p>
                            <span className="text-purple-400">By:</span>{" "}
                            {bid.freelancer || bid.name}
                          </p>
                          <p>
                            <span className="text-purple-400">Amount:</span> ₹
                            {bid.amount}
                          </p>
                          <p>
                            <span className="text-purple-400">Message:</span>{" "}
                            {bid.message || "No message"}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Orders placeholder */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-bold mb-4">My Orders</h2>
            <p className="text-gray-400">[Order list placeholder]</p>
          </div>
        )}
      </main>
    </div>
  );
}
