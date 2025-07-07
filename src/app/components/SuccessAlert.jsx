import useScreenWidth from "@/Hooks/useScreenWidth";
import React from "react";

const SuccesAlert = ({message}) => {

    const width = useScreenWidth(); 

  return (
    <div role="alert" className={"alert alert-success  w-4/12 mx-auto text-white font-semibold flex items-center justify-center gap-2 py-4 text-xl fixed inset-0 z-50" +(width < 640 ? "w-11/12 mt-18 h-18" : "w-4/12 mt-24 h-20")}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default SuccesAlert;
