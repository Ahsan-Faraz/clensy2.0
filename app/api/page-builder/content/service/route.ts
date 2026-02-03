import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

/**
 * Fetches raw Strapi data for a specific Service entry for the Page Builder editor.
 * This endpoint handles contentId or slug as query parameters.
 * 
 * Usage:
 * - /api/page-builder/content/service?contentId=xxx (by documentId)
 * - /api/page-builder/content/service?slug=xxx (by slug)
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
      url = `${STRAPI_URL}/api/services/${contentId}?populate=*`;
    } else {
      // Fetch by slug - use populate=* to get all relations
      url = `${STRAPI_URL}/api/services?filters[slug][$eq]=${slug}&populate=*`;
    }
    
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
    
    // Handle single item response (by documentId) vs array response (by slug filter)
    let service;
    if (contentId) {
      // Direct fetch by documentId returns single object in data
      service = data.data;
    } else {
      // Filter query returns array
      const services = data.data || [];
      if (services.length === 0) {
        return NextResponse.json(
          { success: false, error: `Service not found: ${slug}` },
          { status: 404 }
        );
      }
      service = services[0];
    }
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: `Service not found: ${contentId || slug}` },
        { status: 404 }
      );
    }
    
    console.log(`[PageBuilder Service Content] Found service: ${service.name}, id: ${service.id}, documentId: ${service.documentId}`);
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
      slug: service.slug,
      contentId: service.documentId || service.id,
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
