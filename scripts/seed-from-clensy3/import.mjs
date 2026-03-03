/**
 * Import Clensy-3 data into Strapi
 * Usage: node scripts/seed-from-clensy3/import.mjs           # all services + contact
 *        node scripts/seed-from-clensy3/import.mjs routine-cleaning   # only routine-cleaning
 *        npm run seed:strapi
 * Env: STRAPI_URL, STRAPI_API_PREFIX (default: admin/api), STRAPI_API_TOKEN, SEED_ONLY
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const envPath = path.join(projectRoot, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
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

async function importService(slug) {
  const filePath = path.join(DATA_DIR, 'services', `${slug}.json`);
  if (!fs.existsSync(filePath)) { console.warn(`  Skipping ${slug}: file not found`); return false; }
  let raw = fs.readFileSync(filePath, 'utf-8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const payload = JSON.parse(raw);
  const data = payload.data;
  if (data.cleaningAreas?.length) {
    data.cleaningAreas = data.cleaningAreas.map(a => ({ title: a.title, description: a.description || '', imageUrl: a.imageUrl || '', features: a.features || [] }));
  }
  if (data.faqs?.length) data.faqs = data.faqs.map(f => ({ question: f.question, answer: f.answer }));
  if (data.clientTestimonials?.length) data.clientTestimonials = data.clientTestimonials.map(t => ({ rating: t.rating || 5, review: t.review || '', clientName: t.clientName || '', clientLocation: t.clientLocation || '', avatarBgColor: t.avatarBgColor || 'blue-500' }));

  const cd = data.customData || {};

  // Extras: promote customData to structured components so Strapi Admin has editable forms
  if (slug === 'extras') {
    data.extrasPricing = cd.extrasPricing || [];
    data.premiumExtraServices = (cd.premiumExtraServices || []).map((e) => {
      const { id, ...rest } = e;
      const out = { ...rest, serviceId: e.serviceId || e.id };
      if (rest.image) out.imageUrl = rest.image;
      delete out.image;
      return out;
    });
    data.howToAddExtraServicesSteps = cd.howToAddExtraServicesSteps || [];
    data.extrasTrustIndicators = cd.trustIndicators || [];
    data.extrasClientTestimonials = (cd.clientTestimonials || []).map(t => ({
      rating: t.rating || 5,
      review: t.review || '',
      clientName: t.clientName || '',
      clientLocation: t.clientLocation || '',
      avatarBgColor: t.avatarBgColor || 'bg-blue-500',
    }));
    data.pricingHeading = cd.pricingHeading || 'Extras Pricing';
    data.pricingSubheading = cd.pricingSubheading || '';
  }

  // Moving: promote customData to structured components
  if (slug === 'moving-cleaning') {
    if (cd.reduceStressSection) data.reduceStressSection = cd.reduceStressSection;
    if (cd.beforeAfter) data.beforeAfter = cd.beforeAfter;
    if (cd.clientTestimonials?.length) data.movingClientTestimonials = cd.clientTestimonials.map(t => ({ rating: t.rating || 5, review: t.review || '', clientName: t.clientName || '', clientLocation: t.clientLocation || '', avatarBgColor: t.avatarBgColor || 'blue-500' }));
    if (cd.benefit1Icon) data.benefit1Icon = cd.benefit1Icon;
    if (cd.benefit2Icon) data.benefit2Icon = cd.benefit2Icon;
    if (cd.benefit3Icon) data.benefit3Icon = cd.benefit3Icon;
  }

  // Deep: promote customData to structured components
  if (slug === 'deep-cleaning') {
    if (cd.comparison) {
      const comp = { ...cd.comparison };
      if (comp.regularCleaning?.features) comp.regularCleaning = { ...comp.regularCleaning, features: comp.regularCleaning.features.map(f => typeof f === 'string' ? { title: f, description: '' } : f) };
      if (comp.deepCleaning?.features) comp.deepCleaning = { ...comp.deepCleaning, features: comp.deepCleaning.features.map(f => typeof f === 'string' ? { title: f, description: '' } : f) };
      data.deepCleaningComparison = comp;
    }
    if (cd.whenToChoose) data.whenToChoose = cd.whenToChoose;
    if (cd.beforeAfter) data.beforeAfter = cd.beforeAfter;
  }

  // Airbnb: promote customData to structured components
  if (slug === 'airbnb-cleaning') {
    if (cd.beforeAfter) data.beforeAfter = cd.beforeAfter;
    if (cd.successStories) data.successStories = cd.successStories;
    if (cd.serviceFeatures?.length) data.serviceFeatures = cd.serviceFeatures;
  }

  // Post-construction: promote customData to structured components
  if (slug === 'post-construction-cleaning') {
    if (cd.beforeAfter) data.beforeAfter = cd.beforeAfter;
    if (cd.step4Title) data.postConstructionStep4Title = cd.step4Title;
    if (cd.step4Description) data.postConstructionStep4Description = cd.step4Description;
    if (cd.safetyHeading || cd.safetySubheading || cd.ppeTitle || cd.ppeDescription || cd.ppeFeatures || cd.hazmatTitle || cd.hazmatDescription || cd.hazmatFeatures) {
      data.postConstructionSafety = {
        heading: cd.safetyHeading || 'Safety Standards',
        subheading: cd.safetySubheading || '',
        ppeTitle: cd.ppeTitle || '',
        ppeDescription: cd.ppeDescription || '',
        ppeFeatures: cd.ppeFeatures || [],
        hazmatTitle: cd.hazmatTitle || '',
        hazmatDescription: cd.hazmatDescription || '',
        hazmatFeatures: cd.hazmatFeatures || [],
      };
    }
    if (cd.clientTestimonials?.length) data.postConstructionClientTestimonials = cd.clientTestimonials.map(t => ({ rating: t.rating || 5, review: t.review || '', clientName: t.clientName || '', clientLocation: t.clientLocation || '', avatarBgColor: t.avatarBgColor || 'blue-500' }));
  }

  // Office: promote customData to structured components
  if (slug === 'office-cleaning') {
    if (cd.businessBenefits) data.businessBenefits = cd.businessBenefits;
    if (cd.trustIndicators?.length) data.serviceTrustIndicators = cd.trustIndicators;
  }

  // Gym: promote customData to structured components
  if (slug === 'gym-cleaning') {
    if (cd.specializedEquipment) data.specializedEquipment = cd.specializedEquipment;
    if (cd.healthAndSafetyStandards) data.healthAndSafetyStandards = cd.healthAndSafetyStandards;
    if (cd.trustIndicators?.length) data.serviceTrustIndicators = cd.trustIndicators;
  }

  // Medical, Retail: promote trustIndicators
  if (slug === 'medical-cleaning' || slug === 'retail-cleaning') {
    if (cd.trustIndicators?.length) data.serviceTrustIndicators = cd.trustIndicators;
  }

  data.publishedAt = new Date().toISOString();
  EXCLUDE_FIELDS.forEach((f) => delete data[f]);
  const existing = await findExisting('services', slug);
  const result = await fetchStrapi(existing ? `services/${existing.documentId}` : 'services', existing ? 'PUT' : 'POST', { data });
  if (result.error) { console.error(`  ✗ ${slug}: ${result.error.message}`, result.error.details ? JSON.stringify(result.error.details).slice(0, 400) : ''); return false; }
  console.log(`  ✓ ${slug} (${existing ? 'updated' : 'created'})`); return true;
}

async function importContact() {
  const filePath = path.join(DATA_DIR, 'contact.json');
  if (!fs.existsSync(filePath)) { console.warn('  Skipping contact: file not found'); return false; }
  let raw = fs.readFileSync(filePath, 'utf-8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const payload = JSON.parse(raw);
  const data = payload.data;
  data.publishedAt = new Date().toISOString();
  const result = await fetchStrapi('contact', 'PUT', { data });
  if (result.error) { console.error('  ✗ contact:', result.error.message); return false; }
  console.log('  ✓ contact (updated)'); return true;
}

/** Fields to exclude - relation/media fields cause "Invalid relations" when sent as string URLs */
const EXCLUDE_FIELDS = [
  'Service_Page', 'documentId', 'id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy',
  'heroBackgroundImage', 'featureSectionImage', 'benefitsImage', 'step1Image', 'step2Image', 'step3Image',
];

