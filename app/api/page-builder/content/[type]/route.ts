import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Content type configuration
// isSingleType: true = single type (e.g., landing-page), false = collection type (e.g., services)
const contentTypeConfig: Record<string, { endpoint: string; templateField: string; isSingleType: boolean }> = {
  'landing-page': { endpoint: '/api/landing-page', templateField: 'Landing_Page', isSingleType: true },
  'about': { endpoint: '/api/about', templateField: 'About_Page', isSingleType: true },
  'contact': { endpoint: '/api/contact', templateField: 'Contact_Page', isSingleType: true },
  'checklist-page': { endpoint: '/api/checklist-page', templateField: 'Checklist_Page', isSingleType: true },
  'faq-page': { endpoint: '/api/faq-page', templateField: 'FAQ_Page', isSingleType: true },
  // Collection types - require contentId
  'service': { endpoint: '/api/services', templateField: 'Service_Page', isSingleType: false },
  'location': { endpoint: '/api/locations', templateField: 'Location_Page', isSingleType: false },
};

/**
 * Fetches raw Strapi data for the Page Builder editor.
 * This endpoint always returns raw data with template relations populated.
 * 
 * For single types: /api/page-builder/content/landing-page
 * For collection types: 
 *   - By contentId: /api/page-builder/content/service?contentId=abc123
 *   - By slug: /api/page-builder/content/service?slug=airbnb-cleaning
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const searchParams = request.nextUrl.searchParams;
    const contentId = searchParams.get('contentId') || searchParams.get('_contentId');
    const slug = searchParams.get('slug');
    
    const config = contentTypeConfig[type];
    if (!config) {
      return NextResponse.json(
        { success: false, error: `Unknown content type: ${type}. Supported types: ${Object.keys(contentTypeConfig).join(', ')}` },
        { status: 400 }
      );
    }

    const { endpoint, templateField, isSingleType } = config;
    
    // For collection types, we need either contentId or slug
    let url: string;
    let fetchedContentId = contentId;
    
    if (isSingleType) {
      url = `${STRAPI_URL}${endpoint}?populate=*`;
    } else if (contentId) {
      // Fetch by documentId
      url = `${STRAPI_URL}${endpoint}/${contentId}?populate=*`;
    } else if (slug) {
      // Fetch by slug using filters
      url = `${STRAPI_URL}${endpoint}?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`;
    } else {
      return NextResponse.json(
        { success: false, error: `Content ID or slug required for collection type "${type}". Pass ?contentId=xxx or ?slug=xxx` },
        { status: 400 }
      );
    }
    
    console.log(`[PageBuilder Content] Fetching: ${url}`);
    
    let response = await fetch(url, {
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
    
    let data = await response.json();
    
    // Handle slug-based queries (returns array) vs contentId queries (returns single object)
    let content: any;
    if (slug && !contentId) {
      // Slug query returns array - get first item
      const items = data.data || [];
      if (items.length === 0) {
        return NextResponse.json(
          { success: false, error: `No ${type} found with slug "${slug}"` },
          { status: 404 }
        );
      }
      content = items[0];
      fetchedContentId = content.documentId || content.id;
    } else {
      content = data.data || {};
    }
    
    console.log(`[PageBuilder Content] ${type} data keys:`, Object.keys(content).slice(0, 15));
    
    // Check if template field exists and needs deep population
    if (templateField && content[templateField]) {
      (`[PageBuilder Content] Template field "${templateField}" exists, fetching with deep populate...`);
      
      // Try deep populate to get template.json
      let deepUrl: string;
      if (isSingleType) {
        deepUrl = `${STRAPI_URL}${endpoint}?populate[${templateField}][populate]=*`;
      } else if (fetchedContentId) {
        deepUrl = `${STRAPI_URL}${endpoint}/${fetchedContentId}?populate[${templateField}][populate]=*`;
      } else if (slug) {
        deepUrl = `${STRAPI_URL}${endpoint}?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[${templateField}][populate]=*`;
      } else {
        // Fallback - skip deep populate
        deepUrl = '';
      }
      
      if (deepUrl) {
        const deepResponse = await fetch(deepUrl, {
          headers: {
            'Content-Type': 'application/json',
            ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
          },
          cache: 'no-store',
        });
        
        if (deepResponse.ok) {
          const deepData = await deepResponse.json();
          // Handle array response (slug query) vs single object (contentId query)
          if (slug && !contentId && Array.isArray(deepData.data)) {
            content = deepData.data[0] || content;
          } else {
            content = deepData.data || content;
          }
          (`[PageBuilder Content] Deep populate successful`);
        } else {
          (`[PageBuilder Content] Deep populate failed, using basic populate`);
        }
      }
    } else {
      console.log(`[PageBuilder Content] Template field "${templateField}": ${content[templateField] ? 'EXISTS' : 'MISSING'}`);
    }
    
    if (templateField && content[templateField]) {
      const template = content[templateField];
      console.log(`[PageBuilder Content] Template object:`, JSON.stringify({
        id: template.id,
        documentId: template.documentId,
        name: template.name,
        hasJson: !!template.json,
        allKeys: Object.keys(template)
      }));
    }
    
    return NextResponse.json({ 
      success: true, 
      data: content, 
      meta: data.meta,
      contentType: type,
      templateField: templateField || null,
      isSingleType,
      contentId: fetchedContentId || null,
      slug: slug || null,
    });
  } catch (error: any) {
    console.error("[PageBuilder Content] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content", message: error.message },
      { status: 500 }
    );
  }
}
