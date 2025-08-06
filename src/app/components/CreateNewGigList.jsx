import axios from "axios";
import React, { useState } from "react";

export const CreateNewGigList = ({ fetchGigs,setAddToGiglist }) => {
  const [newGigListName, setNewGigListName] = useState("");
  const token = localStorage.getItem("token");

  // Create new giglist
  const handleCreateGigList = async () => {
    await axios.post(
      process.env.NEXT_PUBLIC_API_URL + `/base/giglists/create/`,
      { name: newGigListName },
      { headers: { Authorization: `Token ${token}` } }
    );
    setNewGigListName("");
    if(fetchGigs){
        fetchGigs();
    }
    if(setAddToGiglist){
        setAddToGiglist(false)
    }
  };

  return (
    <div className="mb-6 w-full flex flex-col sm:flex-row gap-2 items-center">
      <input
        type="text"
        value={newGigListName}
        onChange={(e) => setNewGigListName(e.target.value)}
        placeholder="New giglist name"
        className="px-3 py-2 rounded bg-[#24194a] text-purple-200 border border-purple-700 w-full sm:w-9/12"
      />
      <button
        onClick={handleCreateGigList}
        className="bg-purple-700 cursor-pointer text-white px-4 py-2 rounded hover:bg-purple-800 w-full sm:w-3/12"
      >
        Create Giglist
      </button>
    </div>
  );
};
