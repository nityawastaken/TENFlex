// /app/api/projects/user/route.js (or similar path)
import connectDB from "@/utils/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const projects = await Project.find({ email });

  return NextResponse.json({ projects });
}
