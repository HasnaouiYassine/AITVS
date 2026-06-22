import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const trimmedName = String(name || "").trim();

  if (!trimmedName || !normalizedEmail || !password || String(password).length < 8) {
    return NextResponse.json({ error: "Name, email, and an 8 character password are required" }, { status: 400 });
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: "Add MONGODB_URI to enable registration" }, { status: 503 });
  }

  await connectDB();
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) return NextResponse.json({ error: "Email is already registered" }, { status: 409 });

  await User.create({ name: trimmedName, email: normalizedEmail, password, role: "user" });
  return NextResponse.json({ message: "User created" }, { status: 201 });
}
