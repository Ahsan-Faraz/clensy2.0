import { NextRequest, NextResponse } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const raw = searchParams.get('raw'); // If raw=true, return raw Strapi data with template relation

    // If raw param is set, fetch directly from Strapi with template relation
    if (raw === 'true') {
      const url = `${STRAPI_URL}/api/about?populate=*`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
        },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { success: false, error: `Failed to fetch about page: ${response.status}`, details: errorText },
          { status: response.status }
        );
      }
      
      const data = await response.json();
      return NextResponse.json({ success: true, data });
    }

    // Default: use CMSAdapter for formatted data (used by the actual site)
    const data = await CMSAdapter.getAboutPage();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching about page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch about page", message: error.message },
      { status: 500 }
    );
  }
}
