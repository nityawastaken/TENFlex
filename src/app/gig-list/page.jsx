"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/app/gig-list/GigList.css";
import useScreenWidth from "@/Hooks/useScreenWidth";
import { Slider, Box, Typography } from "@mui/material";
import GigCard from "@/app/components/GigCard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const allLanguages = [
  "Any",
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Russian",
];
const allLocations = [
  "Any",
  "India",
  "USA",
  "UK",
  "Germany",
  "France",
  "China",
  "Russia",
  "Spain",
];

const durationOptions = [
  { label: "Any", value: 100 },
  { label: "1 day", value: 1 },
  { label: "3 days", value: 3 },
  { label: "5 days", value: 5 },
  { label: "1 week", value: 7 },
];
const priceOptions = [
  { label: "Any", min: 0, max: 20000 },
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000-₹10,000", min: 5000, max: 10000 },
  { label: "₹10,000-₹15,000", min: 10000, max: 15000 },
  { label: "Above ₹15,000", min: 15000, max: 20000 },
];

// const dummyFreelancers = [];
const dummyFreelancers = [
  {
    name: "Alex Johnson",
    title: "I will build your custom website or web app",
    rating: 5.0,
    reviews: 120,
    price: 7500,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    badge: "Level 2",
    tag: "TENFlex Choice",
    duration: 7,
    languages: ["English", "Hindi"],
    location: "India",
  },
  {
    name: "Priya Sharma",
    title: "Full stack developer for modern web projects",
    rating: 4.9,
    reviews: 98,
    price: 8200,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    badge: "Top Rated",
    tag: "",
    duration: 10,
    languages: ["English"],
    location: "USA",
  },
  {
    name: "John Lee",
    title: "Custom AI website development",
    rating: 5.0,
    reviews: 87,
    price: 13400,
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    badge: "Level 1",
    tag: "",
    duration: 14,
    languages: ["English", "Chinese"],
    location: "China",
  },
  {
    name: "Sara Kim",
    title: "Frontend & backend web solutions",
    rating: 4.8,
    reviews: 110,
    price: 9900,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    badge: "",
    tag: "",
    duration: 5,
    languages: ["English", "French"],
    location: "France",
  },
  {
    name: "David Miller",
    title: "E-commerce & business website expert",
    rating: 5.0,
    reviews: 75,
    price: 12000,
    image: "https://randomuser.me/api/portraits/men/23.jpg",
    badge: "Level 2",
    tag: "",
    duration: 12,
    languages: ["English", "German"],
    location: "Germany",
  },
  {
    name: "Emily Clark",
    title: "React & Node.js full stack developer",
    rating: 4.7,
    reviews: 60,
    price: 10500,
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    badge: "",
    tag: "",
    duration: 8,
    languages: ["English", "Spanish"],
    location: "Spain",
  },
  {
    name: "Mohit Verma",
    title: "Custom web app & API developer",
    rating: 5.0,
    reviews: 140,
    price: 11500,
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    badge: "Level 2",
    tag: "",
    duration: 6,
    languages: ["English", "Hindi"],
    location: "India",
  },
  {
    name: "Anna Petrova",
    title: "Modern UI/UX & web development",
    rating: 4.9,
    reviews: 102,
    price: 9800,
    image: "https://randomuser.me/api/portraits/women/50.jpg",
    badge: "",
    tag: "",
    duration: 9,
    languages: ["English", "Russian"],
    location: "Russia",
  },
  {
    name: "Carlos Diaz",
    title: "Full stack solutions for your business",
    rating: 4.8,
    reviews: 88,
    price: 8700,
    image: "https://randomuser.me/api/portraits/men/77.jpg",
    badge: "",
    tag: "",
    duration: 11,
    languages: ["English", "Spanish"],
    location: "Spain",
  },
  {
    name: "Linda Wang",
    title: "Professional website & dashboard dev",
    rating: 5.0,
    reviews: 99,
    price: 11200,
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    badge: "Top Rated",
    tag: "",
    duration: 13,
    languages: ["English", "Chinese"],
    location: "China",
  },
  {
    name: "Ravi Patel",
    title: "Backend APIs & scalable web apps",
    rating: 4.9,
    reviews: 70,
    price: 9300,
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    badge: "",
    tag: "",
    duration: 7,
    languages: ["English", "Hindi"],
    location: "India",
  },
  {
    name: "Julia Smith",
    title: "Landing pages & business websites",
    rating: 5.0,
    reviews: 55,
    price: 7800,
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    badge: "",
    tag: "",
    duration: 6,
    languages: ["English", "French"],
    location: "France",
  },
];

