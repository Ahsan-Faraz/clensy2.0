import { NextResponse } from 'next/server';

const STRAPI_URL =
  (typeof window === 'undefined' ? process.env.STRAPI_URL : null) ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const STRAPI_API_PREFIX = process.env.STRAPI_API_PREFIX || '/admin/api';

/**
 * Fetches a Strapi single-type by name and returns a NextResponse.
 * Maps the Strapi response to { success: true, data: { ...attributes } }.
 */
export async function fetchSingleType(singleTypeName: string) {
  try {
    const url = `${STRAPI_URL}${STRAPI_API_PREFIX}/${singleTypeName}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    const res = await fetch(url, {
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Strapi fetch failed for ${singleTypeName}: ${res.status}`);
      return NextResponse.json(
        { success: false, error: `Failed to fetch ${singleTypeName}` },
        { status: res.status }
      );
    }

    const json = await res.json();
    // Strapi v5 single-type returns { data: { id, documentId, ...attributes } }
    const data = json.data || {};
    // Strip Strapi meta fields, keep only content attributes
    const { id, documentId, createdAt, updatedAt, publishedAt, locale, ...attributes } = data;

    return NextResponse.json(
      { success: true, data: attributes },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (error) {
    console.error(`Error fetching ${singleTypeName}:`, error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch ${singleTypeName}` },
      { status: 500 }
    );
  }
}
