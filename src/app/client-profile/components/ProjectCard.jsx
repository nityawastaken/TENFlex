import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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

  const handleOpenProfile = async (freelancer) => {
    try {
      const userData = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/base/get_user_by_username/${freelancer}`
      );
      if (userData.status === 200) {
        router.push(`/profile/${userData?.data?.id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      key={p.id}
      className="bg-gradient-to-br from-[#24194a] via-[#1a0d2b] to-[#28163a] shadow-lg p-6 rounded-2xl w-full md:w-[340px] min-h-[320px] flex flex-col justify-between transition-transform hover:scale-[1.03] hover:shadow-xl flex-shrink-0"
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
            {p.budget} $
          </p>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-xs text-gray-300">
            <span className="font-semibold">Started At:</span>{" "}
            <span className="bg-[#24194a] rounded px-2 py-1">
              {p.start_date}
            </span>
          </p>
          {closed && (
            <div className="flex justify-between items-center ">
              <div>
                <p className="text-xs text-gray-300 ">
                  <span className="font-semibold">Closed At:</span>{" "}
                  <span className="bg-[#24194a] rounded px-2 py-1">
                    {p.closed_date || p.start_date}
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
                      {Math.floor(acceptedBid?.bid_amount)} $
                    </span>{" "}
                  </p>
                </div>
              </div>
              <button
                className="ml-4 px-1 py-1 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                onClick={handleReopen}
                disabled={loading}
              >
                {loading ? "Reopening..." : "Reopen Project"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
