"use client";
import React, { useState } from 'react';
import { packages } from "@/utils/constants"

const GigPackage = ({gig}) => {
  //console.log('GigPackage received gig:', gig); // Added console log
    const [activeTab, setActiveTab] = useState('premium'); // Default to Premium as in the first screenshot

    const currentPackage = packages[activeTab];

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
                    <span className="package-price">{gig.currency}{currentPackage.price}</span>
                </div>

                {activeTab === 'basic' && (
                    <p className="delivery-text">{currentPackage.delivery_text}</p>
                )}
                {activeTab !== 'basic' && currentPackage.description && (
                    <p>{currentPackage.description}</p>
                )}
                {activeTab !== 'basic' && (currentPackage.delivery_time || currentPackage.revisions) && (
                    <div className="package-delivery-info">
                        {currentPackage.delivery_time && <span>{currentPackage.delivery_time}</span>}
                        {currentPackage.revisions && <span>{currentPackage.revisions}</span>}
                    </div>
                )}

                <button className="continue-button">Continue {currentPackage.continue_price_display}</button>
                <button className="contact-button">Contact Me</button>
                <p className="gig-id-display">Gig ID: {currentPackage.gig_id}</p>
            </div>
    </div>
  );
}

export default GigPackage