import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

export async function GET() {
  const results: any = {
    strapiUrl: STRAPI_URL,
    hasToken: !!STRAPI_API_TOKEN,
    pages: {},
  };

  const pages = [
    { name: 'landing-page', endpoint: '/api/landing-page', templateField: 'Landing_Page' },
    { name: 'about', endpoint: '/api/about', templateField: 'About_Page' },
    { name: 'contact', endpoint: '/api/contact', templateField: 'Contact_Page' },
  ];

  for (const page of pages) {
    try {
      const url = `${STRAPI_URL}${page.endpoint}?populate=*`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        results.pages[page.name] = {
          error: `HTTP ${response.status}`,
          details: await response.text(),
        };
        continue;
      }

      const data = await response.json();
      const pageData = data.data || {};
      
      results.pages[page.name] = {
        success: true,
        hasData: !!pageData,
        fields: Object.keys(pageData).slice(0, 20),
        templateFieldName: page.templateField,
        templateFieldExists: page.templateField in pageData,
        templateFieldValue: pageData[page.templateField] ? {
          id: pageData[page.templateField].id,
          documentId: pageData[page.templateField].documentId,
          name: pageData[page.templateField].name,
        } : null,
        templateStatus: pageData[page.templateField] 
          ? 'ATTACHED' 
          : (page.templateField in pageData ? 'EXISTS_BUT_NULL' : 'FIELD_MISSING'),
      };
    } catch (error: any) {
      results.pages[page.name] = {
        error: error.message,
      };
    }
  }

  // Also fetch templates
  try {
    const templatesUrl = `${STRAPI_URL}/api/page-builder/templates`;
    const response = await fetch(templatesUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      const templates = data.data || [];
      results.availableTemplates = templates.map((t: any) => ({
        id: t.id,
        documentId: t.documentId,
        name: t.name,
        contentType: t.contentType,
      }));
    }
  } catch (e: any) {
    results.availableTemplates = { error: e.message };
  }

  return NextResponse.json(results, {
    headers: { 'Content-Type': 'application/json' },
  });
}
