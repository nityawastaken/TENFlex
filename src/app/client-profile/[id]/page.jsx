"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setReduxUser } from "@/utils/redux/slices/userSlice";
import ProfileDetails from "../components/ProfileDetails";
import ProjectsSection from "../components/ProjectsSection";
import OrdersSection from "../components/OrdersSection";
import ReviewsSection from "../components/ReviewsSection";
import GiglistsSection from "../components/GiglistsSection";
import Sidebar from "../components/Sidebar";
import Updateform from "../components/Updateform";
import useScreenWidth from "@/Hooks/useScreenWidth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ISO6391 from "iso-639-1";


const ClientProfilePage = ({ params }) => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const profileRef = useRef(null);
  const projectsRef = useRef(null);
  const ordersRef = useRef(null);
  const reviewsRef = useRef(null);
  const giglistsRef = useRef(null);
  const freelancersRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editUsePurpose, setEditUsePurpose] = useState("");
  const [file, setFile] = useState(null);
  const [profileDelete, setProfileDelete] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pending");

  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState({});
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [languages, setLanguages] = useState([]);

  // const [id, setId] = useState(null);
  const paramsObj = React.use(params);
  const id = paramsObj.id;

  const width = useScreenWidth();

  // profile progress bar
  const totalFields = 10;
  const completedFields = [
    editFirstName,
    editLastName,
    editEmail,
    editContact,
    editLocation,
    editBio,
    editRole,
    editUsePurpose,
    file,
    languages,
  ].filter(Boolean).length;

  const completionPercent = Math.round((completedFields / totalFields) * 100);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/base/users/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      dispatch(setReduxUser(response.data));
      // ...existing code...
      setEditFirstName(response.data.first_name || "");
      setEditLastName(response.data.last_name || "");
      setEditEmail(response.data.email || "");
      setEditContact(response.data.contact_number || "");
      setEditLocation(response.data.location || "");
      setEditBio(response.data.bio || "");
      setFile(response.data.profile_picture_url || "");
      setEditRole(response.data.role || "");
      setEditUsePurpose(response.data.use_purpose || "");

      const userLangs = response.data.lang_spoken || [];
      setLanguages(userLangs);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      const userr = userString ? JSON.parse(userString) : null;
      setUser(userr);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }

    if (id) {
      fetchUserData();
    }
  }, [token, id]);

  const handleSave = async () => {
    try {
      if (file instanceof File) {
        const formData = new FormData();
        formData.append("first_name", editFirstName);
        formData.append("last_name", editLastName);
        formData.append("email", editEmail);
        formData.append("location", editLocation);
        formData.append("contact_number",editContact)
        formData.append("bio", editBio);
        formData.append("role", editRole);
        formData.append("use_purpose", editUsePurpose);
        languages.forEach((lang) => {
          formData.append("lang_spoken", lang);
        });
        formData.append("profile_picture", file);

        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/base/users/${userData.currentUser.id}/`,
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        // console.log("response : ", response)
        if (response.data.id) {
          toast.success("Profile update succcess!");
          fetchUserData();
      
          // Update local storage
          const updatedUser = {
            ...user,
            ...response
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } else {
        const updatedData = {
          first_name: editFirstName,
          last_name: editLastName,
          email: editEmail,
          contact_number: editContact,
          location: editLocation,
          bio: editBio,
          role: editRole,
          use_purpose: editUsePurpose,
          lang_spoken: languages,
        };
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/base/users/${userData.currentUser.id}/`,
          updatedData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        // console.log("response : ", response);
        if (response.data.id) {
          toast.success("Profile update succcess!");
          fetchUserData();
          // Update local storage
          const updatedUser = {
            ...user,
            ...response
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      console.error("Error saving profile data:", err);
      toast.error("Error saving profile data!");
    }

    setEditMode(false);
  };

  const handleDeleteProfile = async () => {
    try {
      const res = await axios.delete(
        process.env.NEXT_PUBLIC_API_URL + `/base/users/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (res.status === 204) {
        toast.success("Profile deleted successfully!");
        localStorage.clear();
        router.push("/");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
  };

  const handleNav = (ref) => {
    console.log("ref  : ", ref)
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!userData?.currentUser) {
    return (
      <div className="text-center items-center mt-64 font-semibold text-2xl text-purple-300">
        Loading...
      </div>
    );
  }

  return (
    <main
      className={`"min-h-screen bg-gradient-to-br from-[#1a1333] to-[#2d1a4d] text-white px-2 sm:px-4 pt-28 flex flex-col md:flex-row gap-4 relative w-full" `}
    >
      <ToastContainer position="bottom-right" autoClose={3000} />

      {/* Delete Profile Modal - Responsive */}
      {profileDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md mx-auto bg-[#2d1a4d] rounded-xl border p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-medium text-gray-200 text-center">
              Are you sure?
            </h2>
            <p className="text-center text-sm">
              Deleting your account will remove all of your information from our
              database. This cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-500 px-4 py-2 rounded-xl cursor-pointer font-semibold"
                onClick={() => setProfileDelete(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 px-4 py-2 rounded-xl cursor-pointer font-semibold"
                onClick={handleDeleteProfile}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar and Profile Details - Responsive */}
      <div
        className={`top-24 ${
          width < 768
            ? "w-full mb-4"
            : "h-screen sticky top-24 flex flex-col space-y-4 overflow-y-auto min-w-[280px] max-w-xs"
        }`}
      >
        <ProfileDetails
          editMode={editMode}
          setEditMode={setEditMode}
          editFirstName={editFirstName}
          editLastName={editLastName}
          editEmail={editEmail}
          editContact={editContact}
          editLocation={editLocation}
          editBio={editBio}
          handleSave={handleSave}
          file={file}
          editRole={editRole}
          editUsePurpose={editUsePurpose}
          languages={languages}
          id={id}
        />
        {/* Sidebar: show below profile on desktop, above on mobile */}
        {width >= 768 && (
          <Sidebar
            handleNav={handleNav}
            refs={{
              profileRef,
              projectsRef,
              ordersRef,
              reviewsRef,
              giglistsRef,
            }}
          />
        )}
      </div>

      {/* Update Form - Responsive */}
      {editMode && (
        <div className="w-full max-w-2xl mx-auto mb-4">
          <Updateform
            handleSave={handleSave}
            editFirstName={editFirstName}
            setEditFirstName={setEditFirstName}
            editLastName={editLastName}
            setEditLastName={setEditLastName}
            editBio={editBio}
            setEditBio={setEditBio}
            editContact={editContact}
            setEditContact={setEditContact}
            editLocation={editLocation}
            setEditLocation={setEditLocation}
            setEditMode={setEditMode}
            file={file}
            setFile={setFile}
            setEditUsePurpose={setEditUsePurpose}
            editUsePurpose={editUsePurpose}
            editRole={editRole}
            setEditRole={setEditRole}
            setLanguages={setLanguages}
            languages={languages}
          />
        </div>
      )}

      {/* Main Content - Responsive */}
      <div className="flex-1 w-full max-w-4xl mx-auto">
        {user?.id === +id && <div className="w-full py-1 flex justify-center mx-auto">
          {/* progress bar */}
          <div className="w-full mx-auto mt-3">
            <div className="mb-2 text-sm font-semibold text-purple-700 flex items-center justify-between">
              <span>Profile Completion</span>
            </div>
            <div className="w-full h-5 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-600 rounded-full shadow-inner relative overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 shadow-lg transition-all duration-700 flex items-center justify-end"
                style={{ width: `${completionPercent}%` }}
              >
                <span className="text-xs text-white font-bold pr-2 animate-pulse">
                  {completionPercent > 10 ? `${completionPercent}%` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>}
        <div className="w-full mt-5 mb-5 flex-col p-4 pl-5 bg-[#1a1333] flex rounded-lg mx-auto hover:scale-105 duration-300 hover:shadow-lg">
          <h3 className="text-purple-400 font-semibold text-lg">About</h3>
          <p className="text-sm break-words">
            {editBio.length !== 0 ? editBio : "No bio yet."}
          </p>
        </div>

        <ProjectsSection
          refProp={projectsRef}
          projects={projects}
          setProjects={setProjects}
          id={id}
        />
        <OrdersSection
          orders={orders}
          refProp={ordersRef}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          setOrders={setOrders}
        />
        <ReviewsSection
          refProp={reviewsRef}
          reviews={reviews}
          setReviews={setReviews}
        />
        <GiglistsSection refProp={giglistsRef} />
        {/* <FreelancersSection
          refProp={freelancersRef}
          freelancers={freelancers}
        /> */}
        {/* Delete Profile Button for mobile: below giglists */}
        {width < 768 && user?.id === +id && (
          <div className="w-full flex justify-end  mb-3">
            <button
              className="px-4 py-2 bg-red-600 rounded-xl cursor-pointer z-40"
              onClick={() => setProfileDelete(true)}
            >
              Delete Profile
            </button>
          </div>
        )}
      </div>
      {/* Delete Profile Button for desktop: fixed to bottom right */}
      {width >= 768 && user?.id === +id && (
        <button
          className="md:absolute bottom-1 right-2 md:right-10 px-4 py-2 bg-red-600 rounded-xl cursor-pointer z-40"
          onClick={() => setProfileDelete(true)}
        >
          Delete Profile
        </button>
      )}
    </main>
  );
};

export default ClientProfilePage;
