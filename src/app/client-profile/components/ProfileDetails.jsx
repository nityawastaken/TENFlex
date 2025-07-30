import useScreenWidth from "@/Hooks/useScreenWidth";
import { FaLocationDot } from "react-icons/fa6";
import { MdContactPhone } from "react-icons/md";

// Language code-name mapping (should match page.jsx)
const LANGUAGE_CODE_TO_NAME = {
  en: "English",
  hi: "Hindi",
  fr: "French",
  es: "Spanish",
  de: "German",
  zh: "Chinese",
  ru: "Russian",
};

const ProfileDetails = ({
  editMode,
  setEditMode,
  editFirstName,
  editLastName,
  editEmail,
  editLocation,
  editProfilePicture,
  file,
  editRole,
  editUsePurpose,
  editContact,
  languages,
  id
}) => {
  const userObj = localStorage.getItem("userMin");
  const user = userObj ? JSON.parse(userObj) : ""

  // console.log("file ", file)
  return (
    <div className="w-full min-h-[320px] bg-[#383161] backdrop-opacity-5 pt-8 rounded-2xl shadow-lg border border-purple-900 relative flex flex-col items-center">
      <div className="relative w-24 h-24 flex mx-auto rounded-full bg-[#1a0d2b] justify-center items-center shadow-md border-4 border-purple-800">
        {file ? (
          <img
            src={file}
            alt="Profile"
            className="w-full h-full rounded-full object-cover mx-auto"
          />
        ) : (
          <span className="text-white text-5xl mx-auto font-bold">
            {editFirstName?.[0]?.toUpperCase() || "U"}
          </span>
        )}
        {!editMode && user.id === +id && (
          <button
            className="cursor-pointer fixed right-1 top-1 bg-purple-600 hover:bg-purple-800 text-white rounded-xl p-2 shadow-md transition"
            onClick={() => setEditMode(true)}
            aria-label="Edit Profile"
          >
            Edit
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2 justify-center items-center mt-6 w-full">
        <h2 className="text-2xl font-bold text-white text-center">
          {editFirstName + " " + editLastName || "User Name"}
        </h2>
        <h3 className="text-base text-purple-200 text-center">{editEmail}</h3>
        <div className="flex flex-wrap text-xs gap-3 justify-center items-center mt-2">
          <h4 className="flex items-center gap-2">
            <MdContactPhone className="text-purple-300" />
            {editContact}
          </h4>
          <h4 className="flex items-center gap-2">
            <FaLocationDot className="text-purple-300" />
            {editLocation}
          </h4>
        </div>
      </div>
      <div className="bg-gray-600 rounded-4xl opacity-50 flex mx-auto mt-5 w-[80%] h-[0.5px]" />
      <div className="px-5 py-4 flex flex-col gap-2 w-full mt-2">
        <h4 className="text-xs flex justify-between">
          <span>Role:</span>
          <span className="border border-gray-600 px-2 rounded-lg text-white bg-[#24194a]">
            {editRole}
          </span>
        </h4>
        <h4 className="text-xs flex justify-between">
          <span>Use Purpose:</span>
          <span className="border border-gray-600 px-2 rounded-lg text-white bg-[#24194a]">
            {editUsePurpose}
          </span>
        </h4>
        <h4 className="text-xs flex justify-between">
          <span>Languages:</span>
          <span className="border border-gray-600 px-2 rounded-lg text-white bg-[#24194a]">
            {(() => {
              if (Array.isArray(languages) && languages.length > 0) {
                const languageNames = languages.map(
                  (code) => LANGUAGE_CODE_TO_NAME[code] || code
                );
                return languageNames.join(", ");
              } else {
                return "N/A";
              }
            })()}
          </span>
        </h4>
      </div>
    </div>
  );
};

export default ProfileDetails;
