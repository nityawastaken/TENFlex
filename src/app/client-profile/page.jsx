"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setReduxUser } from "@/utils/redux/slices/userSlice";
import ProfileDetails from "./ProfileDetails";
import ProjectsSection from "./ProjectsSection";
import OrdersSection from "./OrdersSection";
import ReviewsSection from "./ReviewsSection";
import GiglistsSection from "./GiglistsSection";
import Sidebar from "./Sidebar";
import Updateform from "./Updateform";
import useScreenWidth from "@/Hooks/useScreenWidth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientProfilePage = () => {
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
  const [selectedStatus, setSelectedStatus] = useState("ongoing");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState({});
  const [reviews, setReviews] = useState([]);
  // const [freelancers, setFreelancers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [languages, setLanguages] = useState([]);

  // Language code-name mapping
  const LANGUAGE_CODE_TO_NAME = {
    en: "English",
    hi: "Hindi",
    fr: "French",
    es: "Spanish",
    de: "German",
    zh: "Chinese",
    ru: "Russian",
  };
  const LANGUAGE_NAME_TO_CODE = Object.fromEntries(
    Object.entries(LANGUAGE_CODE_TO_NAME).map(([code, name]) => [
      name.toLowerCase(),
      code,
    ])
  );
  const [id, setId] = useState(null);

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

  // const userString = localStorage.getItem("user");
  // const user = JSON.parse(userString);
  // const id = user.id;

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/base/users/${id}`,
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
      setFile(response.data.profile_picture || "");
      setEditRole(response.data.role || "");
      setEditUsePurpose(response.data.use_purpose || "");

      // Language input initialization: codes to names for input
      const userLangs = response.data.lang_spoken || [];
      const langNames = userLangs.map(
        (code) => LANGUAGE_CODE_TO_NAME[code] || code
      );
      setInputValue(langNames.join(", "));
      setLanguages(userLangs);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("userMin");
      const user = userString ? JSON.parse(userString) : null;
      if (user?.id) {
        setId(user.id);
      }
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

  // useEffect(() => {
  //   if (isSuccess) {
  //     const timer = setTimeout(() => {
  //       setIsSuccess(false);
  //       setSuccessMessage("");
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  //   if (isError) {
  //     const timer = setTimeout(() => setIsError(false), 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [isSuccess, isError]);

  const handleSave = async () => {
    try {
      // Convert inputValue (names) to codes for backend
      const langNames = inputValue
        .split(",")
        .map((name) => name.trim().toLowerCase())
        .filter((name) => name.length > 0);
      const langCodes = langNames.map(
        (name) => LANGUAGE_NAME_TO_CODE[name] || name
      );
      setLanguages(langCodes); // keep state in sync

      if (file instanceof File) {
        const formData = new FormData();
        formData.append("first_name", editFirstName);
        formData.append("last_name", editLastName);
        formData.append("email", editEmail);
        // formData.append("contact_number", `+91${editContact}`); // optional
        formData.append("location", editLocation);
        formData.append("bio", editBio);
        formData.append("role", editRole);
        formData.append("use_purpose", editUsePurpose);
        // if (Array.isArray(langCodes) && langCodes.length > 0) {
        //   langCodes.forEach((lang) => {
        //     formData.append("lang_spoken", lang);
        //   });
        // }
        formData.append("lang_spoken", langCodes.toString());
        formData.append("profile_picture", file);
        // ...existing code...
        const response = await axios.patch(
          `http://127.0.0.1:8000/base/users/${userData.currentUser.id}/`,
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if (response.data.id) {
          toast.success("Profile update succcess!")
          fetchUserData();
        }
      } else {
        // Defensive: filter out any accidental stringified arrays
        const cleanLangCodes = Array.isArray(langCodes)
          ? langCodes.filter(
              (code) =>
                typeof code === "string" &&
                !code.startsWith("[") &&
                !code.endsWith("]")
            )
          : [];
        const updatedData = {
          first_name: editFirstName,
          last_name: editLastName,
          email: editEmail,
          // contact_number: `${
          //   editContact.length !== 0 ? "+91" + editContact : ""
          // }`,
          contact_number: editContact,
          location: editLocation,
          bio: editBio,
          role: editRole,
          use_purpose: editUsePurpose,
          lang_spoken: langCodes.toString(),
        };
        // ...existing code...
        const response = await axios.patch(
          `http://127.0.0.1:8000/base/users/${userData.currentUser.id}/`,
          updatedData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if (response.data.id) {
          toast.success("Profile update succcess!")
          fetchUserData();
        }
      }
    } catch (err) {
      console.error("Error saving profile data:", err);
      toast.error("Error saving profile data!")
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
        toast.success("Profile deleted successfully!")
        localStorage.clear();
        router.push("/");
      }
      else{
        toast.error("Something went wrong!")
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!")
    }
  };

  const handleLangChange = (e) => {
    setInputValue(e.target.value);
    // Live update: convert names to codes for state
    const langNames = e.target.value
      .split(",")
      .map((name) => name.trim().toLowerCase())
      .filter((name) => name.length > 0);
    const langCodes = langNames.map(
      (name) => LANGUAGE_NAME_TO_CODE[name] || name
    );
    setLanguages(langCodes);
  };

  const handleNav = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!userData?.currentUser) {
    return <div className="text-center mt-24 text-purple-300">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1333] to-[#2d1a4d] text-white p-6 pt-32 flex flex-col md:flex-row gap-4 relative">
      {/* {isSuccess && <SuccessAlert message={successMessage} />} */}
      {/* {isError && <ErrorAlert error={"Someting went wrong"} />} */}
      <ToastContainer position="bottom-right" autoClose={3000} />

      {/* delete the profile0 */}
      {profileDelete && (
        <div className="fixed flex flex-col justify-center items-center w-[35vw] rounded-xl h-[40vh] z-50 border left-0 right-0 mt-30 mx-auto bg-[#2d1a4d] gap-3 px-8 py-4">
          {/* x svg */}
          <h2 className="text-2xl font-medium text-gray-200">Are you sure?</h2>
          <p>
            Deleting your account will remove all of your information from our
            database. This cannot be undone.
          </p>
          <div className="flex justify-between w-1/2  gap-4">
            <button
              className="bg-gray-500 px-3 py-2 rounded-xl cursor-pointer  text-semibold"
              onClick={() => setProfileDelete(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 px-3 py-2 rounded-xl cursor-pointer  text-semibold"
              onClick={handleDeleteProfile}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div
        className={`top-28 ${
          width < 768
            ? "h-auto space-y-4" // mobile view: allow normal flow and spacing
            : "h-screen sticky space-y- overflow-y-auto" // desktop view: sticky and scrollable
        }`}
      >
        {/* Sticky Basic Details */}
        <div className="">
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
          />
        </div>
        {/* Sidebar Below Profile */}
        <div className={width <= 786 ? `hidden` : `w-full`}>
          <Sidebar
            handleNav={handleNav}
            refs={{
              profileRef,
              projectsRef,
              ordersRef,
              reviewsRef,
              freelancersRef,
            }}
          />
        </div>
      </div>
      <div>
        {editMode && (
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
            handleLangChange={handleLangChange}
            setLanguages={setLanguages}
            languages={languages}
            setInputValue={setInputValue}
            inputValue={inputValue}
          />
        )}
      </div>

      <div className="flex-1 max-w-4xl mx-auto ">
        <div className="w-[85%]   py-1 flex justify-center mx-auto">
          {/* progress bar */}
          <div className="w-full  mx-auto mt-3 ">
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
        </div>
        <div className="w-[85%] mt-5 mb-5  flex-col p-4 pl-5 bg-[#1a1333] flex rounded-lg mx-auto">
          <h3 className="text-purple-400 font-semibold text-lg">About</h3>
          <p className="text-sm">
            {editBio.length !== 0 ? editBio : "No bio yet."}
          </p>
        </div>

        <ProjectsSection
          refProp={projectsRef}
          projects={projects}
          setProjects={setProjects}
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
      </div>
      <button
        className="absolute cursor-pointer bottom-5 px-3 py-1 right-10 bg-red-600 rounded-xl"
        onClick={() => setProfileDelete(true)}
      >
        Delete Profile
      </button>
    </main>
  );
};

export default ClientProfilePage;
