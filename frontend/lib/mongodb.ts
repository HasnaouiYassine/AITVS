import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongooseCache:
    | { conn: typeof import("mongoose") | null; promise: Promise<typeof import("mongoose")> | null }
    | undefined;
}

export async function connectDB() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

  const cached = global.mongooseCache || { conn: null, promise: null };
  global.mongooseCache = cached;

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((connection) => connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
