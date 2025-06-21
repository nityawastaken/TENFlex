// /api/projects/[id]/updateStatus/route.js
import connectDB from "@/utils/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const { newStatus } = await req.json();

  const validStatuses = ["in-progress", "submitted", "completed"];
  if (!validStatuses.includes(newStatus)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const project = await Project.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  );

  return NextResponse.json({ message: "Status updated", project });
}
