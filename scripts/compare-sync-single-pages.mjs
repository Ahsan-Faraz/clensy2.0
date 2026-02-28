#!/usr/bin/env node
/**
 * Compare & Sync Single Pages: MongoDB (source) → Strapi
 *
 * Runs interactively: shows differences, asks Y/N to update each page.
 *
 * Usage:
 *   node scripts/compare-sync-single-pages.mjs
 *
 * Required env (from .env or set manually):
 *   MONGODB_URI=mongodb+srv://...  (or use sample.json - see below)
 *   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
 *   STRAPI_API_TOKEN=your-token
 *
 * Optional: Use sample.json instead of live MongoDB
 *   Set USE_SAMPLE_FILE=1 and ensure sample.json exists in project root
 *   (sample.json must be valid JSON - run the Compass script and export as JSON)
 */

import { MongoClient } from 'mongodb';
import { createInterface } from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Load .env
try {
  const envPath = path.join(projectRoot, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) {
        process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
      }
    });
  }
} catch (_) {}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.oplpgp2.mongodb.net/clensy-cms';
const STRAPI_URL = (process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/, '');
const STRAPI_API_PREFIX = process.env.STRAPI_API_PREFIX || 'admin/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || process.env.NEXT_STRAPI_CLIENT_TOKEN;
const USE_SAMPLE_FILE = process.env.USE_SAMPLE_FILE === '1' || process.env.USE_SAMPLE_FILE === 'true';

// --- MongoDB → Strapi field mappers ---
// Each mapper converts nested MongoDB doc to flat Strapi payload

function stripIds(obj) {
  if (Array.isArray(obj)) return obj.map(stripIds);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k === '_id' || k === '__v') continue;
      out[k] = stripIds(v);
    }
    return out;
  }
  return obj;
}

function mongoToStrapiAbout(m) {
  if (!m) return null;
  const h = m.heroSection || {};
  const our = m.ourStorySection || {};
  const why = m.whyWeStartedSection || {};
  const diff = m.whatMakesUsDifferentSection || {};
  const rc = diff.residentialCommercial || {};
  const elite = diff.eliteTeam || {};
  const who = m.whoWeServeSection || {};
  const mission = m.ourMissionSection || {};
  const cta = m.ctaSection || {};
  const tech = m.clientFocusedTech || {};
  return {
    heroHeading: h.heading ?? '',
    heroTagline: h.tagline ?? '',
    ourStoryHeading: our.heading ?? '',
    ourStoryParagraph1: our.paragraph1 ?? '',
    ourStoryParagraph2: our.paragraph2 ?? '',
    ourStoryParagraph3: our.paragraph3 ?? '',
    ourStoryImageUrl: our.image ?? '',
    whyWeStartedHeading: why.heading ?? '',
    whyWeStartedSubtitle: why.subtitle ?? '',
    whyWeStartedQuoteText: why.quoteText ?? '',
    whyWeStartedParagraph1: why.paragraph1 ?? '',
    whyWeStartedParagraph2: why.paragraph2 ?? '',
    whyWeStartedParagraph3: why.paragraph3 ?? '',
    whatMakesUsDifferentHeading: diff.heading ?? '',
    residentialCommercialTitle: rc.title ?? '',
    residentialCommercialParagraph1: rc.paragraph1 ?? '',
    residentialCommercialParagraph2: rc.paragraph2 ?? '',
    eliteTeamTitle: elite.title ?? '',
    eliteTeamParagraph1: elite.paragraph1 ?? '',
    eliteTeamParagraph2: elite.paragraph2 ?? '',
    eliteTeamImageUrl: elite.image ?? '',
    clientFocusedTechHeading: tech.heading ?? '',
    clientFocusedTechFeatures: stripIds(tech.features || []) ?? [],
    whoWeServeHeading: who.heading ?? '',
    whoWeServeSubtitle: who.subtitle ?? '',
    customerTypes: stripIds(who.customerTypes || []) ?? [],
    ourMissionHeading: mission.heading ?? '',
    ourMissionParagraph1: mission.paragraph1 ?? '',
    ourMissionParagraph2: mission.paragraph2 ?? '',
    ourMissionParagraph3: mission.paragraph3 ?? '',
    ourMissionParagraph4: mission.paragraph4 ?? '',
    ourMissionClosingLine: mission.closingLine ?? '',
    ctaHeading: cta.heading ?? '',
    ctaDescription: cta.description ?? '',
    ctaBookButtonText: cta.bookButtonText ?? '',
    ctaContactButtonText: cta.contactButtonText ?? '',
  };
}

