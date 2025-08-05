"use client";
import React, { useState, useEffect, useRef } from 'react';
import { packages } from "@/utils/constants"
import axios from 'axios';
import { useRouter } from 'next/navigation';

const GigPackage = ({ gig = {}, basePrice, standardPrice, premiumPrice, currency = '₹', description, deliveryTime, gigId }) => {
  //console.log('GigPackage received gig:', gig); // Added console log
    const [activeTab, setActiveTab] = useState('premium'); // Default to Premium as in the first screenshot
    const [isOrdering, setIsOrdering] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderError, setOrderError] = useState('');
    const router = useRouter();
    const orderInProgress = useRef(false); // Prevent multiple simultaneous orders

    // Get current user on component mount
    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString) {
            try {
                const user = JSON.parse(userString);
                console.log('GigPackage - User data loaded:', user);
                console.log('GigPackage - is_freelancer field:', user.is_freelancer);
                console.log('GigPackage - userType field:', user.userType);
                setCurrentUser(user);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        } else {
            console.log('GigPackage - No user data found in localStorage');
        }
    }, []);

    // Build package data dynamically if basePrice etc. are provided
    const base = Math.round(basePrice ?? gig.price ?? 0);
    const dynamicPackages = {
        basic: {
            title: 'Basic Web Application',
            price: base,
            description: 'Interactive 5 Page Design & Development + Basic API Integration + Essential Functionality',
            delivery_time: deliveryTime ? `${deliveryTime} day${deliveryTime === 1 ? '' : 's'} delivery` : '',
            revisions: '2 Revisions',
            gig_id: gigId || gig.id || '',
        },
        standard: {
            title: 'Standard Web Application',
            price: base + 2000,
            description: 'Interactive 10 Page Design & Development + Redux + Advanced API Integration + Medium Functionality',
            delivery_time: deliveryTime ? `${deliveryTime + 2} days delivery` : '',
            revisions: '5 Revisions',
            gig_id: gigId || gig.id || '',
        },
        premium: {
            title: 'Premium Web Application',
            price: base + 5000,
            description: 'Interactive 15 Page Design & Development + Redux + Advanced API Integration + Medium Functionality',
            delivery_time: deliveryTime ? `${deliveryTime + 5} days delivery` : '',
            revisions: 'Unlimited Revisions',
            gig_id: gigId || gig.id || '',
        },
    };

    const currentPackage = dynamicPackages[activeTab];

    const handleOrder = async () => {
        // Prevent multiple simultaneous orders
        if (orderInProgress.current) {
            console.log('Order already in progress, ignoring click');
            return;
        }

        // Reset previous states
        setOrderSuccess(false);
        setOrderError('');

        // Check if user is logged in
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        console.log('Order attempt - Token exists:', !!token, 'User exists:', !!user);
        
        if (!token || !user) {
            setOrderError('Please log in to place an order');
            setTimeout(() => {
                router.push('/signin');
            }, 2000);
            return;
        }

        try {
            orderInProgress.current = true;
            setIsOrdering(true);
            
            const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const orderData = { status: "pending" };
            
            console.log('Making order request to:', `${apiHost}/base/orders/gigs/${currentPackage.gig_id}/book/`);
            console.log('Order data:', orderData);
            console.log('Gig ID:', currentPackage.gig_id);
            
            const response = await axios.post(
                `${apiHost}/base/orders/gigs/${currentPackage.gig_id}/book/`,
                orderData,
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Order response:', response);
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);

            if (response.status === 201) {
                setOrderSuccess(true);
                setOrderError('');
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    setOrderSuccess(false);
                }, 5000);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            
            if (error.response?.status === 403) {
                setOrderError('Freelancers cannot place orders. Please use a client account.');
            } else if (error.response?.status === 401) {
                setOrderError('User ID or token not found, please login again');
                // Clear invalid auth data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setTimeout(() => {
                    router.push('/signin');
                }, 2000);
            } else if (error.response?.status === 400) {
                setOrderError('Invalid request. Please check your order details.');
            } else {
                setOrderError('Failed to place order. Please try again.');
            }
            
            // Hide error message after 5 seconds
            setTimeout(() => {
                setOrderError('');
            }, 5000);
        } finally {
            setIsOrdering(false);
            orderInProgress.current = false;
        }
    };

    // Check if user is a client (not a freelancer)
    const isClient = currentUser && !currentUser.is_freelancer;
    
    // Debug logging for user type detection
    console.log('GigPackage - Current user:', currentUser);
    console.log('GigPackage - is_freelancer value:', currentUser?.is_freelancer);
    console.log('GigPackage - isClient calculated:', isClient);
    console.log('GigPackage - Should show order button:', isClient);
    console.log('GigPackage - Should show freelancer message:', currentUser && currentUser.is_freelancer);

  return (
        <div className="gig-sidebar ">
            <div className="package-tabs">
                <button 
                    className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
                    onClick={() => setActiveTab('basic')}
                >
                    Basic
                </button>
                <button 
                    className={`tab-button ${activeTab === 'standard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('standard')}
                >
                    Standard
                </button>
                <button 
                    className={`tab-button ${activeTab === 'premium' ? 'active' : ''}`}
                    onClick={() => setActiveTab('premium')}
                >
                    Premium
                </button>
            </div>
            <div className="package-details fade-in" key={activeTab}>
                <div className="package-header scale-in">
                    <h3>{currentPackage.title}</h3>
                    <span className="package-price">{currency}{currentPackage.price}</span>
                </div>

                {currentPackage.description && (
                    <p>{currentPackage.description}</p>
                )}
                {(currentPackage.delivery_time || currentPackage.revisions) && (
                    <div className="package-delivery-info">
                        {currentPackage.delivery_time && <span>{currentPackage.delivery_time}</span>}
                        {currentPackage.revisions && <span>{currentPackage.revisions}</span>}
                    </div>
                )}

                {/* Only show Order button for clients */}
                {isClient && (
                    <div className="order-section">
                        <button 
                            className="continue-button" 
                            onClick={handleOrder}
                            disabled={isOrdering}
                        >
                            {isOrdering ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ animationDuration: '1.5s' }}>
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Placing Order...
                                </>
                            ) : (
                                'Order Now'
                            )}
                        </button>
                        
                        {/* Success Message */}
                        {orderSuccess && (
                            <div className="mt-3 p-3 bg-green-600/20 border border-green-500/50 rounded-lg">
                                <div className="flex items-center text-green-400">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium">Order placed successfully! Your order has been confirmed and the freelancer has been notified.</span>
                                </div>
                            </div>
                        )}
                        
                        {/* Error Message */}
                        {orderError && (
                            <div className="mt-3 p-3 bg-red-600/20 border border-red-500/50 rounded-lg">
                                <div className="flex items-center text-red-400">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium">{orderError}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Show message for freelancers */}
                {currentUser && currentUser.is_freelancer && (
                    <div className="text-center py-3">
                        <p className="text-gray-500 text-sm">
                            Freelancers cannot place orders
                        </p>
                    </div>
                )}
            </div>
    </div>
  );
}

export default GigPackage