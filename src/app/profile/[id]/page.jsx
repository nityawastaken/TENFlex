"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserContext } from "@/app/contexts/UserContext";
import { CiLocationOn } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { NavBtn } from "@/app/components/UserProfile/NavBtn";
import { SectionContainer } from "@/app/components/UserProfile/SectionContainer";
import { SectionParagraph } from "@/app/components/UserProfile/SectionParagraph";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const { currentUser, loading } = useUserContext();
  const [selectedSection, setSelectedSection] = useState("home");
  const selectedOption = useRef();
  const [selectedOrderFilter, setSelectedOrderFilter] = useState("ongoing");

  const params = useParams();
  const router = useRouter();
  const userIdFromURL = parseInt(params?.id);

useEffect(() => {
  if (!loading && typeof currentUser?.id === "number" && !isNaN(userIdFromURL)) {
    if (currentUser.id !== userIdFromURL) {
      router.replace("/404");
    }
  }
}, [loading, currentUser, userIdFromURL, router]);


  const handleSelectOrderFilter = () => {
    setSelectedOrderFilter(selectedOption.current.value);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/base/users/${currentUser.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete account");

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      toast.success("Account deleted successfully");
      router.push("/signin");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Could not delete account. Try again.");
    }
  };

  if (loading || !currentUser) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading profile...
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-white bg-black">
      <ToastContainer position="bottom-right" />
      <div className="w-full flex flex-col lg:flex-row min-h-screen pt-[80px]">
        {/* Sidebar */}
        <nav className="hidden lg:flex flex-col py-8 px-8 gap-4 bg-neutral-950 min-w-[300px] min-h-full">
          <h2 className="text-lg">
            <span className="text-purple-600">My</span> Account
          </h2>
          <ul className="flex flex-col gap-2">
            {["home", "about", "languages", "services", "orders", "reviews"].map((section) => (
              <NavBtn
                key={section}
                section={section}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
              />
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="w-full flex justify-center items-center">
          <div className="p-4 md:p-8 flex flex-col justify-center items-center gap-4 md:flex-grow md:justify-start lg:py-12 lg:gap-8 lg:max-w-[1400px]">

            {/* Header */}
            <div className="flex flex-col items-center gap-2 md:flex-row md:gap-8 w-full">
              <div
                className="w-32 h-32 bg-cover bg-center rounded-full shadow-md"
                style={{
                  backgroundImage: `url(${
                    currentUser?.profile_picture || "/placeholder.jpg"
                  })`,
                }}
              ></div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-wide">
                  {currentUser?.name}
                </h2>
                <h3 className="flex items-center gap-1 text-lg md:text-xl">
                  <CiLocationOn />
                  <span className="text-base md:text-lg">
                    {currentUser?.location}
                  </span>
                </h3>
              </div>
              <Link
                href={`/profile/${currentUser?.id}/edit`}
                className="flex flex-row justify-center items-center gap-2 border border-gray-400 px-4 py-2 rounded-md text-base md:text-lg cursor-pointer hover:bg-indigo-300 transition-all duration-200 ml-auto"
              >
                <GoPencil />
                Edit Profile
              </Link>
            </div>

            {/* About */}
            <SectionContainer title={"about"}>
              <SectionParagraph text={currentUser?.about || "No bio yet."} />
            </SectionContainer>

            {/* Languages */}
            <SectionContainer title={"languages"}>
              <ul className="flex flex-col gap-1">
                {currentUser?.languages?.map((lang, i) => (
                  <li key={i} className="text-base text-indigo-100">
                    {lang.name} - {lang.proficiency}
                  </li>
                ))}
              </ul>
            </SectionContainer>

            {/* Services */}
            <SectionContainer title={"services"}>
              <ul className="grid flex-col gap-6 md:grid-cols-2 md:gap-8 md:auto-rows-fr lg:grid-cols-3">
                {currentUser?.services?.map((service, key) => (
                  <li key={key} className="flex flex-col gap-1">
                    <img className="rounded-md" src={service.cover_img} />
                    <h4 className="text-indigo-100 text-sm md:text-base">
                      {service.title}
                    </h4>
                    <p className="text-indigo-600 font-bold md:text-lg">
                      From ${service.min_price}
                    </p>
                  </li>
                ))}
              </ul>
            </SectionContainer>

            {/* Orders */}
            <SectionContainer title={"orders"}>
              <select onChange={handleSelectOrderFilter} ref={selectedOption}>
                <option className="text-black" value="ongoing">Ongoing</option>
                <option className="text-black" value="pending">Pending</option>
                <option className="text-black" value="completed">Completed</option>
              </select>

              <ul className="flex flex-col gap-4">
                {currentUser?.orders
                  ?.filter(
                    (order) =>
                      order.status.toLowerCase() ===
                      selectedOrderFilter.toLowerCase()
                  )
                  .map((order, key) => (
                    <li key={key} className="border-y py-4">
                      <a href="#" target="_blank" className="text-sm">
                        Order:{" "}
                        {currentUser?.services?.find(
                          (s) => s.id === order.service_id
                        )?.title || "Service not found"}
                      </a>
                      <p className="text-sm text-purple-500">
                        Status: {order.status}
                      </p>
                    </li>
                  ))}
              </ul>
            </SectionContainer>

            {/* Reviews */}
            <SectionContainer title={"reviews"}>
              <ul className="space-y-4">
                {currentUser?.reviews?.map((review, i) => (
                  <li key={i}>
                    <p className="text-indigo-200">{review.text}</p>
                  </li>
                ))}
              </ul>
            </SectionContainer>

            {/* Delete */}
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-base self-end px-4 py-2 rounded-md hover:bg-red-500"
            >
              Delete Account
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
