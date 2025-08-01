import React, { useEffect, useState } from "react";
import Section from "./Section";
import axios from "axios";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Link from "next/link";

const GiglistsSection = ({ refProp }) => {
  const [gigList, setGigList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [newGigListName, setNewGigListName] = useState("");
  const [renameGigListName, setRenameGigListName] = useState("");
  const [showRenameInput, setShowRenameInput] = useState(null);
  const [newGig, setNewGig] = useState({
    title: "",
    description: "",
    freelancer: "",
    price: "",
  });
  const [showAddGigInput, setShowAddGigInput] = useState(null);

  const token = localStorage.getItem("token");

  const fetchGigs = async () => {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + `/base/giglists/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    setGigList(response.data);
    // console.log("gigList ; ", response.data);
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
    } else {
      fetchGigs();
    }
    // eslint-disable-next-line
  }, []);

  const toggleSection = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Create new giglist
  const handleCreateGigList = async () => {
    await axios.post(
      process.env.NEXT_PUBLIC_API_URL + `/base/giglists/create/`,
      { name: newGigListName },
      { headers: { Authorization: `Token ${token}` } }
    );
    setNewGigListName("");
    fetchGigs();
  };

  // Rename giglist
  const handleRenameGigList = async (id) => {
    if (!renameGigListName.trim()) return;
    await axios.put(
      process.env.NEXT_PUBLIC_API_URL + `/base/giglists/${id}/update/`,
      { name: renameGigListName },
      { headers: { Authorization: `Token ${token}` } }
    );
    setRenameGigListName("");
    setShowRenameInput(null);
    fetchGigs();
  };

  // Delete giglist
  const handleDeleteGigList = async (id) => {
    await axios.delete(
      process.env.NEXT_PUBLIC_API_URL + `/base/giglists/${id}/delete/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    fetchGigs();
  };

  // Remove gig from giglist
  const handleRemoveGig = async (listId, gigId) => {
    // console.log("gig id. ", gigId);
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_API_URL +
          `/base/giglists/${listId}/gigs/remove/`,
        { gig_id: gigId },
        { headers: { Authorization: `Token ${token}` } }
      );
      fetchGigs();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Section
      ref={refProp}
      id="giglists"
      title="Your Giglists"
      className="bg-[#1a1333] rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-screen"
    >
      {/* Create new giglist */}
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
      {gigList.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No giglists created yet.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {gigList.map((list, index) => (
            <div
              key={list.id}
              className="bg-[#24194a] rounded-lg shadow-md transition hover:shadow-xl border border-purple-900"
            >
              {/* Giglist Name Header */}
              <div
                onClick={() => toggleSection(index)}
                className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 cursor-pointer select-none rounded-t-lg flex-wrap"
                style={{
                  background:
                    activeIndex === index
                      ? "linear-gradient(90deg, #6d28d9 0%, #24194a 100%)"
                      : "transparent",
                }}
              >
                <span className="font-bold text-purple-200 tracking-wide w-full sm:w-auto">
                  <span className="block max-w-full sm:max-w-[220px] md:max-w-[300px] truncate overflow-hidden whitespace-nowrap text-ellipsis" title={list.name}>
                    {list.name}
                  </span>
                </span>
                <span className="flex gap-2 items-center mt-2 sm:mt-0">
                  {/* Rename giglist */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRenameInput(index);
                      setRenameGigListName(list.name);
                    }}
                    className="text-xs cursor-pointer bg-purple-800 text-white px-2 py-1 rounded hover:bg-purple-900"
                  >
                    Rename
                  </button>
                  {/* Delete giglist */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this giglist?"))
                        handleDeleteGigList(list.id);
                    }}
                    className="text-xs cursor-pointer bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800"
                  >
                    Delete
                  </button>
                  {activeIndex === index ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </div>
              {/* Rename giglist input */}
              {showRenameInput === index && (
                <div className="px-6 py-2 flex gap-2 items-center flex-wrap">
                  <input
                    type="text"
                    value={renameGigListName}
                    onChange={(e) => setRenameGigListName(e.target.value)}
                    className="px-3 py-2 rounded bg-[#2d2256] text-purple-200 border border-purple-700 w-full sm:w-auto"
                  />
                  <button
                    onClick={() => handleRenameGigList(list.id)}
                    className="bg-purple-700 cursor-pointer text-white px-3 py-1 rounded hover:bg-purple-800"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowRenameInput(null)}
                    className="bg-gray-700 cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {/* Add gig input */}
              {/* {showAddGigInput === index && (
                <div className="px-6 py-2 flex flex-col gap-2 bg-[#2d2256] rounded-b">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newGig.title}
                    onChange={(e) =>
                      setNewGig({ ...newGig, title: e.target.value })
                    }
                    className="px-3 py-2 rounded bg-[#24194a] text-purple-200 border border-purple-700 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newGig.description}
                    onChange={(e) =>
                      setNewGig({ ...newGig, description: e.target.value })
                    }
                    className="px-3 py-2 rounded bg-[#24194a] text-purple-200 border border-purple-700 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Freelancer"
                    value={newGig.freelancer}
                    onChange={(e) =>
                      setNewGig({ ...newGig, freelancer: e.target.value })
                    }
                    className="px-3 py-2 rounded bg-[#24194a] text-purple-200 border border-purple-700 w-full"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newGig.price}
                    onChange={(e) =>
                      setNewGig({ ...newGig, price: e.target.value })
                    }
                    className="px-3 py-2 rounded bg-[#24194a] text-purple-200 border border-purple-700 w-full"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleAddGig(list.id)}
                      className="bg-green-700 cursor-pointer text-white px-3 py-1 rounded hover:bg-green-800 w-full sm:w-auto"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddGigInput(null)}
                      className="bg-gray-700 cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-800 w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )} */}
              {/* Expandable Gig Cards */}
              {activeIndex === index && (
                <div className="px-6 pb-6 pt-2">
                  {list.gigs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {list.gigs.map((gig) => (
                        <div
                          key={gig.id}
                          className="w-full bg-gradient-to-br from-[#2d2256] to-[#24194a] shadow-lg rounded-xl p-5 border border-purple-800 hover:scale-105 transition-transform relative overflow-hidden flex flex-col"
                        >
                          <h3 className="text-lg font-semibold text-purple-100 mb-2 truncate" title={gig.title}>
                            {gig.title}
                          </h3>
                          <p className="text-sm text-purple-300 mb-2 whitespace-normal break-words max-h-20 overflow-y-auto">
                            {gig.description}
                          </p>
                          {/* {console.log("gig : ", gig)} */}
                          <p className="text-xs text-purple-400 italic mb-2 truncate">
                            Freelancer: {" "}
                            <Link href={`/profile/${gig.id}`} className="font-medium" title={gig.freelancer}>
                              {gig.freelancer}
                            </Link>
                          </p>
                          <p className="text-lg font-bold text-green-400 mt-2">
                            ₹ {gig.price}
                          </p>

                          {/* Remove gig button */}
                          <button
                            onClick={() => handleRemoveGig(list.id, gig.id)}
                            className="absolute top-2 right-2 text-xs bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800 cursor-pointer max-w-[70px] truncate"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-purple-400 mt-2 break-words">
                      No gigs in this list.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Section>
  );
};

export default GiglistsSection;
