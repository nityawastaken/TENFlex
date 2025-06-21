import connectDB from "@/utils/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await connectDB();

  const { id } = params; // ✅ correctly extracting id
  const { freelancer, email, amount, message = "", time } = await req.json();

  try {
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Append new bid
    project.bids.push({
      freelancer,
      email,
      amount,
      message,
      time,
      isAccepted: false,
    });

    await project.save();

    return NextResponse.json({ message: "Bid placed", project }, { status: 200 });
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
