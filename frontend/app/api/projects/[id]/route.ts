import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { projects } from "@/lib/mock-data";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await auth();
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ data: projects.find((project) => project._id === id) || projects[0] });
  }

  await connectDB();
  const project = await Project.findOne({ _id: id, userId: session?.user.id }).populate("tileId");
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return NextResponse.json({ data: project });
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await auth();
  if (!session?.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Add MONGODB_URI to delete projects" }, { status: 503 });

  await connectDB();
  await Project.findOneAndDelete({ _id: id, userId: session.user.id });
  return NextResponse.json({ message: "Project deleted" });
}