function mongoToStrapiContact(m) {
  if (!m) return null;
  const h = m.heroSection || {};
  const trust = m.trustSection || {};
  const stats = m.statsSection || {};
  const ci = m.contactInformation || {};
  const ph = ci.phone || {};
  const em = ci.email || {};
  const off = ci.officeLocation || {};
  const bh = ci.businessHours || {};
  const imm = ci.immediateAssistance || {};
  const cons = m.consultationSection || {};
  return {
    heroTopLabel: h.topLabel ?? '',
    heroHeading: h.heading ?? '',
    heroDescription: h.description ?? '',
    heroSendMessageButtonText: h.sendMessageButtonText ?? '',
    heroSupportText: h.supportText ?? '',
    heroResponseText: h.responseText ?? '',
    heroImageUrl: h.image ?? '',
    trustMainText: trust.mainText ?? '',
    trustSubtitle: trust.subtitle ?? '',
    serviceTags: stripIds(trust.serviceTags || []) ?? [],
    statsIndicators: stripIds(stats.indicators || []) ?? [],
    contactSectionTitle: ci.sectionTitle ?? '',
    phoneTitle: ph.title ?? '',
    phoneDescription: ph.description ?? '',
    phoneNumber: ph.phoneNumber ?? '',
    emailTitle: em.title ?? '',
    emailDescription: em.description ?? '',
    emailAddress: em.emailAddress ?? '',
    officeTitle: off.title ?? '',
    officeDescription: off.description ?? '',
    addressLine1: off.addressLine1 ?? '',
    addressLine2: off.addressLine2 ?? '',
    cityStateZip: off.cityStateZip ?? '',
    businessHoursTitle: bh.title ?? '',
    businessHoursDescription: bh.description ?? '',
    businessHours: stripIds(bh.hours || []) ?? [],
    immediateAssistanceTitle: imm.title ?? '',
    immediateAssistanceDescription: imm.description ?? '',
    immediateAssistanceButtonText: imm.buttonText ?? '',
    consultationHeading: cons.heading ?? '',
    consultationDescription: cons.description ?? '',
    consultationButtonText: cons.buttonText ?? '',
  };
}

function mongoToStrapiFaq(m) {
  if (!m) return null;
  const h = m.heroSection || {};
  const cats = m.faqCategories || {};
  const still = m.stillHaveQuestionsSection || {};
  const contact = m.contactSection || {};
  const trust = m.trustIndicatorsSection || {};
  // Strapi comprehensiveFAQs: [{ category, questions: [{question, answer}] }]
  const comprehensiveFAQs = [];
  for (const [, v] of Object.entries(cats)) {
    if (v && typeof v === 'object' && v.questions) {
      comprehensiveFAQs.push({
        category: v.name ?? '',
        questions: stripIds(v.questions || []),
      });
    }
  }
  return {
    heroTopLabel: h.topLabel ?? '',
    heroHeading: h.heading ?? '',
    heroDescription: h.description ?? '',
    comprehensiveFAQs,
    stillHaveQuestionsHeading: still.heading ?? '',
    stillHaveQuestionsDescription: still.description ?? '',
    stillHaveQuestionsCards: stripIds(still.cards || []) ?? [],
    contactSectionHeading: contact.heading ?? '',
    contactSectionDescription: contact.description ?? '',
    contactEmail: contact.emailSection?.email ?? '',
    contactPhone: contact.callSection?.phone ?? '',
    contactButtonText: contact.contactButtonText ?? '',
    trustIndicators: stripIds(trust.indicators || []) ?? [],
  };
}

