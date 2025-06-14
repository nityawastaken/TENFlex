import connectDB from "@/utils/db";
import Project from "@/models/Project";

export async function POST(req, { params }) {
  await connectDB();
  const { name, amount } = await req.json();
  const project = await Project.findById(params.id);
  if (!project) return new Response("Project not found", { status: 404 });

  project.bids.push({ name, amount });
  await project.save();

  return Response.json({ message: "Bid submitted", project });
}
