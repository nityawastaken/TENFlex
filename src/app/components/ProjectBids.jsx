"use client";
import useFetchUserByUsername from "@/Hooks/useFetchUserByUsername";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { CLOUDINARY_URL } from "@/utils/constants";

const ProjectBids = ({ selectedProject, bid, index, handleAcceptBid }) => {
  const [userProfilePic, setUserProfilePic] = useState("");
  const router = useRouter();

  // onClick got to profile page
  const fetchUser = useFetchUserByUsername();

  const Details = async () => {
    const getDetails = await fetchUser(bid.freelancer_name);
    setUserProfilePic(getDetails.profile_picture);
  };
  Details();

  const handleOpenProfile = async (userName) => {
    const userProfile = await fetchUser(userName);
    if (userProfile) {
      const { id, is_freelancer } = userProfile;
      const path = is_freelancer ? `/profile/${id}/` : `/client-profile/${id}/`;
      router.push(path);
    } else {
      // Show error to user, or handle accordingly
      console.log("User not found");
    }
  };
  return (
    <div
      className={`border rounded-lg p-4 bid-item animate-slideIn ${
        bid.is_accepted
          ? "bg-[#241b46] border-green-300"
          : "bg-[#241b46] border-gray-700"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex justify-around gap-2 items-start ">
        {/* you can place the avatar of the bidder */}
        <div className="flex items-center  h-20">
          <img
            alt="user-avatar"
            src={
              userProfilePic
                ? userProfilePic.startsWith("http")
                  ? userProfilePic
                  : CLOUDINARY_URL + userProfilePic
                : "https://www.mauicardiovascularsymposium.com/wp-content/uploads/2019/08/dummy-profile-pic-300x300.png"
            }
            className=" rounded-full w-14 h-14  object-cover border border-purple-500 shadow-lg hover:scale-105 ease-in-out duration-200 cursor-pointer hover:shadow-2xl"
            onClick={() =>
                handleOpenProfile(bid.freelancer_name || bid.freelancer)
              }
          />
        </div>
        <div className="flex-1 ">
          <div className="font-semibold text-purple-200">₹{bid.bid_amount}</div>
          <div className="text-sm text-purple-200  mt-1">
            Freelancer:{" "}
            <span
              onClick={() =>
                handleOpenProfile(bid.freelancer_name || bid.freelancer)
              }
              className="cursor-pointer font-semibold hover:underline hover:scale-110 hover:text-purple-400 duration-300"
            >
              {bid.freelancer_name || bid.freelancer}
            </span>
          </div>
          {bid.message && (
            <div className="text-sm text-purple-200 mt-1">"{bid.message}"</div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-purple-200">
            {bid.created_at ? new Date(bid.created_at).toLocaleString() : ""}
          </div>
          {selectedProject.is_open && !bid.is_accepted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAcceptBid(bid.id);
              }}
              className="px-4 py-1 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 transition-all duration-200 hover:scale-105 transform cursor-pointer"
            >
              Accept
            </button>
          )}
          {bid.is_accepted && (
            <div className="flex items-center text-green-500 font-semibold">
              <CheckCircle size={16} className="mr-1 text-xl" />
              <span className="text-sm font-semibold">Accepted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectBids;
