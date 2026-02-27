import { NextResponse } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

export async function GET() {
  try {
    const data = await CMSAdapter.getCareersPage();
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error fetching careers page:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch careers page",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
