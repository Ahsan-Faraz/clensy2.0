import { NextResponse } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

export async function GET() {
  try {
    const data = await CMSAdapter.getHowItWorks();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching how-it-works:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch how-it-works" },
      { status: 500 }
    );
  }
}
