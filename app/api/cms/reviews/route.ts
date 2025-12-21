import { NextResponse } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

export async function GET() {
  try {
    const data = await CMSAdapter.getReviewsSection();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
