import { NextResponse } from 'next/server';

const STRAPI_URL =
  (typeof window === 'undefined' ? process.env.STRAPI_URL : null) ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const STRAPI_API_PREFIX = process.env.STRAPI_API_PREFIX || '/admin/api';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ county: string }> | { county: string } }
) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const county = resolvedParams?.county;

  if (!county) {
    return NextResponse.json(
      { success: false, error: 'Missing location slug' },
      { status: 400 }
    );
  }

  try {
    const base = STRAPI_URL.replace(/\/+$/, '');
    const prefix = (STRAPI_API_PREFIX || '/admin/api').replace(/^\/+|\/+$/g, '');
    const url = `${base}/${prefix}/locations?filters[slug][$eq]=${encodeURIComponent(county)}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    const res = await fetch(url, { headers, next: { revalidate: 60 } });

    if (!res.ok) {
      console.error(`Strapi fetch failed for location ${county}: ${res.status}`);
      return NextResponse.json(
        { success: false, error: `Failed to fetch location ${county}` },
        { status: res.status }
      );
    }

    const json = await res.json();
    const entries = json.data || [];
    if (entries.length === 0) {
      return NextResponse.json(
        { success: false, error: `Location not found: ${county}` },
        { status: 404 }
      );
    }

    const raw = entries[0];
    const { id, documentId, createdAt, updatedAt, publishedAt, locale, slug, ...d } = raw;

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
      mapImage: d.mapImageUrl || null,
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
    console.error(`Error fetching location ${county}:`, error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch location data` },
      { status: 500 }
    );
  }
}
