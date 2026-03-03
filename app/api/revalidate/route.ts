import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import {
  clearLandingPageCache,
  clearServiceCaches,
  clearLocationCaches,
  clearAllPageCaches,
} from '@/lib/cms-adapter';

/**
 * API route for targeted revalidation (Strapi webhook-friendly).
 *
 * POST body options:
 * 1. Explicit: { type: 'service'|'location'|'all', slug?: string }
 * 2. Strapi webhook: { model: 'api::service.service', entry: { slug: 'moving-cleaning' } }
 *
 * Strapi webhook setup:
 * - URL: https://yoursite.com/api/revalidate
 * - Events: entry.publish, entry.update
 * - Headers: Content-Type: application/json
 * - Strapi sends model + entry; we extract slug for targeted revalidation
 */
export async function POST(request: NextRequest) {
  try {
    let body: { type?: string; slug?: string; model?: string; entry?: { slug?: string } } = {};
    try {
      body = await request.json().catch(() => ({}));
    } catch {
      // Empty body = full revalidate
    }

    // Support Strapi webhook payload: { model: 'api::service.service', entry: { slug: 'moving-cleaning' } }
    let type = body.type;
    let slug = body.slug;
    if (body.model && body.entry?.slug) {
      if (body.model.includes('service')) {
        type = 'service';
        slug = body.entry.slug;
      } else if (body.model.includes('location')) {
        type = 'location';
        slug = body.entry.slug;
      }
    }

    type = type ?? 'all';
    const revalidated: string[] = [];

    if (type === 'service' && slug) {
      clearServiceCaches();
      revalidateTag(`service-${slug}`);
      revalidatePath(`/services/${slug}`);
      revalidatePath('/services');
      revalidated.push(`service-${slug}`, '/services');
    } else if (type === 'location' && slug) {
      clearLocationCaches();
      revalidateTag(`location-${slug}`);
      revalidatePath(`/locations/${slug}`);
      revalidatePath('/locations');
      revalidated.push(`location-${slug}`, '/locations');
    } else {
      clearAllPageCaches();
      revalidatePath('/');
      revalidatePath('/preview');
      revalidatePath('/services', 'layout');
      revalidatePath('/locations', 'layout');
      revalidated.push('/', '/preview', '/services', '/locations');
    }

    return NextResponse.json({
      success: true,
      message: slug
        ? `Cache cleared for ${type} "${slug}". Refresh to see changes.`
        : 'Cache cleared. Refresh your page to see changes.',
      revalidated,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to revalidate';
    console.error('Error revalidating:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
