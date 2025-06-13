"use client";
import React from "react";

const services = [
	{
		title: "Logo Design",
		category: "Graphics & Design",
		image:
			"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&q=80",
		desc: "Professional logo design for your brand.",
		price: "₹1500",
	},
	{
		title: "SEO Optimization",
		category: "Digital Marketing",
		image:
			"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=facearea&w=400&q=80",
		desc: "Boost your website ranking with expert SEO.",
		price: "₹2500",
	},
	{
		title: "Website Development",
		category: "Programming & Tech",
		image:
			"https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=facearea&w=400&q=80",
		desc: "Full-stack web development services.",
		price: "₹5000",
	},
];

export default function DiscoverServices() {
	return (
		<div className="min-h-screen bg-gray-950 pt-30 px-4">
			<h1 className="text-3xl font-bold text-white mb-8 text-center">
				Discover Services
			</h1>
			<div className="max-w-5xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
				{services.map((service, idx) => (
					<div
						key={idx}
						className="bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition"
					>
						<img
							src={service.image}
							alt={service.title}
							className="w-28 h-28 rounded-xl mb-4 object-cover"
						/>
						<h2 className="text-xl font-semibold text-white">
							{service.title}
						</h2>
						<p className="text-purple-400 mb-1">{service.category}</p>
						<p className="text-gray-300 text-sm mb-2">{service.desc}</p>
						<span className="text-[#A020F0] font-bold mb-2">
							{service.price}
						</span>
						<button className="mt-2 px-6 py-2 bg-[#A020F0] rounded-full text-white hover:bg-purple-700 transition">
							View Service
						</button>
					</div>
				))}
			</div>
		</div>
	);
}