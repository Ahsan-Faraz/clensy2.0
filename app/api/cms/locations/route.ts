import { NextResponse } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

// Get all locations
export async function GET() {
  try {
    const locations = await CMSAdapter.getAllLocations();
    return NextResponse.json({ success: true, data: locations, source: 'strapi' }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
