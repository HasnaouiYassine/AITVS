import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const cvServiceUrl = process.env.CV_SERVICE_URL || "http://localhost:8000";
  const start = Date.now();
  try {
    const response = await axios.get(`${cvServiceUrl}/health`, { timeout: 15000 });
    const elapsed = Date.now() - start;
    if (response.status === 200 && response.data?.status === "ok") {
      return NextResponse.json({ cv_status: "ok", response_time_ms: elapsed });
    }
    return NextResponse.json({ cv_status: "cold", response_time_ms: elapsed }, { status: 502 });
  } catch (error: any) {
    const elapsed = Date.now() - start;
    console.error("Keep-alive ping to CV service failed:", error.message);
    return NextResponse.json(
      { cv_status: "cold", response_time_ms: elapsed, error: error.message },
      { status: 502 }
    );
  }
}
