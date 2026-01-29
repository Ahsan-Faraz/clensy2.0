import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Map content types to Strapi endpoints
const contentTypeEndpoints: Record<string, string> = {
  'landing-page': '/api/landing-page',
  'about': '/api/about',
  'contact': '/api/contact',
  'checklist-page': '/api/checklist-page',
  'faq-page': '/api/faq-page',
};

// Template relation field names for each content type
const templateRelationFields: Record<string, string> = {
  'landing-page': 'Landing_Page',
  'about': 'About_Page',
  'contact': 'Contact_Page',
  'checklist-page': 'Checklist_Page',
  'faq-page': 'FAQ_Page',
};

/**
 * Fetches raw Strapi data for the Page Builder editor.
 * This endpoint always returns raw data with template relations populated.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    
    const strapiEndpoint = contentTypeEndpoints[type];
    if (!strapiEndpoint) {
      return NextResponse.json(
        { success: false, error: `Unknown content type: ${type}` },
        { status: 400 }
      );
    }

    const templateField = templateRelationFields[type] || 'Landing_Page';
    
    // Use deep populate to get the template's json field
    const url = `${STRAPI_URL}${strapiEndpoint}?populate[${templateField}][populate]=*`;
    console.log(`[PageBuilder Content] Fetching: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[PageBuilder Content] Error: ${response.status}`, errorText);
      return NextResponse.json(
        { success: false, error: `Failed to fetch ${type}: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    const content = data.data || {};
    
    console.log(`[PageBuilder Content] ${type} data keys:`, Object.keys(content).slice(0, 15));
    console.log(`[PageBuilder Content] Template field "${templateField}":`, content[templateField] ? 'EXISTS' : 'MISSING');
    
    if (content[templateField]) {
      console.log(`[PageBuilder Content] Template ID: ${content[templateField].id}, has json: ${!!content[templateField].json}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      data: content, 
      meta: data.meta,
      contentType: type,
      templateField: templateField,
    });
  } catch (error: any) {
    console.error("[PageBuilder Content] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content", message: error.message },
      { status: 500 }
    );
  }
}
