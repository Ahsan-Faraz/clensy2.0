import { NextResponse } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

export async function GET() {
  try {
    const data = await CMSAdapter.getChecklistSection();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching checklist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch checklist" },
      { status: 500 }
    );
  }
}
