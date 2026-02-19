import { NextResponse } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

// Get all services
export async function GET() {
  try {
    const services = await CMSAdapter.getAllServices();
    return NextResponse.json({ success: true, data: services, source: 'strapi' }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
