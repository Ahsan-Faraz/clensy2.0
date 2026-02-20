/**
 * Import Clensy-3 data into Strapi
 *
 * Usage:
 *   STRAPI_URL=http://localhost:1337 STRAPI_API_TOKEN=your-token npx ts-node scripts/seed-from-clensy3/import.ts
 *
 * Set STRAPI_API_PREFIX to match your Strapi config (default: /api for Strapi v5 Content API)
 */

import * as fs from 'fs';
import * as path from 'path';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';
// Strapi v5 Content API is typically at /api; admin API at /admin/api
const STRAPI_PREFIX = process.env.STRAPI_API_PREFIX || 'api';

const SCRIPT_DIR = __dirname;
const DATA_DIR = path.join(SCRIPT_DIR, 'data');

interface StrapiPayload {
  data: Record<string, unknown>;
}

async function fetchStrapi(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: object
): Promise<{ data?: unknown; error?: { message: string } }> {
  const url = `${STRAPI_URL.replace(/\/+$/, '')}/${STRAPI_PREFIX.replace(/^\/+|\/+$/g, '')}/${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
  };
  const res = await fetch(url, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });
  const json = await res.json();
  if (!res.ok) {
    return { error: { message: json.error?.message || res.statusText || String(res.status) } };
  }
  return json;
}

async function findExistingBySlug(collection: string, slug: string): Promise<number | null> {
  const result = await fetchStrapi(
    `${collection}?filters[slug][$eq]=${encodeURIComponent(slug)}&fields[0]=id`
  );
  const data = result.data as any;
  if (Array.isArray(data) && data.length > 0) {
    return data[0].id;
  }
  if (data?.id) return data.id;
  return null;
}

async function importLocation(slug: string): Promise<boolean> {
  const filePath = path.join(DATA_DIR, 'locations', `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`  Skipping ${slug}: file not found`);
    return false;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const payload: StrapiPayload = JSON.parse(raw);

  const existingId = await findExistingBySlug('locations', slug);
  const endpoint = existingId ? `locations/${existingId}` : 'locations';
  const method = existingId ? 'PUT' : 'POST';

  const result = await fetchStrapi(endpoint, method, payload);
  if (result.error) {
    console.error(`  ✗ ${slug}: ${result.error.message}`);
    return false;
  }
  console.log(`  ✓ ${slug} (${existingId ? 'updated' : 'created'})`);
  return true;
}

async function importService(slug: string): Promise<boolean> {
  const filePath = path.join(DATA_DIR, 'services', `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`  Skipping ${slug}: file not found`);
    return false;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const payload: StrapiPayload = JSON.parse(raw);

  // Transform cleaningAreas: use imageUrl since we're not uploading media
  const data = payload.data as Record<string, unknown>;
  if (data.cleaningAreas && Array.isArray(data.cleaningAreas)) {
    data.cleaningAreas = data.cleaningAreas.map((area: any) => ({
      title: area.title,
      description: area.description || '',
      imageUrl: area.imageUrl || '',
      features: area.features || [],
    }));
  }
  // Transform faqs for Strapi component format
  if (data.faqs && Array.isArray(data.faqs)) {
    data.faqs = data.faqs.map((faq: any) => ({
      question: faq.question,
      answer: faq.answer,
    }));
  }
  // Transform clientTestimonials
  if (data.clientTestimonials && Array.isArray(data.clientTestimonials)) {
    data.clientTestimonials = data.clientTestimonials.map((t: any) => ({
      rating: t.rating || 5,
      review: t.review || '',
      clientName: t.clientName || '',
      clientLocation: t.clientLocation || '',
      avatarBgColor: t.avatarBgColor || 'blue-500',
    }));
  }
  // Publish by default (Strapi v5 uses publishedAt)
  data.publishedAt = new Date().toISOString();

  const existingId = await findExistingBySlug('services', slug);
  const endpoint = existingId ? `services/${existingId}` : 'services';
  const method = existingId ? 'PUT' : 'POST';

  const result = await fetchStrapi(endpoint, method, { data: payload.data });
  if (result.error) {
    console.error(`  ✗ ${slug}: ${result.error.message}`);
    return false;
  }
  console.log(`  ✓ ${slug} (${existingId ? 'updated' : 'created'})`);
  return true;
}

async function main() {
  console.log('Clensy-3 → Strapi Import');
  console.log('STRAPI_URL:', STRAPI_URL);
  console.log('STRAPI_PREFIX:', STRAPI_PREFIX);
  console.log('');

  const locationSlugs = ['bergen', 'hudson', 'essex', 'passaic', 'union', 'morris'];
  const serviceSlugs = [
    'routine-cleaning',
    'airbnb-cleaning',
    'deep-cleaning',
    'moving-cleaning',
    'post-construction-cleaning',
    'office-cleaning',
    'medical-cleaning',
    'gym-cleaning',
    'retail-cleaning',
    'school-cleaning',
    'property-cleaning',
    'other-commercial-cleaning',
    'extras',
  ];

  console.log('Importing locations...');
  for (const slug of locationSlugs) {
    await importLocation(slug);
  }

  console.log('\nImporting services...');
  for (const slug of serviceSlugs) {
    await importService(slug);
  }

  console.log('\nDone. Run Strapi and verify in Content Manager.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
