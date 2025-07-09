"use client";
import useScreenWidth from "@/Hooks/useScreenWidth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

const steps = [
  { label: "Full Name", completed: false },
  { label: "Profile picture", completed: false },
  { label: "Bio", completed: false },
  { label: "Skills", completed: false },
  { label: "Experience", completed: false },
];

const Popup = ({setShowPopup,handlePopup, isFreelancer}) => {
  const width = useScreenWidth();
  const [show, setShow] = useState(true);
  const [showAnim, setShowAnim] = useState(false);
  // const router = useRouter();

  const ANIMATION_DURATION = 250; // ms

  // Open popup with animation
  const openPopup = () => {
    setShow(true);
    setTimeout(() => setShowAnim(true), 10);
  };

  // Close popup with animation
  const closePopup = () => {
    setShowAnim(false);
    setTimeout(() => setShow(false), ANIMATION_DURATION);
  };
  const handleclose = () => {
    setShowPopup(false);
    handlePopup();
    closePopup();
  };

  React.useEffect(() => {
    if (show) setTimeout(() => setShowAnim(true), 10);
  }, [show]);

  return (
    <div
      className={`flex min-h-screen backdrop-blur-lg justify-center items-center ${
        width <= 1024 ? `mt-26` : `mt-10`
      }`}
    >
      {/* <button className="bg-blue-400 rounded-xl p-5" onClick={openPopup}>show</button> */}
      {show && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300 ${
            showAnim ? "opacity-100" : "opacity-0"
          }`}
          onClick={closePopup}
        >
          {/* Prevent click from closing when clicking inside the card */}
          <div
            className={`w-full max-w-xl bg-gray-300 shadow-2xl rounded-2xl p-10 transform transition-all duration-300
                        ${
                          showAnim
                            ? "scale-100 opacity-100"
                            : "scale-90 opacity-0"
                        }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-center font-bold text-4xl text-[#A020F0] mb-2">
              Welcome! Let's Complete Your Profile
            </h2>
            <p className="text-center mt-2 text-gray-600 text-lg">
              Thanks for joining us! To give you the best experience, let's take a
              minute to complete your profile. This helps us personalize your
              dashboard, content, and notifications.
            </p>

            <div className="mt-10">
              <ul className="space-y-4">
                {steps.map((step, idx) => (
                  <li key={step.label} className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full border-2 ${
                        step.completed
                          ? "bg-indigo-500 border-indigo-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {step.completed ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <span className="text-xl text-gray-800">{step.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 flex justify-between items-center">
              <Link href={'/'}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition font-medium shadow-sm"
                onClick={handleclose}
              >
                Do it later
              </Link>
              <Link href={isFreelancer? '/profile': '/client-profile'}  className="bg-[#A020F0] text-white px-8 py-2 rounded-lg hover:bg-[#7e4f9b] transition font-semibold shadow-lg">
                Proceed
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
