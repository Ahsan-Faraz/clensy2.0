import { NextResponse } from 'next/server';

const STRAPI_URL =
  (typeof window === 'undefined' ? process.env.STRAPI_URL : null) ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const STRAPI_API_PREFIX = process.env.STRAPI_API_PREFIX || '/admin/api';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return NextResponse.json(
      { success: false, error: 'Missing service slug' },
      { status: 400 }
    );
  }

  try {
    const base = STRAPI_URL.replace(/\/+$/, '');
    const prefix = (STRAPI_API_PREFIX || '/admin/api').replace(/^\/+|\/+$/g, '');
    const url = `${base}/${prefix}/services?filters[slug][$eq]=${encodeURIComponent(slug)}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    const res = await fetch(url, { headers, next: { revalidate: 60 } });

    if (!res.ok) {
      console.error(`Strapi fetch failed for service ${slug}: ${res.status}`);
      return NextResponse.json(
        { success: false, error: `Failed to fetch service ${slug}` },
        { status: res.status }
      );
    }

    const json = await res.json();
    const entries = json.data || [];
    if (entries.length === 0) {
      return NextResponse.json(
        { success: false, error: `Service not found: ${slug}` },
        { status: 404 }
      );
    }

    const entry = entries[0];
    // Strip Strapi meta, extract top-level fields + spread pageData back to flat
    const { id, documentId, createdAt, updatedAt, publishedAt, locale, slug: _s, name, serviceTemplate, pageData, ...topFields } = entry;

    // Merge top-level fields + pageData into the flat shape pages expect
    const data = { ...topFields, ...(pageData || {}), serviceTemplate };

    return NextResponse.json(
      { success: true, data },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (error) {
    console.error(`Error fetching service ${slug}:`, error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch service ${slug}` },
      { status: 500 }
    );
  }
}
