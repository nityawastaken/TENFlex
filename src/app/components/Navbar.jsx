"use client"; // This directive is necessary for client-side hooks like useState, useEffect, useRef

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const sideMenuRef = useRef(null);
  const [isScroll, setIsScroll] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Simulated user state (replace with real auth logic)
  const [user, setUser] = useState(null);
  // Example: setUser({ name: "John Doe" }) after sign in

  const router = useRouter();

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

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim().toLowerCase();
    if (query.includes("people")) {
      router.push("/discover-people");
    } else if (query.includes("service")) {
      router.push("/discover-services");
    } else {
      alert("Please search for 'people' or 'service'");
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
        className="w-full flex justify-between items-center px-2 sm:px-4 md:px-10 py-4 fixed top-0 z-50 border-b border-white bg-transparent transition duration-300"
      >
        {/* Logo and search */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-10">
          <div className="logo">
            <h1 className="font-bold tracking-wider text-xl sm:text-2xl md:text-3xl text-white">
              TENFLE<span className="text-[#A020F0]">x</span>
            </h1>
          </div>
          {/* Search bar: hidden on xs, visible on md+ */}
          <div className="hidden md:block">
            <form
              className="flex items-center gap-2 transition-all duration-300"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 border border-gray-300 bg-black text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#A020F0] w-32 sm:w-48 lg:w-64"
              />
              <button type="submit" className="text-[#A020F0] hover:ml-2 transition-all duration-300">
                <FaArrowRight />
              </button>
            </form>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-4 sm:space-x-6">
          <ul className="flex gap-3 sm:gap-5 lg:gap-8 px-2 sm:px-6 lg:px-12 py-3 text-white text-base sm:text-lg lg:text-xl">
            <li>
              <Link href="/business" className="relative font-Ovo text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#A020F0] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left">
                Business
              </Link>
            </li>
            <li>
              <Link href="/#explore" className="relative font-Ovo text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#A020F0] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left">
                Explore
              </Link>
            </li>
            <li>
              <Link href="/#seller" className="relative font-Ovo text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#A020F0] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left">
                Freelance
              </Link>
            </li>
          </ul>
          {/* Auth/Profile Section */}
          {user ? (
            <Link href="/profile" className="flex items-center gap-2 text-lg lg:text-xl text-white">
              <FaUserCircle className="text-3xl" />
              <span className="hidden md:inline">{user.name}</span>
            </Link>
          ) : (
            <>
              <Link href="/signin" className="text-lg lg:text-xl text-white">
                <span className="relative text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2.5px] after:bg-[#A020F0] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left">
                  Sign <span className="font-bold text-[#A020F0]">In</span>
                </span>
              </Link>
              <Link
                className="group relative flex items-center gap-3 px-6 sm:px-10 py-2.5 border border-white rounded-full ml-2 sm:ml-4 overflow-hidden transition-all duration-300"
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