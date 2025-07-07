"use client";
import React, { useState } from 'react';
import { packages } from "@/utils/constants"

const GigPackage = ({ gig = {}, basePrice, standardPrice, premiumPrice, currency = '₹', description, deliveryTime, gigId }) => {
  //console.log('GigPackage received gig:', gig); // Added console log
    const [activeTab, setActiveTab] = useState('premium'); // Default to Premium as in the first screenshot

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

                <button className="continue-button">Continue</button>
                <button className="contact-button">Contact Me</button>
                <p className="gig-id-display">Gig ID: {currentPackage.gig_id}</p>
            </div>
    </div>
  );
}

export default GigPackage