import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useFetchUserByUsername from "@/Hooks/useFetchUserByUsername";

const ProjectCard = ({ p }) => {
  let isClosed = !p.is_open; // or check if p.accepted_bid exists
  let acceptedBid = null;
  const router = useRouter();

  if (p.accepted_bid && p.bids.length > 0) {
    acceptedBid = p.bids.find((bid) => bid.id === p.accepted_bid);
  }

  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [closed, setClosed] = useState(isClosed);

  const handleReopen = async () => {
    setLoading(true);
    try {
      // console.log("reopening...", p.id)
      await axios.post(
        process.env.NEXT_PUBLIC_API_URL + `/base/projects/${p.id}/reopen/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setClosed(false);
    } catch (error) {
      // handle error if needed
      console.log(error);
    }
    setLoading(false);
  };

  const fetchUser = useFetchUserByUsername();

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

  // console.log("project : ",p)

  return (
    <div
      key={p.id}
      className="bg-gradient-to-br from-[#24194a] via-[#1a0d2b] to-[#28163a] shadow-lg p-6 rounded-2xl w-full md:w-[340px] min-h-[320px] flex flex-col justify-between hover:scale-[1.03] hover:shadow-xl flex-shrink-0 border border-transparent hover:border- hover:shadow-purple-800/30 hover:-translate-y-1 transition-all duration-300 ease-out "
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3
            className="text-xl text-white font-bold truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px] sm:max-w-[220px] md:max-w-[300px]"
            title={p.title}
          >
            {p.title}
          </h3>
          <span
            className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              closed ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                closed ? "bg-red-500" : "bg-green-500"
              }`}
            ></span>
            {closed ? "Closed" : "Open"}
          </span>
        </div>
        <div className="mb-4">
          <h4 className="text-sm text-gray-300 mb-1">Description:</h4>
          <p className="text-gray-400 bg-[#24194a] rounded-lg p-2 text-sm h-[80px] overflow-auto">
            {p.description}
          </p>
        </div>
        <div className="mb-4">
          <h4 className="text-sm text-gray-300 mb-1">Budget:</h4>
          <p className="text-gray-400 bg-[#24194a] rounded-lg p-2 text-sm">
            {p.budget} ₹
          </p>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-xs text-gray-300">
            <span className="font-semibold">Started At:</span>{" "}
            <span className="bg-[#24194a] rounded px-2 py-1">
              {p.created_at
                ? new Date(p.created_at.replace(/\.\d+Z$/, "Z"))
                    .toISOString()
                    .split("T")[0]
                : ""}
            </span>
          </p>
          {closed && (
            <div className="flex justify-between items-center ">
              <div>
                <p className="text-xs text-gray-300 ">
                  <span className="font-semibold">Closed At:</span>{" "}
                  <span className="bg-[#24194a] rounded px-2 py-1">
                    {p.deadline || p.created_at
                      ? new Date(p.created_at.replace(/\.\d+Z$/, "Z"))
                          .toISOString()
                          .split("T")[0]
                      : ""}
                  </span>
                </p>
                <div className="mt-4 gap-2">
                  <p className="text-sm text-gray-300 ">
                    Accepted by:{" "}
                    <span
                      onClick={() =>
                        handleOpenProfile(acceptedBid?.freelancer_name)
                      }
                      className=" cursor-pointer underline hover:-translate-y-0.5 hover:text-purple-500 duration-300"
                    >
                      {acceptedBid?.freelancer_name}
                    </span>
                  </p>
                  <p className="text-xs text-gray-300 ">
                    Accepted At:{" "}
                    <span className="font-semibold">
                      ₹ {Math.floor(acceptedBid?.bid_amount)} 
                    </span>{" "}
                  </p>
                </div>
              </div>
              {/* <button
                className="ml-4 px-2 py-1 bg-gradient-to-br from-[#2d1a4d] via-[#5a2b77] to-[#1a1333] text-white border border-purple-700 rounded-2xl hover:scale-90 transition disabled:opacity-50 cursor-pointer"
                onClick={handleReopen}
                disabled={loading}
                >
                {loading ? "Reopening..." : "Reopen Project"}
                </button> */}
              <button
                className="relative inline-flex items-center justify-center px-2 py-2       overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-700 cursor-pointer"
                onClick={handleReopen}
                disabled={loading}
              >
                <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-[#ff00ff] rounded-full opacity-40 group-hover:rotate-90 ease"></span>

                <span className="relative text-white">
                  {loading ? "Reopening..." : "Reopen Project"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
