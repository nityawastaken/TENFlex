"use client";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

const people = [
	{
		name: "Amit Sharma",
		role: "Web Developer",
		bio: "Full Stack Developer with 5+ years experience in MERN stack.",
	},
	{
		name: "Priya Singh",
		role: "UI/UX Designer",
		bio: "Passionate about creating beautiful and user-friendly designs.",
	},
	{
		name: "Rahul Verma",
		role: "Digital Marketer",
		bio: "Expert in SEO, SEM, and social media marketing.",
	},
	// ...add more people as needed
];

export default function DiscoverPeople() {
	return (
		<div className="min-h-screen bg-gray-950 pt-30 px-4">
			<h1 className="text-3xl font-bold text-white mb-8 text-center">
				Discover People
			</h1>
			<div className="max-w-5xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
				{people.map((person, idx) => (
					<div
						key={idx}
						className="bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition"
					>
						<FaUserCircle className="text-6xl text-[#A020F0] mb-4" />
						<h2 className="text-xl font-semibold text-white">
							{person.name}
						</h2>
						<p className="text-purple-400 mb-2">{person.role}</p>
						<p className="text-gray-300 text-sm">{person.bio}</p>
						<button className="mt-4 px-6 py-2 bg-[#A020F0] rounded-full text-white hover:bg-purple-700 transition">
							View Profile
						</button>
					</div>
				))}
			</div>
		</div>
	);
}