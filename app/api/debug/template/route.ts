import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

/**
 * Debug endpoint to see exactly what template data looks like
 * Visit: http://localhost:3000/api/debug/template
 */
export async function GET(request: NextRequest) {
  const results: any = {
    strapiUrl: STRAPI_URL,
    hasToken: !!STRAPI_API_TOKEN,
    endpoints: {},
  };

  // Try multiple endpoints to find where templates are stored
  const endpointsToTry = [
    '/api/page-builder/templates',
    '/page-builder/templates',
    '/api/plugin::page-builder.template',
    '/api/templates',
  ];

  for (const endpoint of endpointsToTry) {
    try {
      const url = `${STRAPI_URL}${endpoint}`;
      console.log('Trying:', url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: 'no-store',
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { raw: responseText.slice(0, 500) };
      }

      results.endpoints[endpoint] = {
        status: response.status,
        ok: response.ok,
        data: response.ok ? data : { error: responseText.slice(0, 500) },
      };

      // If we found templates, also fetch the first one with full details
      if (response.ok && data?.data && Array.isArray(data.data) && data.data.length > 0) {
        const firstTemplate = data.data[0];
        const templateId = firstTemplate.documentId || firstTemplate.id;
        
        const detailUrl = `${STRAPI_URL}${endpoint}/${templateId}`;
        const detailResponse = await fetch(detailUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          },
          cache: 'no-store',
        });

        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          results.endpoints[`${endpoint}/{id}`] = {
            url: detailUrl,
            status: detailResponse.status,
            data: detailData,
            jsonField: detailData?.data?.json || detailData?.json || 'NOT_FOUND',
            blocksCount: detailData?.data?.json?.blocks?.length || detailData?.json?.blocks?.length || 0,
          };
        }
      }
    } catch (error: any) {
      results.endpoints[endpoint] = {
        error: error.message,
      };
    }
  }

  // Also fetch landing page with template relation
  try {
    const landingPageUrl = `${STRAPI_URL}/api/landing-page?populate=*`;
    const lpResponse = await fetch(landingPageUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (lpResponse.ok) {
      const lpData = await lpResponse.json();
      const landingPage = lpData.data || {};
      
      results.landingPage = {
        hasLandingPageRelation: !!landingPage.Landing_Page,
        templateRelation: landingPage.Landing_Page || null,
        templateJson: landingPage.Landing_Page?.json || 'NOT_FOUND',
        templateBlocksCount: landingPage.Landing_Page?.json?.blocks?.length || 0,
        allFields: Object.keys(landingPage),
      };
    }
  } catch (error: any) {
    results.landingPage = { error: error.message };
  }

  return NextResponse.json(results, { status: 200 });
}
