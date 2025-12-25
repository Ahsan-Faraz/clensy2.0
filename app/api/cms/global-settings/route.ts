import { NextResponse } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

// Get global settings
export async function GET() {
  try {
    const settings = await CMSAdapter.getGlobalSettings();
    return NextResponse.json({ success: true, data: settings, source: 'strapi' });
  } catch (error) {
    console.error("Error fetching global settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch global settings" },
      { status: 500 }
    );
  }
}

