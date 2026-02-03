import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

/**
 * Fetches raw Strapi data for a specific Location entry for the Page Builder editor.
 * This endpoint handles contentId or slug as query parameters.
 * 
 * Usage:
 * - /api/page-builder/content/location?contentId=xxx (by documentId)
 * - /api/page-builder/content/location?slug=xxx (by slug)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');
    const slug = searchParams.get('slug');
    
    if (!contentId && !slug) {
      return NextResponse.json(
        { success: false, error: 'Either contentId or slug is required' },
        { status: 400 }
      );
    }

    let url: string;
    
    if (contentId) {
      // Fetch by documentId - Strapi v5 uses documentId for collection items
      // Use populate=* to get all relations including the template
      url = `${STRAPI_URL}/api/locations/${contentId}?populate=*`;
    } else {
      // Fetch by slug - use populate=* to get all relations
      url = `${STRAPI_URL}/api/locations?filters[slug][$eq]=${slug}&populate=*`;
    }
    
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
    
    // Handle single item response (by documentId) vs array response (by slug filter)
    let location;
    if (contentId) {
      // Direct fetch by documentId returns single object in data
      location = data.data;
    } else {
      // Filter query returns array
      const locations = data.data || [];
      if (locations.length === 0) {
        return NextResponse.json(
          { success: false, error: `Location not found: ${slug}` },
          { status: 404 }
        );
      }
      location = locations[0];
    }
    
    if (!location) {
      return NextResponse.json(
        { success: false, error: `Location not found: ${contentId || slug}` },
        { status: 404 }
      );
    }
    
    console.log(`[PageBuilder Location Content] Found location: ${location.name}, id: ${location.id}, documentId: ${location.documentId}`);
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
      slug: location.slug,
      contentId: location.documentId || location.id,
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