function mongoToStrapiCareers(m) {
  if (!m) return null;
  const h = m.heroSection || {};
  const ben = m.benefitsSection || {};
  const pos = m.positionsSection || {};
  const test = m.testimonialsSection || {};
  const app = m.applicationSection || {};
  const cont = m.contactSection || {};
  return {
    heroImageUrl: h.heroImage ?? '',
    heroTopLabel: h.topLabel ?? '',
    heroHeading: h.heading ?? '',
    heroDescription: h.description ?? '',
    heroPrimaryButtonText: h.primaryButtonText ?? '',
    heroSecondaryButtonText: h.secondaryButtonText ?? '',
    heroTeamMembersCount: h.teamMembersCount ?? '',
    benefitsHeading: ben.heading ?? '',
    benefitsDescription: ben.description ?? '',
    benefits: stripIds(ben.benefits || []) ?? [],
    positionsHeading: pos.heading ?? '',
    positionsDescription: pos.description ?? '',
    positions: stripIds(pos.positions || []) ?? [],
    testimonialsHeading: test.heading ?? '',
    testimonialsDescription: test.description ?? '',
    employeeTestimonials: stripIds(test.testimonials || []) ?? [],
    applicationHeading: app.heading ?? '',
    applicationDescription: app.description ?? '',
    applicationSubmitButtonText: app.submitButtonText ?? '',
    contactHeading: cont.heading ?? '',
    contactDescription: cont.description ?? '',
    contactPhoneText: cont.phoneText ?? '',
    contactEmailText: cont.emailText ?? '',
  };
}

function mongoToStrapiChecklist(m) {
  if (!m) return null;
  const h = m.heroSection || {};
  const inter = m.interactiveGuideSection || {};
  const main = m.mainChecklistSection || {};
  const cta = m.ctaSection || {};
  const items = main.cleaningItems || {};
  const rt = main.roomTitles || {};
  const roomKeys = ['kitchen', 'bathroom', 'bedroom', 'living'];
  const checklistData = {};
  for (const room of roomKeys) {
    const r = items.routine?.[room] || [];
    const d = items.deep?.[room] || [];
    const mov = items.moving?.[room] || [];
    checklistData[room] = {
      title: rt[room] ?? room,
      routine: stripIds(r),
      deep: stripIds(d),
      moving: stripIds(mov),
    };
  }
  return {
    heroHeading: h.heading ?? '',
    heroDescription: h.description ?? '',
    heroCtaButtonText: h.buttonText ?? '',
    interactiveGuideHeading: inter.heading ?? '',
    interactiveGuideDescription: inter.description ?? '',
    checklistSectionHeading: main.heading ?? '',
    checklistSectionDescription: main.description ?? '',
    checklistData,
    ctaHeading: cta.heading ?? '',
    ctaDescription: cta.description ?? '',
    ctaButtonText: cta.buttonText ?? '',
  };
}

function mongoToStrapiPrivacy(m) {
  if (!m) return null;
  const h = m.heroSection || {};
  const company = m.companyInfo || {};
  const sms = m.smsConsent || {};
  return {
    heroHeading: h.heading ?? '',
    heroDescription: h.description ?? '',
    websiteUrl: company.websiteUrl ?? '',
    companyEmail: company.email ?? '',
    companyPhone: company.phone ?? '',
    sections: stripIds(m.sections || []) ?? [],
    smsConsentDescription: sms.description ?? '',
    smsOptOutInstructions: sms.optOutInstructions ?? '',
  };
}

function mongoToStrapiTerms(m) {
  if (!m) return null;
  const h = m.heroSection || {};
  const company = m.companyInfo || {};
  const agree = m.agreementSection || {};
  return {
    heroHeading: h.heading ?? '',
    heroDescription: h.description ?? '',
    websiteUrl: company.websiteUrl ?? '',
    companyEmail: company.email ?? '',
    companyPhone: company.phone ?? '',
    sections: stripIds(m.sections || []) ?? [],
    agreementDescription: agree.description ?? '',
    lastUpdated: agree.lastUpdated ?? '',
  };
}

/**
 * Landing Page: merges heros, howitworks, comparisons, ctas, checklists, reviews
 * into Strapi landing-page flat format
 */
