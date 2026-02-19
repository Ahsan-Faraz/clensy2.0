import { NextResponse } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

export async function GET() {
  try {
    const data = await CMSAdapter.getHeroSection();
    return NextResponse.json({ success: true, data }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error("Error fetching hero:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero section" },
      { status: 500 }
    );
  }
}
