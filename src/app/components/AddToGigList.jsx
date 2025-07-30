import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddToGigList = ({ setAddToGiglist, gigId }) => {
  const [gigList, setGigList] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchGigList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/base/giglists/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setGigList(response.data);
    } catch (error) {
      toast.error("Failed to fetch gig lists");
    }
  };

  useEffect(() => {
    fetchGigList();
  }, []);

  const handleAddToGiglist = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/base/giglists/${id}/gigs/add/`,
        { gig_id: gigId },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setAddToGiglist(false);
        toast.success("Added to your GigList!");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 top-0 left-0 right-0 w-full h-full backdrop-blur-sm bg-opacity-60 flex justify-center items-start pt-6 z-50">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="bg-gradient-to-br from-[#24194a] via-[#1a1333] to-[#2d1a4d] p-4 sm:p-6 rounded-2xl w-full max-w-md relative shadow-2xl border border-purple-900 mx-2 sm:mx-auto">
        {/* Close button */}
        <button
          className="absolute top-2 cursor-pointer right-3 text-2xl font-bold text-purple-300 hover:text-red-500 transition"
          onClick={() => setAddToGiglist(false)}
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-purple-200 mb-4 text-center">
          Add Gig to Your GigList
        </h2>

        {/* GigList inputs */}
        <div className="space-y-3">
          {gigList.map((gig) => (
            <div
              key={gig.id}
              className="flex items-center justify-between gap-2 border border-purple-700 bg-[#1a1333] px-4 py-3 rounded-lg shadow-sm"
            >
              <span className="truncate w-2/3 text-purple-100 font-medium">
                {gig.name || "Unnamed"}
              </span>
              <button
                onClick={() => handleAddToGiglist(gig.id)}
                className="flex items-center gap-1 bg-gradient-to-r from-purple-700 to-purple-500 text-white px-4 py-1.5 rounded-lg font-semibold shadow hover:scale-105 hover:from-purple-800 hover:to-purple-600 transition cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddToGigList;