function GigList() {
  const [duration, setDuration] = useState(7); // Changed back to single value
  const [price, setPrice] = useState({ min: 0, max: 20000 });
  const [language, setLanguage] = useState("Any");
  const [location, setLocation] = useState("Any");
  const [sortBy, setSortBy] = useState("recent"); // Default sort by recent
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const filtersRef = useRef();

  const width = useScreenWidth();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  const handleFilter = () => {
    filtersRef.current.classList.toggle("responsive_filters");
  };

  const handleSort = () => {
    setShowSort(!showSort);
  };

  const handleDurationChange = (event, newValue) => {
    setDuration(newValue);
  };

  const handlePriceChange = (event, newValue) => {
    setPrice({ min: newValue[0], max: newValue[1] });
  };

  const formatDuration = (value) => {
    return `${value} day${value === 1 ? "" : "s"}`;
  };

  const formatPrice = (value) => {
    return `₹${value.toLocaleString()}`;
  };

  const filtered = dummyFreelancers
    .filter(
      (f) =>
        (duration === 7 || f.duration <= duration) &&
        f.price >= price.min &&
        f.price <= price.max &&
        (language === "Any" || f.languages.includes(language)) &&
        (location === "Any" || f.location === location) &&
        (f.title.toLowerCase().includes(searchQuery) || f.name.toLowerCase().includes(searchQuery))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "duration-asc":
          return a.duration - b.duration;
        case "duration-desc":
          return b.duration - a.duration;
        case "recent":
        default:
          return 0;
      }
    });


  return (
    <div className="gig-list-container mt-18">
      <div className="gig-filters-container">
        <div className="sorting-btns">
          <button className="filters-btn" onClick={handleFilter}>
            Filters
          </button>
          <button className="filters-btn" onClick={handleSort}>
            Sort{" "}
          </button>
        </div>
        <div className="gig-filters" ref={filtersRef}>
          <div className="gig-filter-group">
            <label>Duration:</label>
            <Box sx={{ width: 160, px: 1 }}>
              <Slider
                value={duration}
                onChange={handleDurationChange}
                min={1}
                max={7}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={formatDuration}
                sx={{
                  color: "var(--primary-color)",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "var(--primary-color)",
                    width: 12,
                    height: 12,
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "var(--primary-color)",
                    height: 3,
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "var(--light-border-color)",
                    height: 3,
                  },
                  "& .MuiSlider-valueLabel": {
                    fontSize: "0.75rem",
                    padding: "2px 4px",
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: "var(--text-color)",
                  mt: 0.5,
                  fontSize: "0.8rem",
                }}
              >
                {formatDuration(duration)}
              </Typography>
            </Box>
          </div>
          <div className="gig-filter-group">
            <label>Price:</label>
            <Box sx={{ width: 160, px: 1 }}>
              <Slider
                value={[price.min, price.max]}
                onChange={handlePriceChange}
                min={0}
                max={20000}
                step={500}
                valueLabelDisplay="auto"
                valueLabelFormat={formatPrice}
                sx={{
                  color: "var(--primary-color)",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "var(--primary-color)",
                    width: 12,
                    height: 12,
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "var(--primary-color)",
                    height: 3,
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "var(--light-border-color)",
                    height: 3,
                  },
                  "& .MuiSlider-valueLabel": {
                    fontSize: "0.75rem",
                    padding: "2px 4px",
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: "var(--text-color)",
                  mt: 0.5,
                  fontSize: "0.8rem",
                }}
              >
                {price.min === 0 && price.max === 20000
                  ? "Any Price"
                  : `${formatPrice(price.min)} - ${formatPrice(price.max)}`}
              </Typography>
            </Box>
          </div>
          <div className="gig-filter-group">
            <label>Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {allLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div className="gig-filter-group">
            <label>Location:</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
        {width <= 1024 ? (
          showSort && (
            <div className="gig-sorting">
              <h3>Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Recent</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration-asc">Duration: Short to Long</option>
                <option value="duration-desc">Duration: Long to Short</option>
              </select>
            </div>
          )
        ) : (
          <div className="gig-sorting">
            <h3>Sort By</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Recent</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Duration: Short to Long</option>
              <option value="duration-desc">Duration: Long to Short</option>
            </select>
          </div>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="no-freelancers-message">
          No freelancers found matching your filters.
        </div>
      ) : (
        <div className="gig-list-grid">
          {filtered.map((f, i) => (
            <Link href={`/gigDetails`} key={i}>
              <GigCard f={f} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default GigList;
