import connectDB from "@/utils/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const body = await req.json();

  const project = await Project.findById(id);
  if (!project) return NextResponse.json({ message: "Not found" }, { status: 404 });

  project.bids.push(body);
  await project.save();

  return NextResponse.json({ message: "Bid submitted", project });
}
