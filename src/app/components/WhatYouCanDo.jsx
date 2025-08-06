"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Briefcase, 
  Users, 
  Star, 
  MessageSquare, 
  FileText, 
  DollarSign, 
  Clock, 
  Shield, 
  TrendingUp,
  Code,
  Palette,
  Camera,
  Mic,
  Globe,
  Zap
} from 'lucide-react';

const WhatYouCanDo = () => {
  const [activeTab, setActiveTab] = useState('client');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Don't render the component if user is authenticated
  if (isLoading) {
    return null; // Show nothing while checking authentication
  }

  if (isAuthenticated) {
    return null; // Don't show this section for signed-in users
  }

  const clientFeatures = [
    {
      icon: Search,
      title: "Find Perfect Services",
      description: "Browse thousands of professional services from verified freelancers across all categories",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Star,
      title: "Quality Assurance",
      description: "Choose from top-rated freelancers with proven track records and client reviews",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: FileText,
      title: "Gig List",
      description: "Save your favorite gigs to a personalized list for easy access and quick booking",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Pay securely with our protected payment system. Only pay when you're satisfied",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "Add Project Post",
      description: "Post your project requirements and get proposals from qualified freelancers",
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: Clock,
      title: "Project Management",
      description: "Track project progress, manage revisions, and maintain all project files in one place",
      color: "from-purple-500 to-indigo-600"
    }
  ];

  const freelancerFeatures = [
    {
      icon: Briefcase,
      title: "Showcase Your Skills",
      description: "Create professional gigs to showcase your expertise and attract clients worldwide",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: DollarSign,
      title: "Bidding System",
      description: "Submit competitive bids on projects and win work that matches your skills and rates",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Earn More",
      description: "Set your own rates and earn competitive income doing what you love",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: Star,
      title: "Build Portfolio",
      description: "Grow your professional portfolio with diverse projects and client testimonials",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Flexible Work",
      description: "Work on your own schedule from anywhere in the world",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Access projects from international clients and build a global reputation",
      color: "from-teal-500 to-blue-600"
    }
  ];

  const handleHireTalentClick = () => {
    // Store the selected option for client signup
    localStorage.setItem('signupType', 'client');
    router.push('/signup');
  };

  const handleStartFreelancingClick = () => {
    // Store the selected option for freelancer signup
    localStorage.setItem('signupType', 'freelancer');
    router.push('/signup');
  };

  return (
    <section className="py-20 relative overflow-hidden" data-section="what-you-can-do">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What You Can Do on{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TENFLEx
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Whether you're looking to hire talented professionals or showcase your skills to the world, 
            TENFLEX provides the perfect platform for both clients and freelancers.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50">
            {/* Sliding Background Indicator */}
            <div 
              className={`absolute top-2 bottom-2 rounded-xl transition-all duration-700 ease-out ${
                activeTab === 'client' 
                  ? 'left-2 w-[calc(50%-8px)] bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'left-[calc(50%-4px)] w-[calc(50%-8px)] bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
              style={{
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
            
            <div className="relative flex">
              <button
                onClick={() => setActiveTab('client')}
                className={`relative px-8 py-3 rounded-xl font-semibold transition-all duration-500 ease-out z-10 ${
                  activeTab === 'client'
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={{
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <Users className="inline-block w-5 h-5 mr-2 transition-transform duration-300 ease-out" />
                For Clients
              </button>
              <button
                onClick={() => setActiveTab('freelancer')}
                className={`relative px-8 py-3 rounded-xl font-semibold transition-all duration-500 ease-out z-10 ${
                  activeTab === 'freelancer'
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={{
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <Briefcase className="inline-block w-5 h-5 mr-2 transition-transform duration-300 ease-out" />
                For Freelancers
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {(activeTab === 'client' ? clientFeatures : freelancerFeatures).map((feature, index) => (
            <div
              key={index}
              className="group relative transform transition-all duration-500 hover:scale-105"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 h-full hover:bg-gray-800/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16" data-section="ready-to-get-started">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of clients and freelancers who are already using TENFlex to create amazing projects and build successful careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleHireTalentClick}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105"
              >
                <Users className="inline-block w-5 h-5 mr-2" />
                Hire Talent
              </button>
              <button 
                onClick={handleStartFreelancingClick}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:scale-105"
              >
                <Briefcase className="inline-block w-5 h-5 mr-2" />
                Start Freelancing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouCanDo; 