function mongoToStrapiLandingPage(mongoLanding) {
  if (!mongoLanding) return null;
  const hero = mongoLanding.heros || mongoLanding.herosections || {};
  const how = mongoLanding.howitworks || {};
  const comp = mongoLanding.comparisons || {};
  const cta = mongoLanding.ctas || {};
  const checklist = mongoLanding.checklists || {};
  const review = mongoLanding.reviews || {};
  const step1 = how.step1 || {};
  const step2 = how.step2 || {};
  const step3 = how.step3 || {};
  return {
    heroTopLabel: hero.topLabel ?? '',
    heroHeading: hero.heading ?? '',
    heroSubheading: hero.subheading ?? '',
    heroButtonText: hero.buttonText ?? '',
    heroButtonLink: hero.buttonLink ?? '/booking',
    heroFeature1: hero.feature1 ?? '',
    heroFeature2: hero.feature2 ?? '',
    heroBackgroundImageUrl: hero.backgroundImage ?? hero.heroBackgroundImageUrl ?? '',
    howItWorksHeading: how.heading ?? 'How It Works',
    step1Title: step1.title ?? '',
    step1Description: step1.description ?? '',
    step1FeatureText: step1.featureText ?? '',
    step2Title: step2.title ?? '',
    step2Description: step2.description ?? '',
    step2FeatureText: step2.featureText ?? '',
    step3Title: step3.title ?? '',
    step3Description: step3.description ?? '',
    step3FeatureText: step3.featureText ?? '',
    howItWorksButtonText: how.buttonText ?? '',
    checklistHeading: checklist.heading ?? '',
    checklistDescription: checklist.description ?? '',
    checklistButtonText: checklist.buttonText ?? '',
    checklistItems: stripIds(checklist.checklistItems || checklist.items || checklist.cleaningItems || {}) ?? {},
    comparisonHeading: comp.heading ?? '',
    comparisonDescription: comp.description ?? '',
    comparisonButtonText: comp.buttonText ?? '',
    comparisonFeatures: stripIds(comp.features || comp.comparisonFeatures || []) ?? [],
    reviewsHeading: review.heading ?? '',
    reviewsButtonText: review.buttonText ?? '',
    testimonials: stripIds(review.testimonials || review.reviews || []) ?? [],
    ctaHeading: cta.heading ?? '',
    ctaDescription: cta.description ?? '',
    ctaLeftCardTitle: cta.leftCard?.title ?? cta.leftTitle ?? '',
    ctaLeftCardDescription: cta.leftCard?.description ?? cta.leftDescription ?? '',
    ctaLeftCardButtonText: cta.leftCard?.buttonText ?? cta.leftButtonText ?? '',
    ctaRightCardTitle: cta.rightCard?.title ?? cta.rightTitle ?? '',
    ctaRightCardDescription: cta.rightCard?.description ?? cta.rightDescription ?? '',
    ctaRightCardButtonText: cta.rightCard?.buttonText ?? cta.rightButtonText ?? '',
  };
}

// Single pages config: MongoDB collection -> Strapi endpoint + mapper
const SINGLE_PAGES = [
  { mongoColl: 'abouts', strapiEndpoint: 'about', mapper: mongoToStrapiAbout },
  { mongoColl: 'contacts', strapiEndpoint: 'contact', mapper: mongoToStrapiContact },
  { mongoColl: 'faqs', strapiEndpoint: 'faq-page', mapper: mongoToStrapiFaq },
  { mongoColl: 'careers', strapiEndpoint: 'careers-page', mapper: mongoToStrapiCareers },
  { mongoColl: 'checklistpages', strapiEndpoint: 'checklist-page', mapper: mongoToStrapiChecklist },
  { mongoColl: 'privacypolicies', strapiEndpoint: 'privacy-policy', mapper: mongoToStrapiPrivacy },
  { mongoColl: 'termsofservices', strapiEndpoint: 'terms-of-service', mapper: mongoToStrapiTerms },
];

// Landing page: multiple MongoDB collections merged into one Strapi document
const LANDING_PAGE_COLLECTIONS = ['heros', 'herosections', 'howitworks', 'comparisons', 'ctas', 'checklists', 'reviews'];

// --- Helpers ---
// Only compare fields that exist in MongoDB mapping. Ignore Strapi-only fields (seo, ogImage, etc.)
function diffOnlyMongoFields(mongoMapped, strapiCurrent, prefix = '') {
  const diffs = [];
  const mongoKeys = Object.keys(mongoMapped || {});
  for (const k of mongoKeys) {
    const vm = mongoMapped[k];
    const vs = strapiCurrent?.[k];
    const p = prefix ? `${prefix}.${k}` : k;
    if (typeof vm === 'object' && vm !== null && typeof vs === 'object' && vs !== null && !Array.isArray(vm) && !Array.isArray(vs)) {
      diffs.push(...diffOnlyMongoFields(vm, vs, p));
    } else if (JSON.stringify(vm) !== JSON.stringify(vs)) {
      diffs.push({ path: p, type: vs === undefined ? 'missing_in_strapi' : 'changed', mongo: vm, strapi: vs });
    }
  }
  return diffs;
}

function formatVal(v, maxLen = 80) {
  if (v === undefined || v === null) return String(v);
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  return s.length > maxLen ? s.slice(0, maxLen) + '...' : s;
}

