"use client";

// page to display the popular services
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import GigCard from "@/app/components/GigCard";
import "@/app/gig-list/GigList.css";

const PopularServices = () => {
    const [popularGigs, setPopularGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Ensure dark mode is applied
        document.body.classList.add("dark-mode");
        
        const fetchPopularGigs = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/popular-gigs/`);
                
                if (response.status === 200) {
                    // Transform the data to match the GigCard component's expected format
                    const transformedGigs = response.data.map(gig => ({
                        id: gig.id,
                        name: gig.freelancer || "Unknown",
                        title: gig.title || "Untitled",
                        rating: gig.avg_rating ?? 0,
                        reviews: gig.review_count ?? 0,
                        price: gig.price ?? 0,
                        duration: gig.delivery_time ?? 1,
                        image: gig.picture || null,
                        freelancer_profile_picture: null, // Will use gig image as fallback
                        badge: null,
                        tag: null
                    }));
                    
                    setPopularGigs(transformedGigs);
                    // console.log("Popular gigs fetched:", transformedGigs);
                }
            } catch (err) {
                console.error("Error fetching popular gigs:", err);
                setError("Failed to load popular services");
                // Fallback to empty array
                setPopularGigs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularGigs();
    }, []);

    const handleGigClick = (gigId) => {
        router.push(`/gigDetails/${gigId}`);
    };

    // Fallback services if API fails or no data
    const fallbackServices = [
        {
            id: 1,
            name: "WebDevPro",
            title: "Professional Web Development",
            rating: 4.5,
            reviews: 12,
            price: 5000,
            duration: 7,
            image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            freelancer_profile_picture: null,
            badge: null,
            tag: null
    },
    {
            id: 2,
            name: "MobileExpert",
            title: "iOS & Android App Development",
            rating: 4.2,
            reviews: 8,
            price: 8000,
            duration: 14,
            image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
            freelancer_profile_picture: null,
            badge: null,
            tag: null
        },
        {
            id: 3,
            name: "MarketingGuru",
            title: "Digital Marketing Strategy",
            rating: 4.7,
            reviews: 15,
            price: 3000,
            duration: 5,
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            freelancer_profile_picture: null,
            badge: null,
            tag: null
        },
        {
            id: 4,
            name: "DesignMaster",
            title: "UI/UX Design Excellence",
            rating: 4.8,
            reviews: 20,
            price: 4000,
            duration: 10,
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
            freelancer_profile_picture: null,
            badge: null,
            tag: null
    },
];

    // Use API data if available, otherwise use fallback only if there's an error
    const displayServices = popularGigs.length > 0 ? popularGigs : (error ? fallbackServices : []);

    return (
        <div className="gig-list-container">
            <div className="relative w-fit mx-6 mt-8 mb-6">
                <h2 className="text-3xl font-bold text-left text-white">Popular Services</h2>
                <div
                    className="absolute left-0 bottom-0 h-1 bg-purple-500 rounded"
                    style={{ width: "60%" }}
                />
            </div>

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-gray-300">Loading popular services...</span>
                </div>
            )}

            {error && (
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mx-6 mb-6">
                    <p className="text-yellow-300 text-sm">
                        {error} - Showing sample services instead.
                    </p>
                </div>
            )}

            {/* Only show gig cards if not loading and we have data */}
            {!loading && displayServices.length > 0 && (
                <div className="gig-list-grid" style={{ padding: '0 12px' }}>
                    {displayServices.map((gig, idx) => (
                        <div
                            key={gig.id || idx}
                            onClick={() => popularGigs.length > 0 && gig.id ? handleGigClick(gig.id) : null}
                            style={{ cursor: popularGigs.length > 0 ? 'pointer' : 'default' }}
                        >
                            <GigCard f={gig} />
                        </div>
                    ))}
                </div>
            )}

            {/* Show message if no services available and not loading */}
            {!loading && displayServices.length === 0 && !error && (
                <div className="flex justify-center items-center py-12">
                    <p className="text-gray-400">No popular services available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default PopularServices;
