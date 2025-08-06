// components/Footer.js
import React from "react";
import Link from "next/link";
import { FaLinkedinIn, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-4 border-t border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          
          {/* About TENFlex */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-2 text-[#A020F0]">About TENFlEx</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-2">
              TENFlex is a modern freelancing platform that connects talented professionals with clients worldwide. 
              We provide a seamless experience for both freelancers to showcase their skills and clients to find 
              the perfect talent for their projects.
            </p>
            <div className="text-sm text-gray-400">
              <p>📍 Based in India</p>
              <p>📧 support@tenflex.com</p>
              <p>🕒 Business Hours: Mon-Fri 9AM-6PM IST</p>
            </div>
          </div>

          {/* What We Offer */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-[#A020F0]">What We Offer</h3>
            <div className="space-y-2 text-sm">
              <div>
                <h4 className="font-semibold text-purple-300 mb-1">For Freelancers</h4>
                <ul className="text-gray-300 space-y-0.5">
                  <li>• Create and showcase your gigs</li>
                  <li>• Connect with global clients</li>
                  <li>• Secure payment system</li>
                  <li>• Build your portfolio</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-300 mb-1">For Clients</h4>
                <ul className="text-gray-300 space-y-0.5">
                  <li>• Browse talented professionals</li>
                  <li>• Quality work guaranteed</li>
                  <li>• Easy project management</li>
                  <li>• Transparent pricing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Developers Section */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-[#A020F0]">Developed By</h3>
            <div className="space-y-2">
              <div className="bg-gray-800/50 rounded-lg p-2">
                <h4 className="font-semibold text-purple-300 text-sm mb-1">Frontend Team</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Rishi Devrana</span>
                    <div className="flex space-x-2">
                      <Link href="https://www.linkedin.com/in/rishidevrana/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#A020F0] transition-colors">
                        <FaLinkedinIn size={12} />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Ninad Arakh</span>
                    <div className="flex space-x-2">
                      <Link href="https://www.linkedin.com/in/ninad-arakh-277747237/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#A020F0] transition-colors">
                        <FaLinkedinIn size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-2">
                <h4 className="font-semibold text-purple-300 text-sm mb-1">Backend Team</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Mehnaz Ali</span>
                    <div className="flex space-x-2">
                      <Link href="https://www.linkedin.com/in/mehnaz-ali-7b4764282/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#A020F0] transition-colors">
                        <FaLinkedinIn size={12} />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Nitya Ruparel</span>
                    <div className="flex space-x-2">
                      <Link href="https://www.linkedin.com/in/nityaruparel/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#A020F0] transition-colors">
                        <FaLinkedinIn size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-gray-800">
          <div className="flex items-center mb-2 md:mb-0">
            <h1 className="font-bold tracking-wider text-2xl text-white">
              TENFLE<span className="text-[#A020F0]">x</span>
            </h1>
            <span className="ml-4 text-sm text-gray-400">
              ©️ {new Date().getFullYear()} TENFlex. All rights reserved. | Privacy Policy | Terms of Service
            </span>
          </div>

          {/* Removed all icons from the bottom row */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;