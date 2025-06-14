// app/api/projects/route.js
import connectDB from "@/utils/db";
import Project from "@/models/Project";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const project = new Project(body);
    await project.save();
    return new Response(JSON.stringify({ message: "Project posted", project }), {
      status: 201,
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Error posting project" }), {
      status: 500,
    });
  }
}


// app/api/projects/route.js
export async function GET() {
  await connectDB();

  try {
    const projects = await Project.find().sort({ datePosted: -1 });
    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Failed to load projects" }), {
      status: 500,
    });
  }
}