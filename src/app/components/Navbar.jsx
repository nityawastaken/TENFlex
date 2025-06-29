"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const sideMenuRef = useRef(null);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [navLinks, setNavLinks] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const getLinks = (role) => {
    const base = [
      { name: "Business", href: "/business" },
      { name: "Explore", href: "/#explore" },
      { name: "Projects", href: "/projects" },
    ];

    if (role === "freelancer") {
      base.push(
        { name: "My Gigs", href: "/my-gigs" },
        { name: "Orders", href: "/orders" }
      );
    } else if (role === "customer") {
      base.push(
        { name: "Browse Services", href: "/services" },
        { name: "Hire a Freelancer", href: "/hire" }
      );
    }

    return base;
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/signin");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setProfileImage(parsedUser.profile_picture || null);
      setNavLinks(getLinks(parsedUser.role));
    } else {
      setNavLinks(getLinks(null));
    }

    const handleScroll = () => {
      setIsScroll(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  if (!isMounted) return null;

  return (
    <>
      <nav
        className={`w-full flex justify-between items-center px-4 md:px-10 py-5 fixed top-0 z-50 border-b border-white transition duration-300 ${
          isScroll ? "bg-black/70 backdrop-blur-md shadow-md" : "bg-black"
        }`}
      >
        {/* Logo and Search */}
        <div className="flex items-center gap-4 md:gap-10">
          <h1 className="font-bold tracking-wider text-2xl md:text-3xl text-white">
            TENFLE<span className="text-[#A020F0]">x</span>
          </h1>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center gap-2 transition-all duration-300"
          >
            <input
              type="text"
              name="search"
              placeholder="Search..."
              className="px-4 py-2 border border-gray-300 bg-black text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#A020F0] w-48 lg:w-64"
            />
            <button
              type="submit"
              className="text-[#A020F0] hover:ml-2 transition-all duration-300"
            >
              <FaArrowRight />
            </button>
          </form>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <ul className="flex gap-5 lg:gap-8 px-12 py-3 text-white text-xl">
            {navLinks.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="relative font-Ovo text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#A020F0] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {user ? (
            <div className="text-white flex items-center gap-4">
              <Link
                href={`/profile/${user?.id}`}
                className="flex items-center gap-2"
              >
                {profileImage ? (
                  <img
                    src={
                      profileImage.startsWith("http")
                        ? profileImage
                        : `${process.env.NEXT_PUBLIC_API_URL}${profileImage}`
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-white object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                    {getInitials(user.first_name || user.username)}
                  </div>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm border px-3 py-1 rounded-full hover:bg-white hover:text-black transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/signin" className="text-xl text-white">
                <span className="relative text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2.5px] after:bg-[#A020F0] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left">
                  Sign <span className="font-bold text-[#A020F0]">In</span>
                </span>
              </Link>
              <Link
                href="/signup"
                className="group relative flex items-center gap-3 px-10 py-2.5 border border-white rounded-full ml-4 overflow-hidden transition-all duration-300"
              >
                <span className="relative z-10 text-white">Sign Up</span>
                <FaArrowRight className="relative z-10 text-white" />
                <span className="absolute inset-0 bg-[#A020F0] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 z-0" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center">
          <button onClick={openMenu} className="text-white focus:outline-none">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      <div
        ref={sideMenuRef}
        className="fixed top-0 left-0 h-full w-64 bg-black text-white p-5 transform -translate-x-full transition-transform duration-300 ease-in-out z-50 lg:hidden"
      >
        <button
          onClick={closeMenu}
          className="absolute top-5 right-5 text-white text-2xl focus:outline-none"
        >
          &times;
        </button>
        <div className="flex flex-col gap-6 mt-16">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-lg hover:text-[#A020F0]"
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href={`/profile/${user?.id}`}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2 mt-4">
                  {profileImage ? (
                    <img
                      src={
                        profileImage.startsWith("http")
                          ? profileImage
                          : `${process.env.NEXT_PUBLIC_API_URL}${profileImage}`
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full border border-white object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                      {getInitials(user.first_name || user.username)}
                    </div>
                  )}
                  <span className="text-lg font-semibold">
                    {user?.name || user?.username || "User"}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="text-sm border mt-4 px-3 py-1 rounded-full hover:bg-white hover:text-black transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-lg hover:text-[#A020F0]"
                onClick={closeMenu}
              >
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
