"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/app/gig-list/GigList.css";
import useScreenWidth from "@/Hooks/useScreenWidth";
import { Slider, Box, Typography } from "@mui/material";
import GigCard from "@/app/components/GigCard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { gigService } from "@/utils/services";

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

function GigList() {
  const [duration, setDuration] = useState(7);
  const [price, setPrice] = useState({ min: 0, max: 20000 });
  const [language, setLanguage] = useState("Any");
  const [location, setLocation] = useState("Any");
  const [sortBy, setSortBy] = useState("recent");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtersRef = useRef();
  const width = useScreenWidth();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      setError(null);
      try {
        let filters = {};
        if (searchQuery.trim() !== "") {
          filters.search = searchQuery;
        }
        console.log("Fetching gigs from backend with filters:", filters);
        const backendGigs = await gigService.getAllGigs(filters);
        console.log("Backend gigs response:", backendGigs);
        const mapped = backendGigs.map(gig => ({
          id: gig.id,
          name: gig.freelancer || "Unknown",
          title: gig.title || "Untitled",
          rating: gig.avg_rating ?? 0,
          reviews: gig.review_count ?? 0,
          price: gig.price ?? 0,
          image: gig.picture
            ? (gig.picture.startsWith("http")
                ? gig.picture
                : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${gig.picture}`)
            : "https://via.placeholder.com/300x200?text=No+Image",
          badge: "",
          tag: "",
          duration: gig.delivery_time ?? 0,
          languages: ["English"],
          location: "Any",
        }));
        console.log('Mapped gigs:', mapped);
        setGigs(mapped);
      } catch (err) {
        setError("Failed to fetch gigs");
        console.error("Error fetching gigs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, [searchQuery]);

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      setSearchTerm(event.target.value);
    }
  };

  const filtered = gigs
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
        case "rating-desc":
          return b.rating - a.rating;
        case "rating-asc":
          return a.rating - b.rating;
        case "recent":
        default:
          return 0;
      }
    });

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading gigs...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

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
                <option value="rating-desc">Rating: High to Low</option>
                <option value="rating-asc">Rating: Low to High</option>
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
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
            </select>
          </div>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="no-freelancers-message">
          No gigs found matching your filters.
        </div>
      ) : (
        <div className="gig-list-grid">
          {filtered.map((f, i) => {
            console.log('Gig in list:', f);
            return (
              <Link href={`/gigDetails/${f.id}`} key={i}>
              <GigCard f={f} />
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GigList;