/** All service slugs to import (matches data/services/*.json) */
const SERVICE_SLUGS = [
  'routine-cleaning',
  'deep-cleaning',
  'moving-cleaning',
  'post-construction-cleaning',
  'airbnb-cleaning',
  'office-cleaning',
  'gym-cleaning',
  'medical-cleaning',
  'retail-cleaning',
  'school-cleaning',
  'property-cleaning',
  'extras',
  'other-commercial-cleaning',
];

async function main() {
  const onlySlug = process.argv[2] || process.env.SEED_ONLY;
  const slugsToRun = onlySlug ? [onlySlug] : SERVICE_SLUGS;

  console.log('Clensy-3 → Strapi Import');
  console.log('STRAPI_URL:', STRAPI_URL);
  console.log('STRAPI_PREFIX:', STRAPI_PREFIX);
  if (onlySlug) console.log('Running only:', onlySlug);
  if (!STRAPI_API_TOKEN) console.warn('Warning: STRAPI_API_TOKEN not set. Add it to .env for authenticated API access.');
  console.log('');

  let servicesOk = 0;
  let servicesFail = 0;
  console.log('Importing services...');
  for (const slug of slugsToRun) {
    const ok = await importService(slug);
    if (ok) servicesOk++;
    else servicesFail++;
  }
  console.log(`Services: ${servicesOk} OK, ${servicesFail} failed`);

  if (!onlySlug) {
    console.log('\nImporting contact...');
    await importContact();
  }

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
