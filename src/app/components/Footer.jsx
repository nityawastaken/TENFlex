// components/Footer.js
import React from "react";
import Link from "next/link";
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa"; // Ensure react-icons is installed

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      {/* ... (rest of your footer content) ... */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#A020F0]">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">About TENFLEX</Link></li>
              <li><Link href="/careers" className="hover:text-[#A020F0]  hover:ml-2 transition-all duration-200">Careers</Link></li>
              <li><Link href="/press-news" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Press & News</Link></li>
              <li><Link href="/partnerships" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Partnerships</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#A020F0]">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories/website-design" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Website Design</Link></li>
              <li><Link href="/categories/ai-services" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">AI Services</Link></li>
              <li><Link href="/categories/logo-design" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Logo Design</Link></li>
              <li><Link href="/categories/video-editing" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Video Editing</Link></li>
              <li><Link href="/categories/content-writing" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Content Writing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#A020F0]">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help-support" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Help & Support</Link></li>
              <li><Link href="/trust-safety" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Trust & Safety</Link></li>
              <li><Link href="/selling-on-tenflex" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Selling on TENFLEX</Link></li>
              <li><Link href="/buying-on-tenflex" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Buying on TENFLEX</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#A020F0]">Community</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Events</Link></li>
              <li><Link href="/blog" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Blog</Link></li>
              <li><Link href="/forum" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Forum</Link></li>
              <li><Link href="/affiliates" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Affiliates</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#A020F0]">More From TENFLEX</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tenflex-pro" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">TENFLEX Pro</Link></li>
              <li><Link href="/tenflex-studios" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">TENFLEX Studios</Link></li>
              <li><Link href="/guides" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Guides</Link></li>
              <li><Link href="/invite-a-friend" className="hover:text-[#A020F0] hover:ml-2 transition-all duration-200">Invite a Friend</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="font-bold tracking-wider text-2xl text-white">
              TENFLE<span className="text-[#A020F0]">x</span>
            </h1>
            <span className="ml-6 text-sm text-gray-400">©️ {new Date().getFullYear()} TENFLEX Inc. All rights reserved.</span>
          </div>

          <div className="flex space-x-6">
            <Link href="https://twitter.com/your_tenflex" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#A020F0] transition-colors">
              <FaTwitter size={20} />
            </Link>
            <Link href="https://facebook.com/your_tenflex" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#A020F0] transition-colors">
              <FaFacebookF size={20} />
            </Link>
            <Link href="https://linkedin.com/company/your_tenflex" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#A020F0] transition-colors">
              <FaLinkedinIn size={20} />
            </Link>
            <Link href="https://instagram.com/your_tenflex" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#A020F0] transition-colors">
              <FaInstagram size={20} />
            </Link>
            <Link href="https://youtube.com/your_tenflex" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#A020F0] transition-colors">
              <FaYoutube size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;