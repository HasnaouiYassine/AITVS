import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Tile from "@/models/Tile";
import { uploadToCloudinary } from "@/lib/cloudinary";
import axios from "axios";

export async function GET() {
  const session = await auth();
  if (!session?.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ data: [] });

  await connectDB();
  const data = await Project.find({ userId: session.user.id })
    .populate("tileId", "name imageUrl")
    .sort({ createdAt: -1 });
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
  const floorPointStr = formData.get("floorPoint");
  const floorPoint = floorPointStr ? JSON.parse(String(floorPointStr)) : null;

  if (!(roomImage instanceof File) || !tileId || !floorCorners.length) {
    return NextResponse.json({ error: "roomImage, tileId, and floorCorners are required" }, { status: 400 });
  }

  await connectDB();
  const tile = await Tile.findById(tileId);
  if (!tile) return NextResponse.json({ error: "Tile not found" }, { status: 404 });

  // 1. Convert roomImage File to Buffer
  const buffer = Buffer.from(await roomImage.arrayBuffer());

  // 2. Upload room image to Cloudinary
  let roomImageUrl: string;
  try {
    roomImageUrl = await uploadToCloudinary(buffer, "tilevision/rooms");
  } catch (err: any) {
    console.error("Cloudinary upload failed:", err);
    return NextResponse.json({ error: "Failed to upload room image to Cloudinary" }, { status: 500 });
  }

  // 3. Call CV service with timeout
  let cvResponse;
  const cvServiceUrl = process.env.CV_SERVICE_URL || "http://localhost:8000";
  try {
    cvResponse = await axios.post(
      `${cvServiceUrl}/visualize`,
      {
        room_image_url: roomImageUrl,
        tile_image_url: tile.imageUrl,
        floor_corners: floorCorners,
        floor_point: floorPoint,
      },
      { timeout: 60000 } // 60s timeout for cold start
    );
  } catch (error: any) {
    console.error("CV Service error:", error);
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return NextResponse.json(
        { error: "CV service is starting up, please retry in 30 seconds" },
        { status: 503 }
      );
    }
    if (error.response) {
      const status = error.response.status;
      const detail = error.response.data?.detail || "Visualization failed";
      if (status === 400 || status === 422) {
        return NextResponse.json({ error: detail }, { status: 400 });
      }
      return NextResponse.json({ error: "Visualization failed, please try again" }, { status: 500 });
    }
    return NextResponse.json({ error: "Visualization failed, please try again" }, { status: 500 });
  }

  const { result_image_url, mask_image_url } = cvResponse.data;

  // 4. Save project to MongoDB
  const project = await Project.create({
    userId: session.user.id,
    roomImageUrl,
    tileId,
    resultImageUrl: result_image_url,
    floorMaskUrl: mask_image_url,
    floorCorners,
  });

  return NextResponse.json({ data: project }, { status: 201 });
}
