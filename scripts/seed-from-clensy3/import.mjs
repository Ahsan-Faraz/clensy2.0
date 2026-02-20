/**
 * Import Clensy-3 data into Strapi
 * Usage: node scripts/seed-from-clensy3/import.mjs
 * Env: STRAPI_URL, STRAPI_API_PREFIX (default: admin/api), STRAPI_API_TOKEN
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';
const STRAPI_PREFIX = process.env.STRAPI_API_PREFIX || 'admin/api';
const DATA_DIR = path.join(__dirname, 'data');

async function fetchStrapi(endpoint, method = 'GET', body) {
  const url = `${STRAPI_URL.replace(/\/+$/, '')}/${STRAPI_PREFIX.replace(/^\/+|\/+$/g, '')}/${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }) };
  const res = await fetch(url, { method, headers, ...(body && { body: JSON.stringify(body) }) });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch (e) { return { error: { message: `Invalid JSON: ${text?.slice(0, 200)}` } }; }
  if (!res.ok) return { error: { message: json?.error?.message || json?.message || res.statusText || String(res.status), details: json } };
  return json;
}

async function findExisting(collection, slug) {
  const result = await fetchStrapi(`${collection}?filters[slug][$eq]=${encodeURIComponent(slug)}`);
  const data = result.data;
  if (Array.isArray(data) && data.length > 0) return { id: data[0].id, documentId: data[0].documentId };
  if (data?.documentId) return { id: data.id, documentId: data.documentId };
  return null;
}

async function importLocation(slug) {
  const filePath = path.join(DATA_DIR, 'locations', `${slug}.json`);
  if (!fs.existsSync(filePath)) { console.warn(`  Skipping ${slug}: file not found`); return false; }
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const existing = await findExisting('locations', slug);
  const result = await fetchStrapi(existing ? `locations/${existing.documentId}` : 'locations', existing ? 'PUT' : 'POST', payload);
  if (result.error) { console.error(`  ✗ ${slug}: ${result.error.message}`, result.error.details ? JSON.stringify(result.error.details).slice(0, 300) : ''); return false; }
  console.log(`  ✓ ${slug} (${existing ? 'updated' : 'created'})`); return true;
}

async function importService(slug) {
  const filePath = path.join(DATA_DIR, 'services', `${slug}.json`);
  if (!fs.existsSync(filePath)) { console.warn(`  Skipping ${slug}: file not found`); return false; }
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const data = payload.data;
  if (data.cleaningAreas?.length) {
    data.cleaningAreas = data.cleaningAreas.map(a => ({ title: a.title, description: a.description || '', imageUrl: a.imageUrl || '', features: a.features || [] }));
  }
  if (data.faqs?.length) data.faqs = data.faqs.map(f => ({ question: f.question, answer: f.answer }));
  if (data.clientTestimonials?.length) data.clientTestimonials = data.clientTestimonials.map(t => ({ rating: t.rating || 5, review: t.review || '', clientName: t.clientName || '', clientLocation: t.clientLocation || '', avatarBgColor: t.avatarBgColor || 'blue-500' }));
  data.publishedAt = new Date().toISOString();
  const existing = await findExisting('services', slug);
  const result = await fetchStrapi(existing ? `services/${existing.documentId}` : 'services', existing ? 'PUT' : 'POST', { data });
  if (result.error) { console.error(`  ✗ ${slug}: ${result.error.message}`, result.error.details ? JSON.stringify(result.error.details).slice(0, 300) : ''); return false; }
  console.log(`  ✓ ${slug} (${existing ? 'updated' : 'created'})`); return true;
}

async function importContact() {
  const filePath = path.join(DATA_DIR, 'contact.json');
  if (!fs.existsSync(filePath)) { console.warn('  Skipping contact: file not found'); return false; }
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const data = payload.data;
  data.publishedAt = new Date().toISOString();
  const result = await fetchStrapi('contact', 'PUT', { data });
  if (result.error) { console.error('  ✗ contact:', result.error.message); return false; }
  console.log('  ✓ contact (updated)'); return true;
}

async function main() {
  console.log('Clensy-3 → Strapi Import');
  console.log('STRAPI_URL:', STRAPI_URL);
  console.log('STRAPI_PREFIX:', STRAPI_PREFIX);
  console.log('');
  console.log('Importing deep-cleaning...');
  await importService('deep-cleaning');
  console.log('Importing bergen, passaic (fix image URLs)...');
  await importLocation('bergen');
  await importLocation('passaic');
  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
