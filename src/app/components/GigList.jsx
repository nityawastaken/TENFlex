"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { gigService } from '@/utils/services';
import { authService } from '@/utils/auth';

// A simple debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function GigList() {
  const searchParams = useSearchParams();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({});

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // Combine debounced search term with other filters
    const combinedFilters = {
      ...filters,
      search: debouncedSearchTerm,
    };
    fetchGigs(combinedFilters);
  }, [debouncedSearchTerm, filters]); // Re-run effect when debounced search or other filters change

  const fetchGigs = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);

      // Remove empty search filter to avoid sending an empty query
      const activeFilters = { ...currentFilters };
      if (!activeFilters.search) {
        delete activeFilters.search;
      }
      
      const data = await gigService.getAllGigs(activeFilters);
      setGigs(data);
    } catch (err) {
      console.error('Error fetching gigs:', err);
      setError(err.message || 'Failed to fetch gigs');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array because it gets all it needs from args

  const handleFilterChange = (newFilters) => {
    // This handles instant filters like dropdowns
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearchChange = (event) => {
    // This updates the search term instantly for the input field
    setSearchTerm(event.target.value);
  };

  if (loading && gigs.length === 0) { // Only show full-page loader on initial load
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Loading gigs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
        <button 
          onClick={() => fetchGigs({ ...filters, search: debouncedSearchTerm })}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Gigs</h1>
        
        {/* Filter Controls */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search gigs..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-1/3"
          />
          <select
            onChange={(e) => handleFilterChange({ ordering: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sort by</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="created_at">Newest First</option>
            <option value="-created_at">Oldest First</option>
          </select>
          {loading && <div className="text-gray-500">Searching...</div>}
        </div>
      </div>

      {/* Gigs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((gig) => (
          <div key={gig.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {gig.gig_picture && (
              <img
                src={gig.gig_picture}
                alt={gig.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {gig.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {gig.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-600">
                  ${gig.price}
                </span>
                <span className="text-sm text-gray-500">
                  {gig.delivery_time} days delivery
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {gig.freelancer?.profile_picture && (
                    <img
                      src={gig.freelancer.profile_picture}
                      alt={gig.freelancer.username}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <span className="text-sm text-gray-700">
                    {gig.freelancer?.username || 'Unknown'}
                  </span>
                </div>
                
                {gig.avg_rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600 ml-1">
                      {gig.avg_rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {gigs.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-8">
          <p>No gigs found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
} 