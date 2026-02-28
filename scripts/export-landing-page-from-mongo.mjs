/**
 * Export Landing Page sections from MongoDB to JSON file
 * 
 * Run: node scripts/export-landing-page-from-mongo.mjs
 * 
 * Output: landing-page-samples.json (valid JSON, ready for USE_SAMPLE_FILE)
 * Requires: MONGODB_URI in .env
 */

import { MongoClient } from 'mongodb';
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

const COLLECTIONS = ['heros', 'herosections', 'howitworks', 'comparisons', 'ctas', 'checklists', 'reviews'];

function stripMongoIds(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(stripMongoIds);
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === '_id' || k === '__v') continue;
    out[k] = stripMongoIds(v);
  }
  return out;
}

async function main() {
  console.log('Exporting Landing Page sections from MongoDB...\n');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();
  const out = {};
  for (const coll of COLLECTIONS) {
    const doc = await db.collection(coll).findOne({});
    if (doc) {
      out[coll] = stripMongoIds(doc);
      console.log('✅', coll);
    } else {
      console.log('⚠️ ', coll, '(empty or not found)');
    }
  }
  await client.close();

  const outPath = path.join(projectRoot, 'landing-page-samples.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf-8');
  console.log('\n✅ Saved to', outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