async function fetchStrapi(endpoint, method = 'GET', body = null) {
  const url = `${STRAPI_URL}/${STRAPI_API_PREFIX}/${endpoint}`;
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
    },
  };
  if (body && (method === 'PUT' || method === 'POST')) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  if (!res.ok) {
    let errMsg = `Strapi ${res.status} ${res.statusText}: ${url}`;
    try {
      const errBody = JSON.parse(text);
      if (errBody?.error?.message) errMsg += `\n  ${errBody.error.message}`;
      else if (errBody?.message) errMsg += `\n  ${errBody.message}`;
      else if (errBody?.details) errMsg += `\n  ${JSON.stringify(errBody.details)}`;
      else errMsg += `\n  ${text.slice(0, 300)}`;
    } catch {
      if (text) errMsg += `\n  ${text.slice(0, 300)}`;
    }
    throw new Error(errMsg);
  }
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const STRAPI_SKIP_FIELDS = new Set([
  'id',
  'documentId',
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
  'publishedAt',
  'locale',
  'localizations',
  'About_Page',
  'Contact_Page',
  'Checklist_Page',
  'FAQ_Page',
  'Landing_Page',
]);

function cleanPayloadForStrapi(obj, depth = 0) {
  if (depth > 5) return obj;
  if (Array.isArray(obj)) return obj.map((v) => cleanPayloadForStrapi(v, depth + 1));
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (STRAPI_SKIP_FIELDS.has(k)) continue;
      if (k.endsWith('_Page') || k.endsWith('_page')) continue;
      out[k] = cleanPayloadForStrapi(v, depth + 1);
    }
    return out;
  }
  return obj;
}

async function updateStrapi(endpoint, data) {
  const cleaned = cleanPayloadForStrapi(data);
  return fetchStrapi(endpoint, 'PUT', { data: cleaned });
}

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (ans) => {
      rl.close();
      resolve((ans || '').trim().toLowerCase());
    });
  });
}

