import { NextResponse } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

// Get all pages
export async function GET() {
  try {
    const pages = await CMSAdapter.getAllPages();
    return NextResponse.json({ success: true, data: pages, source: 'strapi' });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}
