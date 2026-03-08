import { NextResponse } from 'next/server';

const STRAPI_URL =
  (typeof window === 'undefined' ? process.env.STRAPI_URL : null) ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const STRAPI_API_PREFIX = process.env.STRAPI_API_PREFIX || '/admin/api';

// Map page slug → Strapi single-type name
const SLUG_TO_SINGLE_TYPE: Record<string, string> = {
  bergen: 'bergen-county',
  essex: 'essex-county',
  hudson: 'hudson-county',
  morris: 'morris-county',
  passaic: 'passaic-county',
  union: 'union-county',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ county: string }> | { county: string } }
) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const county = resolvedParams?.county;

  if (!county || !SLUG_TO_SINGLE_TYPE[county]) {
    return NextResponse.json(
      { success: false, error: `Unknown location: ${county}` },
      { status: 404 }
    );
  }

  const singleTypeName = SLUG_TO_SINGLE_TYPE[county];

  try {
    const url = `${STRAPI_URL}${STRAPI_API_PREFIX}/${singleTypeName}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    const res = await fetch(url, { headers, next: { revalidate: 60 } });

    if (!res.ok) {
      console.error(`Strapi fetch failed for ${singleTypeName}: ${res.status}`);
      return NextResponse.json(
        { success: false, error: `Failed to fetch ${singleTypeName}` },
        { status: res.status }
      );
    }

    const json = await res.json();
    const d = json.data || {};

    // Transform flat Strapi fields → nested shape expected by frontend
    const data = {
      heroSection: {
        title: d.heroTitle || '',
        subtitle: d.heroSubtitle || '',
        backgroundImage: d.heroBackgroundImageUrl || '',
        ctaButton1: d.heroCtaButton1 || 'SCHEDULE SERVICE',
        ctaButton2: d.heroCtaButton2 || 'CALL US NOW',
      },
      contactSection: {
        title: d.contactTitle || 'Contact Information',
        phone: d.contactPhone || '',
        email: d.contactEmail || '',
        address: d.contactAddress || '',
        hours: Array.isArray(d.operatingHours) ? d.operatingHours : [],
      },
      serviceAreas: Array.isArray(d.serviceAreas) ? d.serviceAreas : [],
      aboutSection: {
        title: d.aboutTitle || '',
        description: d.aboutDescription || '',
      },
      seo: {
        title: d.seoTitle || '',
        description: d.seoMetaDescription || '',
        keywords: Array.isArray(d.seoKeywords) ? d.seoKeywords : [],
      },
    };

    return NextResponse.json(
      { success: true, data },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (error) {
    console.error(`Error fetching ${singleTypeName}:`, error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch location data` },
      { status: 500 }
    );
  }
}
