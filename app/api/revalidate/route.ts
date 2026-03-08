import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import {
  clearLandingPageCache,
  clearAboutPageCache,
  clearContactPageCache,
  clearChecklistPageCache,
  clearFAQPageCache,
  clearServiceCaches,
  clearLocationCaches,
  clearAllPageCaches,
} from '@/lib/cms-adapter';

/**
 * On-demand revalidation endpoint (Strapi webhook-compatible).
 *
 * Strapi webhook setup (Admin → Settings → Webhooks):
 *   URL:     https://yoursite.com/api/revalidate?secret=YOUR_SECRET
 *   Events:  entry.publish, entry.update, entry.unpublish, entry.delete
 *   Headers: Content-Type: application/json
 *
 * Manual POST:
 *   { type: 'service'|'location'|'all', slug?: string }
 */

/* ------------------------------------------------------------------ */
/*  Model → revalidation mapping                                       */
/* ------------------------------------------------------------------ */

const SERVICE_SLUGS = [
  'routine-cleaning', 'deep-cleaning', 'airbnb-cleaning',
  'moving-cleaning', 'post-construction-cleaning', 'extras-cleaning',
  'office-cleaning', 'medical-cleaning', 'gym-cleaning',
  'retail-cleaning', 'school-cleaning', 'property-cleaning',
  'other-commercial-cleaning',
];

const LOCATION_SLUGS = [
  'bergen-county', 'essex-county', 'hudson-county',
  'morris-county', 'passaic-county', 'union-county',
];

/**
 * Map a Strapi model UID (e.g. "api::about.about") to the pages that must
 * be purged and the in-memory cache clearer to call.
 */
function resolveModel(model: string): {
  paths: string[];
  clearFn: (() => void) | null;
  tags: string[];
} {
  // Normalise: "api::routine-cleaning.routine-cleaning" → "routine-cleaning"
  const slug = model.replace('api::', '').split('.')[0];

  if (SERVICE_SLUGS.includes(slug)) {
    return {
      paths: [`/services/${slug}`, '/services', '/'],
      tags: [`service-${slug}`],
      clearFn: clearServiceCaches,
    };
  }
  if (LOCATION_SLUGS.includes(slug)) {
    return {
      paths: [`/locations/${slug}`, '/locations', '/'],
      tags: [`location-${slug}`],
      clearFn: clearLocationCaches,
    };
  }

  // Single-type pages
  const PAGE_MAP: Record<string, { paths: string[]; clearFn: (() => void) | null }> = {
    'landing-page':      { paths: ['/', '/'],                          clearFn: clearLandingPageCache },
    'about':             { paths: ['/company/about', '/'],             clearFn: clearAboutPageCache },
    'contact':           { paths: ['/contact', '/'],                   clearFn: clearContactPageCache },
    'checklist-page':    { paths: ['/company/checklist', '/'],         clearFn: clearChecklistPageCache },
    'faq-page':          { paths: ['/faq', '/'],                       clearFn: clearFAQPageCache },
    'careers-page':      { paths: ['/careers', '/'],                   clearFn: null },
    'privacy-policy':    { paths: ['/privacy-policy', '/'],            clearFn: null },
    'terms-of-service':  { paths: ['/terms-of-service', '/'],          clearFn: null },
    'global-setting':    { paths: ['/'],                               clearFn: null },
  };

  if (slug in PAGE_MAP) {
    return { ...PAGE_MAP[slug], tags: [] };
  }

  // Unknown model → full revalidation
  return { paths: ['/'], tags: [], clearFn: clearAllPageCaches };
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  // Auth: optional secret via query param
  const secret = request.nextUrl.searchParams.get('secret');
  const expected = process.env.REVALIDATION_SECRET;
  if (expected && secret !== expected) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  try {
    let body: Record<string, any> = {};
    try {
      body = await request.json().catch(() => ({}));
    } catch {
      // Empty body → full revalidation
    }

    const revalidated: string[] = [];

    // Detect Strapi webhook payload
    const model: string | undefined = body.model;
    if (model) {
      const { paths, tags, clearFn } = resolveModel(model);
      clearFn?.();
      for (const tag of tags) { revalidateTag(tag); revalidated.push(`tag:${tag}`); }
      for (const p of [...new Set(paths)]) { revalidatePath(p); revalidated.push(p); }
    } else {
      // Manual / explicit format
      const type = body.type ?? 'all';
      const slug = body.slug as string | undefined;

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
        revalidatePath('/', 'layout');
        revalidated.push('/');
      }
    }

    console.log(`[revalidate] purged: ${revalidated.join(', ')}`);

    return NextResponse.json({
      success: true,
      revalidated,
      now: Date.now(),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to revalidate';
    console.error('[revalidate] error:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
