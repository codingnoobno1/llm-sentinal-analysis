import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Proxying to the Python backend running on localhost:8000
    // If the backend is not running, axios will throw an error
    const response = await axios.post("http://localhost:8000/api/audit", body, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 600000, // 10 minutes timeout for LLM processing
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Audit API Proxy Error:", error.message);
    
    // If the backend is not reachable, we return a helpful error
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { detail: "Forensic Node (Python Backend) is not reachable at localhost:8000. Please start the backend server." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { detail: error.response?.data?.detail || "Failed to connect to the forensic audit engine." },
      { status: error.response?.status || 500 }
    );
  }
}