// --- Main ---
async function loadMongoData() {
  if (USE_SAMPLE_FILE) {
    const samplePath = path.join(projectRoot, 'sample.json');
    const landingPath = path.join(projectRoot, 'landing-page-samples.json');
    if (!fs.existsSync(samplePath) && !fs.existsSync(landingPath)) {
      throw new Error(`Neither sample.json nor landing-page-samples.json found. Run without USE_SAMPLE_FILE or use MongoDB.`);
    }
    const out = {};
    if (fs.existsSync(samplePath)) {
      const raw = fs.readFileSync(samplePath, 'utf-8');
      try {
        Object.assign(out, JSON.parse(raw));
      } catch (e) {
        throw new Error(`sample.json is not valid JSON. Export from MongoDB Compass (Collection → Export → JSON). ${e.message}`);
      }
    }
    if (fs.existsSync(landingPath)) {
      const raw = fs.readFileSync(landingPath, 'utf-8');
      try {
        Object.assign(out, JSON.parse(raw));
      } catch (e) {
        throw new Error(`landing-page-samples.json is not valid JSON. ${e.message}`);
      }
    }
    return out;
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();
  const out = {};
  for (const { mongoColl } of SINGLE_PAGES) {
    const doc = await db.collection(mongoColl).findOne({});
    out[mongoColl] = doc;
  }
  for (const coll of LANDING_PAGE_COLLECTIONS) {
    const doc = await db.collection(coll).findOne({});
    out[coll] = doc;
  }
  await client.close();
  return out;
}

async function main() {
  console.log('=== Compare & Sync Single Pages (MongoDB → Strapi) ===\n');

  if (!STRAPI_TOKEN) {
    console.warn('⚠️  STRAPI_API_TOKEN not set. Strapi fetch/update may fail.');
  }

  let mongoData;
  try {
    if (USE_SAMPLE_FILE) {
      console.log('Loading from sample.json...');
      mongoData = await loadMongoData();
    } else {
      console.log('Connecting to MongoDB...');
      mongoData = await loadMongoData();
    }
  } catch (e) {
    console.error('Failed to load MongoDB data:', e.message);
    process.exit(1);
  }

  console.log('Fetching Strapi data...\n');

  for (const { mongoColl, strapiEndpoint, mapper } of SINGLE_PAGES) {
    const mongoDoc = mongoData[mongoColl];
    if (!mongoDoc) {
      console.log(`⏭️  ${strapiEndpoint}: No MongoDB document, skipping.\n`);
      continue;
    }

    const strapiPayload = mapper(mongoDoc);
    if (!strapiPayload) {
      console.log(`⏭️  ${strapiEndpoint}: Mapper returned null, skipping.\n`);
      continue;
    }

    let strapiCurrent;
    try {
      const res = await fetchStrapi(strapiEndpoint, 'GET', null);
      strapiCurrent = res?.data ?? res;
    } catch (e) {
      console.error(`❌ ${strapiEndpoint}: Strapi fetch failed:`, e.message);
      continue;
    }

    const diffs = diffOnlyMongoFields(strapiPayload, strapiCurrent);
    if (diffs.length === 0) {
      console.log(`✅ ${strapiEndpoint}: No differences (MongoDB fields match). Strapi-only fields (seo, etc.) kept as-is.\n`);
      continue;
    }

    console.log(`\n📄 ${strapiEndpoint.toUpperCase()} – ${diffs.length} difference(s) in MongoDB-mapped fields:`);
    diffs.slice(0, 15).forEach((d) => {
      console.log(`   ${d.path}:`);
      console.log(`     MongoDB: ${formatVal(d.mongo)}`);
      console.log(`     Strapi:  ${formatVal(d.strapi)}`);
    });
    if (diffs.length > 15) console.log(`   ... and ${diffs.length - 15} more`);
    console.log(`   (Strapi-only fields like seo, ogImage are not compared; they will be preserved)`);

    const ans = await ask(`\nUpdate Strapi from MongoDB? (Y/N): `);
    if (ans === 'y' || ans === 'yes') {
      try {
        const merged = { ...strapiCurrent, ...strapiPayload };
        await updateStrapi(strapiEndpoint, merged);
        console.log(`✅ Updated ${strapiEndpoint} (MongoDB fields synced; Strapi-only fields preserved)`);
      } catch (e) {
        console.error(`❌ Update failed:`, e.message);
      }
    } else {
      console.log(`⏭️  Skipped ${strapiEndpoint}`);
    }
  }

  // --- Landing Page (multiple MongoDB collections → one Strapi document) ---
  const strapiEndpoint = 'landing-page';
  const mongoLanding = {};
  for (const coll of LANDING_PAGE_COLLECTIONS) {
    mongoLanding[coll] = mongoData[coll];
  }
  const hasAnyLanding = LANDING_PAGE_COLLECTIONS.some((c) => mongoLanding[c]);
  if (hasAnyLanding) {
    const strapiPayload = mongoToStrapiLandingPage(mongoLanding);
    if (strapiPayload) {
      let strapiCurrent;
      try {
        const res = await fetchStrapi(strapiEndpoint, 'GET', null);
        strapiCurrent = res?.data ?? res;
      } catch (e) {
        console.error(`❌ ${strapiEndpoint}: Strapi fetch failed:`, e.message);
      }
      if (strapiCurrent) {
        const diffs = diffOnlyMongoFields(strapiPayload, strapiCurrent);
        if (diffs.length === 0) {
          console.log(`\n✅ ${strapiEndpoint}: No differences (MongoDB fields match).\n`);
        } else {
          console.log(`\n📄 LANDING-PAGE – ${diffs.length} difference(s) in MongoDB-mapped fields:`);
          diffs.slice(0, 15).forEach((d) => {
            console.log(`   ${d.path}:`);
            console.log(`     MongoDB: ${formatVal(d.mongo)}`);
            console.log(`     Strapi:  ${formatVal(d.strapi)}`);
          });
          if (diffs.length > 15) console.log(`   ... and ${diffs.length - 15} more`);
          const ans = await ask(`\nUpdate Strapi landing-page from MongoDB? (Y/N): `);
          if (ans === 'y' || ans === 'yes') {
            try {
              const merged = { ...strapiCurrent, ...strapiPayload };
              await updateStrapi(strapiEndpoint, merged);
              console.log(`✅ Updated ${strapiEndpoint} (MongoDB fields synced; Strapi-only fields preserved)`);
            } catch (e) {
              console.error(`❌ Update failed:`, e.message);
            }
          } else {
            console.log(`⏭️  Skipped ${strapiEndpoint}`);
          }
        }
      }
    }
  } else {
    console.log(`\n⏭️  landing-page: No MongoDB documents in heros/herosections/howitworks/comparisons/ctas/checklists/reviews, skipping.\n`);
  }

  console.log('\n--- Done ---');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
