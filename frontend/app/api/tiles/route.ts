import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Tile from "@/models/Tile";
import { tiles } from "@/lib/mock-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase();
  const clientId = searchParams.get("clientId");

  if (!process.env.MONGODB_URI) {
    const data = tiles.filter(
      (tile) =>
        (!category || category === "all" || tile.category === category) &&
        (!search || tile.name.toLowerCase().includes(search)) &&
        (!clientId || tile.clientId === clientId),
    );
    return NextResponse.json({ data });
  }

  await connectDB();
  const query: Record<string, unknown> = { active: true };
  if (category && category !== "all") query.category = category;
  if (clientId) query.clientId = clientId;
  if (search) query.name = { $regex: search, $options: "i" };
  const data = await Tile.find(query).sort({ createdAt: -1 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Add MONGODB_URI to create tiles" }, { status: 503 });

  const body = await req.json();
  await connectDB();
  const tile = await Tile.create(body);
  return NextResponse.json({ data: tile }, { status: 201 });
}
