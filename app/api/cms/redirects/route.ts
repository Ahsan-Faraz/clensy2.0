import { NextResponse } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

// Get all active redirects
export async function GET() {
  try {
    const redirects = await CMSAdapter.getAllRedirects();
    return NextResponse.json({ success: true, data: redirects, source: 'strapi' });
  } catch (error) {
    console.error("Error fetching redirects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch redirects" },
      { status: 500 }
    );
  }
}

