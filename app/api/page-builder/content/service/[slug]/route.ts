import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

/**
 * Fetches raw Strapi data for a specific Service entry for the Page Builder editor.
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

    // Fetch service by slug with all relations populated
    // Use populate=* to get all relations including the template
    const url = `${STRAPI_URL}/api/services?filters[slug][$eq]=${slug}&populate=*`;
    console.log(`[PageBuilder Service Content] Fetching: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[PageBuilder Service Content] Error: ${response.status}`, errorText);
      return NextResponse.json(
        { success: false, error: `Failed to fetch service: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    const services = data.data || [];
    
    if (services.length === 0) {
      return NextResponse.json(
        { success: false, error: `Service not found: ${slug}` },
        { status: 404 }
      );
    }
    
    const service = services[0];
    
    console.log(`[PageBuilder Service Content] Found service: ${service.name}, id: ${service.id}`);
    console.log(`[PageBuilder Service Content] Template field "Service_Page":`, service.Service_Page ? 'EXISTS' : 'MISSING');
    
    if (service.Service_Page) {
      console.log(`[PageBuilder Service Content] Template ID: ${service.Service_Page.id}, has json: ${!!service.Service_Page.json}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      data: service,
      meta: data.meta,
      contentType: 'service',
      templateField: 'Service_Page',
      slug: slug,
      contentId: service.id,
      documentId: service.documentId,
    });
  } catch (error: any) {
    console.error("[PageBuilder Service Content] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service content", message: error.message },
      { status: 500 }
    );
  }
}
