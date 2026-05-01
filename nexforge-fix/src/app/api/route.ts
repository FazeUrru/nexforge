import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    status: "static", 
    version: "0.5.0", 
    mode: "demo",
    message: "This is the static GitHub Pages version. Clone the repo and run 'npm run dev' for full AI features." 
  });
}
