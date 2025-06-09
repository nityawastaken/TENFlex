"use client";
import React, { useState, useRef } from "react";

const videoList = [
  "/videos/video1.mp4",
  "/videos/video2.mp4",
  "/videos/video3.mp4",
];

const Hero = () => {
  const [searchText, setSearchText] = useState(""); // step 1
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoList.length);
  };

  const handleChange = (e) => {
    setSearchText(e.target.value); // step 2
    console.log(e.target.value);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="layout-content-container flex flex-col w-full flex-1 mt-[87px] relative overflow-hidden">
      <div className="@container">
        <div className="@[480px]:p-4 relative h-[calc(100vh-87px)]">
          {/* 🔹 Video Background */}
          <video
            key={videoList[currentVideoIndex]}
            ref={videoRef} // re-render on source change
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src={videoList[currentVideoIndex]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* 🔹 Overlay and Content */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex flex-col items-center justify-center gap-6 p-4 @[480px]:p-10 z-10">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl text-center max-w-[800px]">
              Find the perfect freelance services for your business
            </h1>

            {/* ...your search bar remains unchanged */}
            <label className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div
                  className="text-[#ad95c6] flex border border-[#4d3663] bg-black items-center justify-center pl-[15px] rounded-l-xl border-r-0"
                  data-icon="MagnifyingGlass"
                  data-size="20px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
                <input
                  placeholder="Search for a service"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#4d3663] bg-black focus:border-[#4d3663] h-full placeholder:text-[#ad95c6] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
                  onChange={handleChange} // step 3
                  value={searchText} // step 4
                />
                <div className="flex items-center justify-center rounded-r-xl border-l-0 border border-[#4d3663] bg-black pr-[7px]">
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#8020df] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                    <span className="truncate">Search</span>
                  </button>
                </div>
              </div>
            </label>

            {/* button elements to display some services */}
            <div className="flex flex-wrap mx-auto items-center gap-4 mt-2">
              <button className="bg-transparent border border-[#A020F0] text-white px-6 py-2 rounded-lg hover:bg-[#a020f03c] transition flex items-center gap-2">
                Website Development
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#A020F0" viewBox="0 0 24 24">
                  <path d="M10 17l5-5-5-5v10z"/>
                </svg>
              </button>
              <button className="bg-transparent border border-[#A020F0] text-white px-6 py-2 rounded-lg hover:bg-[#a020f03c] transition flex items-center gap-2">
                architecture and interior design
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#A020F0" viewBox="0 0 24 24">
                  <path d="M10 17l5-5-5-5v10z"/>
                </svg>
              </button>
              <button className="bg-transparent border border-[#A020F0] text-white px-6 py-2 rounded-lg hover:bg-[#a020f03c] transition flex items-center gap-2">
                AI Services
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#A020F0" viewBox="0 0 24 24">
                  <path d="M10 17l5-5-5-5v10z"/>
                </svg>
              </button>
              <button className="bg-transparent border border-[#A020F0] text-white px-6 py-2 rounded-lg hover:bg-[#a020f03c] transition flex items-center gap-2">
                Logo Design
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#A020F0" viewBox="0 0 24 24">
                  <path d="M10 17l5-5-5-5v10z"/>
                </svg>
              </button>
            </div>

            {/* 🔘 Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="absolute bottom-4 right-4 z-40 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M104,56a8,8,0,0,1,8,8V192a8,8,0,0,1-16,0V64A8,8,0,0,1,104,56Zm48,0a8,8,0,0,1,8,8V192a8,8,0,0,1-16,0V64A8,8,0,0,1,152,56Z" />
                </svg>
              ) : (
                <svg fill="currentColor" height="24" width="24" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60"  xmlSpace="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"></path> <path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30 S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"></path> </g> </g></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
