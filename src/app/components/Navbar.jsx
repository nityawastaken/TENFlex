"use client"; // This directive is necessary for client-side hooks like useState, useEffect, useRef

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const sideMenuRef = useRef(null);
  const [isScroll, setIsScroll] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Simulated user state (replace with real auth logic)
  const [user, setUser] = useState(null);
  // Example: setUser({ name: "John Doe" }) after sign in

  const openMenu = () => {
    if (sideMenuRef.current) {
      sideMenuRef.current.style.transform = "translateX(0)";
      setIsMenuOpen(true);
    }
  };

  const closeMenu = () => {
    if (sideMenuRef.current) {
      sideMenuRef.current.style.transform = "translateX(-100%)";
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`w-full flex justify-between items-center px-4 md:px-10 py-5 fixed top-0 z-50 border-b border-white transition duration-300 ${
          isScroll ? "bg-black shadow-md backdrop-blur-lg" : "bg-black"
        }`}
      >
        {/* Logo and search */}
        <div className="flex items-center gap-4 md:gap-10">
          <div className="logo">
            {/* Using the TENFLEX text logo as before */}
            <h1 className="font-bold tracking-wider text-2xl md:text-3xl text-white">
              TENFLE<span className="text-[#A020F0]">x</span>
            </h1>
            {/* If you prefer an image logo later, you can use:
            <Link href="/">
              <Image
                src="/your-logo.png" // Replace with your actual logo path
                alt="TENFLEX Logo"
                width={120}
                height={36}
                className="h-8 w-auto"
              />
            </Link>
            */}
          </div>
          <div className="search hidden md:block">
            {/* Hide on small screens */}
            <form className="flex items-center gap-2 transition-all duration-300">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border border-gray-300 bg-black text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#A020F0] w-48 lg:w-64" // Added width classes
              />
              <button type="submit" className="text-[#A020F0] hover:ml-2 transition-all duration-300">
                <FaArrowRight />
              </button>
            </form>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6">
          <ul className="relative nav-links flex gap-5 lg:gap-8 px-12 py-3 text-white text-xl">
            {/*
              { name: "Business", href: "/business" },
              { name: "Explore", href: "/#explore" },
              { name: "Freelance", href: "/#seller" },
            */}
            {/*
            // Keeping the original links commented out for reference
            { name: "Business", href: "/business" },
            { name: "Explore", href: "/#explore" },
            { name: "Freelance", href: "/#seller" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="relative font-Ovo text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#A020F0] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
              >
                {item.name}
              </Link>
            </li>
          ))}
          */}
          </ul>

          {/* Auth/Profile Section */}
          {user ? (
            <Link href="/profile" className="flex items-center gap-2 text-xl text-white">
              <FaUserCircle className="text-3xl" />
              <span className="hidden md:inline">{user.name}</span>
            </Link>
          ) : (
            <>
              <Link href="/signin" className="text-xl text-white">
                <span className="relative text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2.5px] after:bg-[#A020F0] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left">
                  Sign <span className="font-bold text-[#A020F0]">In</span>
                </span>
              </Link>
              <Link
                className="group relative flex items-center gap-3 px-10 py-2.5 border border-white rounded-full ml-4 overflow-hidden transition-all duration-300"
                href="/signup"
              >
                <span className="relative z-10 text-white transition-all duration-300">
                  Sign Up
                </span>
                <FaArrowRight className="relative z-10 transition-all duration-300 text-white" />
                <span className="absolute inset-0 bg-[#A020F0] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button onClick={openMenu} className="text-white focus:outline-none">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Secondary Navbar - Fiverr style */}
      <nav
        className="w-full fixed top-[70px] z-40 bg-[#18181b] border-b border-gray-800 shadow-sm"
        style={{ left: 0 }}
      >
        <div className="overflow-x-auto scrollbar-hide">
          <ul className="flex whitespace-nowrap gap-6 px-4 md:px-10 py-2 text-white text-base font-medium">
            <li>
              <Link href="/categories/graphics-design" className="hover:text-[#A020F0] transition-colors duration-200">
                Graphics & Design
              </Link>
            </li>
            <li>
              <Link href="/categories/digital-marketing" className="hover:text-[#A020F0] transition-colors duration-200">
                Digital Marketing
              </Link>
            </li>
            <li>
              <Link href="/categories/writing-translation" className="hover:text-[#A020F0] transition-colors duration-200">
                Writing & Translation
              </Link>
            </li>
            <li>
              <Link href="/categories/video-animation" className="hover:text-[#A020F0] transition-colors duration-200">
                Video & Animation
              </Link>
            </li>
            <li>
              <Link href="/categories/music-audio" className="hover:text-[#A020F0] transition-colors duration-200">
                Music & Audio
              </Link>
            </li>
            <li>
              <Link href="/categories/programming-tech" className="hover:text-[#A020F0] transition-colors duration-200">
                Programming & Tech
              </Link>
            </li>
            <li>
              <Link href="/categories/business" className="hover:text-[#A020F0] transition-colors duration-200">
                Business
              </Link>
            </li>
            <li>
              <Link href="/categories/lifestyle" className="hover:text-[#A020F0] transition-colors duration-200">
                Lifestyle
              </Link>
            </li>
            <li>
              <Link href="/categories/data" className="hover:text-[#A020F0] transition-colors duration-200">
                Data
              </Link>
            </li>
            <li>
              <Link href="/categories/photography" className="hover:text-[#A020F0] transition-colors duration-200">
                Photography
              </Link>
            </li>
            {/* Add more categories as needed */}
          </ul>
        </div>
      </nav>

      {/* Side Menu for mobile */}
      <div
        ref={sideMenuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white p-5 transform -translate-x-full transition-transform duration-300 ease-in-out z-50 lg:hidden`}
        style={{
          boxShadow: "2px 0 5px rgba(0,0,0,0.5)",
        }}
      >
        <button onClick={closeMenu} className="absolute top-5 right-5 text-white text-2xl focus:outline-none">
          &times;
        </button>
        <div className="flex flex-col gap-6 mt-16">
          <Link href="/fiverr-business" className="text-lg hover:text-[#A020F0] transition-colors duration-200" onClick={closeMenu}>
            Fiverr Business
          </Link>
          <Link href="/explore" className="text-lg hover:text-[#A020F0] transition-colors duration-200" onClick={closeMenu}>
            Explore
          </Link>
          <Link href="/become-a-seller" className="text-lg hover:text-[#A020F0] transition-colors duration-200" onClick={closeMenu}>
            Become a Seller
          </Link>
          {user ? (
            <Link href="/profile" className="text-lg flex items-center gap-2" onClick={closeMenu}>
              <FaUserCircle className="text-2xl" />
              <span>Profile</span>
            </Link>
          ) : (
            <>
              <Link href="/signin" className="text-lg hover:text-[#A020F0] transition-colors duration-200" onClick={closeMenu}>
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-lg px-6 py-2 border border-white rounded-full hover:bg-[#A020F0] hover:border-[#A020F0] transition-all duration-300 text-center"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Overlay to close side menu when clicking outside */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMenu}
        ></div>
      )}
    </>
  );
};

export default Navbar;