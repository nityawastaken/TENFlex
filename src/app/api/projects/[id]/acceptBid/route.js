import connectDB from "@/utils/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  await connectDB();
  const { id } = context.params;
  const { bidIndex, userEmail } = await req.json();

  const project = await Project.findById(id);
  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  if (project.email !== userEmail) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  // Accept only one bid
  project.bids = project.bids.map((bid, index) => ({
    ...bid.toObject(),
    isAccepted: index === bidIndex,
  }));

  // ✅ Update project status
  project.status = "in-progress";

  await project.save();

  return NextResponse.json({ message: "Bid accepted", project }, { status: 200 });
}
