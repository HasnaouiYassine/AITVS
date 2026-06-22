import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Tile from "@/models/Tile";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { projects } from "@/lib/mock-data";

export async function GET() {
  const session = await auth();
  if (!session?.user.id) return NextResponse.json({ data: projects });
  if (!process.env.MONGODB_URI) return NextResponse.json({ data: projects });

  await connectDB();
  const data = await Project.find({ userId: session.user.id }).populate("tileId", "name imageUrl").sort({ createdAt: -1 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Add MONGODB_URI to save projects" }, { status: 503 });

  const formData = await req.formData();
  const roomImage = formData.get("roomImage");
  const tileId = String(formData.get("tileId") || "");
  const floorCorners = JSON.parse(String(formData.get("floorCorners") || "[]"));

  if (!(roomImage instanceof File) || !tileId || !floorCorners.length) {
    return NextResponse.json({ error: "roomImage, tileId, and floorCorners are required" }, { status: 400 });
  }

  await connectDB();
  const tile = await Tile.findById(tileId);
  if (!tile) return NextResponse.json({ error: "Tile not found" }, { status: 404 });

  const buffer = Buffer.from(await roomImage.arrayBuffer());
  const roomImageUrl = await uploadToCloudinary(buffer, "tilevision/rooms");
  const resultImageUrl = roomImageUrl;

  const project = await Project.create({
    userId: session.user.id,
    roomImageUrl,
    tileId,
    resultImageUrl,
    floorCorners,
  });

  return NextResponse.json({ data: project }, { status: 201 });
}
