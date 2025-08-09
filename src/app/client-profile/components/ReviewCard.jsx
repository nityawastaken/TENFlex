import useFetchUserByUsername from "@/Hooks/useFetchUserByUsername";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa6";

const ReviewCard = ({ r }) => {
  const [gigDetails, setGigDetails] = useState(null);
  const router = useRouter()

  const fetchDetals = async () => {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/base/gigs/" + r.gig_id
    );
    setGigDetails(res.data);
  };

  const fetchUser = useFetchUserByUsername()

  const handleOpenProfile = async (userName) =>{
    const userProfile = await fetchUser(userName)
    if (userProfile) {
      const { id, is_freelancer } = userProfile;
      const path = is_freelancer ? `/profile/${id}/` : `/client-profile/${id}/`;
      console.log("path :", path)
      router.push(path);
    } else {
      // Show error to user, or handle accordingly
      console.log("User not found");
    }
  }

  useEffect(() => {
    fetchDetals();
  }, []);

  return (
    <div
      key={r.id}
      className="text-white bg-gradient-to-br from-[#24194a] via-[#1a0d2b] to-[#28163a] px-6 py-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 items-start border border-purple-900 min-h-[120px] md:h-[20vh] transition-transform hover:scale-[1.02] hover:shadow-2xl overflow-y-scroll scrollbar-hide "
    >
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 ">
        <div className="bg-purple-900 rounded-full w-14 h-14 flex items-center justify-center mb-2 ">
          <FaRegStar className="text-yellow-400 text-3xl" />
        </div>
        <div className="text-yellow-300 font-bold text-xl">{r.rating}</div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:justify-between gap-2">
          <div>
            <span className="text-sm ">Freelancer:</span>{" "}
            <h2
              onClick={() => handleOpenProfile(gigDetails?.freelancer)}
              className="cursor-pointer text-purple-200 text-sm hover:underline underline hover:-translate-y-0.5 hover:text-purple-500 duration-300 truncate"
            >
              {gigDetails?.freelancer}
            </h2>
          </div>
          <p>
            <span className="text-sm ">Gig : </span>
            <Link
              href={`/gigDetails/${r.gig_id}`}
              className="text-sm cursor-pointer text-purple-200 hover:underline truncate"
            >
              {r.gig_title}
            </Link>
          </p>
        </div>
        <p className="text-sm text-gray-300 mt-1">
          <span className="font-medium">Posted:</span>{" "}
          {new Date(r.created_at).toLocaleDateString()}
        </p>
        <div className="bg-purple-950/40 flex flex-wrap rounded-xl p-3 text-gray-100 text-base  break-words  mt-2 max-w-full md:max-w-[40vw] md:min-h-[60px] h-24 overflow-y-auto md:h-auto">
          {r.comment}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
