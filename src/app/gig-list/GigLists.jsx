"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/app/gig-list/GigList.css";
import useScreenWidth from "@/Hooks/useScreenWidth";
import { Slider, Box, Typography } from "@mui/material";
import GigCard from "@/app/components/GigCard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { gigService } from "@/utils/services";
import { useRouter } from "next/router";
import { CLOUDINARY_URL } from "@/utils/constants";

// Remove hardcoded language array and add state for dynamic data
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

function GigLists() {
  const [duration, setDuration] = useState(100); // Changed from 7 to 100 (Any)
  const [price, setPrice] = useState({ min: 0, max: 20000 });

  const [category, setCategory] = useState("Any");
  const [sortBy, setSortBy] = useState("recent");
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [showSort, setShowSort] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  const [categories, setCategories] = useState([]);


  const filtersRef = useRef();
  const width = useScreenWidth();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  // const router = useRouter()
  // const {query} = router;
  // const searchQuery = query.search?.toLowerCase() || ""; 
  // console.log("searchQuery : ", searchQuery)


  // Apply dark mode immediately on mount
  useEffect(() => {
    // Force dark mode immediately
    document.body.classList.add("dark-mode");
    setIsHydrated(true);
    
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.body.classList.remove("dark-mode");
    } else {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        // Fetch categories
        const categoriesResponse = await fetch(`${apiHost}/base/categories/`);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          // Extract category names, handling both string and object formats
          const categoryNames = categoriesData.map(cat => {
            if (typeof cat === 'string') return cat;
            return cat.name || cat;
          });
          setCategories(['Any', ...categoryNames]);
          // console.log('Fetched categories:', categoryNames);
        }
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
        // Fallback to default options if API fails
        setCategories(['Any', 'Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing', 'Video', 'Audio']);
      }
    };
    
    fetchFilterOptions();
  }, []);


  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      setError(null);
      try {
        let filters = {};
        if (searchQuery.trim() !== "") {
          filters.search = searchQuery;
        }
        

        
        const backendGigs = await gigService.getAllGigs(filters);
        
        const mapped = backendGigs.map(gig => {
          return {
            id: gig.id,
            name: gig.freelancer || "Unknown",
            title: gig.title || "Untitled",
            description: gig.description || "",
            rating: gig.avg_rating ?? 0,
            avg_rating: gig.avg_rating ?? 0,
            reviews: gig.review_count ?? 0,
            price: gig.price ?? 0,
            image: gig.picture_url
              ? (gig.picture_url.startsWith("http")
                  ? gig.picture_url
                  : `${CLOUDINARY_URL}/${gig.picture}/`)
              : "https://via.placeholder.com/300x200?text=No+Image",
            badge: "",
            tag: "",
            duration: gig.delivery_time ?? 0,
            delivery_time: gig.delivery_time ?? 0,
            languages: ["English"],
            freelancer_id: gig.freelancer_id,
            categories: gig.categories || [],
            created_at: gig.created_at || new Date().toISOString(),
            location: gig.location || "Any",
          };
        });
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
    if (value === 100) return "Any";
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

  // Update the filter logic to use correct field names
  const filtered = gigs.filter((gig) => {
    // We don't need to filter by search query here as it's handled by the backend
    const matchesDuration = duration === 100 || gig.delivery_time <= duration;
    
    const matchesPrice = (gig.price >= price.min && gig.price <= price.max);
        
        // Check if the selected language matches either the name or code
        // Use case-insensitive comparison
    // Language filtering is now handled by the backend
    const matchesCategory = category === "Any" || 
      (gig.categories && gig.categories.some(cat => {
        const catName = typeof cat === 'string' ? cat : (cat.name || '');
        return catName === category;
      }));
    
    return matchesDuration && matchesPrice && matchesCategory;
  }).sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "duration-asc":
        return a.delivery_time - b.delivery_time;
        case "duration-desc":
        return b.delivery_time - a.delivery_time;
        case "rating-desc":
        return b.avg_rating - a.avg_rating;
        case "rating-asc":
        return a.avg_rating - b.avg_rating;
        case "recent":
        default:
        return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="gig-list-container mt-18" style={{ 
        backgroundColor: '#000000', 
        color: '#FFFFFF',
        minHeight: '100vh',
        padding: '20px 0'
      }}>
        <div className="flex justify-center items-center min-h-[200px]">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="gig-list-container mt-18" style={{ 
        backgroundColor: '#000000', 
        color: '#FFFFFF',
        minHeight: '100vh',
        padding: '20px 0'
      }}>
        <div className="flex justify-center items-center min-h-[200px]">Loading gigs...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="gig-list-container mt-18" style={{ 
        backgroundColor: '#000000', 
        color: '#FFFFFF',
        minHeight: '100vh',
        padding: '20px 0'
      }}>
        <div className="text-center text-red-600 p-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="gig-list-container mt-18">
      <div className="gig-filters-container">
        <div className="gig-filters-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <div className="gig-filters-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', flex: '1' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-color)",
                  fontSize: "0.8rem",
                }}
              >
                  {duration === 100 ? "Any" : formatDuration(duration)}
              </Typography>
                {duration !== 100 && (
                  <button
                    onClick={() => setDuration(100)}
                    style={{
                      background: 'none',
                      border: '1px solid var(--primary-color)',
                      color: 'var(--primary-color)',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '0.7rem',
                      cursor: 'pointer'
                    }}
                  >
                    Any
                  </button>
                )}
              </div>
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

          <div className="gig-filter-group" style={{ minWidth: '120px' }}>
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                // console.log('Selected category:', e.target.value);
              }}
              style={{ width: '120px' }}
            >
              {categories.map((cat) => {
                const catValue = typeof cat === 'string' ? cat : (cat.name || cat);
                return (
                  <option key={catValue} value={catValue}>
                    {catValue}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div className="gig-filter-group" style={{ marginLeft: 'auto' }}>
            <label>Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ minWidth: '160px' }}>
              <option value="recent">Recent</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Duration: Short to Long</option>
              <option value="duration-desc">Duration: Long to Short</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
            </select>
          </div>
          </div>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="no-freelancers-message">
          No gigs found matching your filters.
        </div>
      ) : (
        <div className="gig-list-grid">
          {filtered.map((f, i) => {
            // console.log('Gig in list:', f);
            return (
              <Link href={`/gigDetails/${f.id}/`} key={i}>
              <GigCard f={f} />
            </Link>
            );
          })}
          {/* {console.log("filtered  : ", filtered)} */}
        </div>
      )}
    </div>
  );
}

export default GigLists;
