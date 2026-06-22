import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Tile from "@/models/Tile";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Add MONGODB_URI to update tiles" }, { status: 503 });

  const { id } = await context.params;
  const body = await req.json();
  await connectDB();
  const tile = await Tile.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json({ data: tile });
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Add MONGODB_URI to delete tiles" }, { status: 503 });

  const { id } = await context.params;
  await connectDB();
  await Tile.findByIdAndDelete(id);
  return NextResponse.json({ message: "Tile deleted" });
}
