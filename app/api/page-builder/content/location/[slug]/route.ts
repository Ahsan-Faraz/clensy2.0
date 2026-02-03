import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

/**
 * Fetches raw Strapi data for a specific Location entry for the Page Builder editor.
 * This endpoint returns raw data with template relations populated.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Fetch location by slug with template relation populated
    // Use simple populate for the template relation
    const url = `${STRAPI_URL}/api/locations?filters[slug][$eq]=${slug}&populate=Location_Page&populate=image&populate=heroImage`;
    console.log(`[PageBuilder Location Content] Fetching: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[PageBuilder Location Content] Error: ${response.status}`, errorText);
      return NextResponse.json(
        { success: false, error: `Failed to fetch location: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    const locations = data.data || [];
    
    if (locations.length === 0) {
      return NextResponse.json(
        { success: false, error: `Location not found: ${slug}` },
        { status: 404 }
      );
    }
    
    const location = locations[0];
    
    console.log(`[PageBuilder Location Content] Found location: ${location.name}, id: ${location.id}`);
    console.log(`[PageBuilder Location Content] Template field "Location_Page":`, location.Location_Page ? 'EXISTS' : 'MISSING');
    
    if (location.Location_Page) {
      console.log(`[PageBuilder Location Content] Template ID: ${location.Location_Page.id}, has json: ${!!location.Location_Page.json}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      data: location,
      meta: data.meta,
      contentType: 'location',
      templateField: 'Location_Page',
      slug: slug,
      contentId: location.id,
      documentId: location.documentId,
    });
  } catch (error: any) {
    console.error("[PageBuilder Location Content] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch location content", message: error.message },
      { status: 500 }
    );
  }
}
