/**
 * MongoDB Compass - Mongosh Script
 * Export Landing Page sections (1 doc each) for compare-sync script
 *
 * HOW TO RUN (MongoDB Compass):
 * 1. Open MongoDB Compass
 * 2. Connect to: mongodb+srv://admin:admin@cluster0.oplpgp2.mongodb.net
 * 3. Select database: clensy-cms
 * 4. Click "Mongosh" tab at bottom (or ">_ MongoDB Shell")
 * 5. Copy-paste this entire script
 * 6. Press Enter
 * 7. Copy the JSON output and save as landing-page-samples.json
 *
 * HOW TO RUN (PowerShell, using mongosh CLI):
 *   cd c:\Users\Lenovo\Desktop\Desktop\clensy2.0
 *   mongosh "mongodb+srv://admin:admin@cluster0.oplpgp2.mongodb.net/clensy-cms" --file scripts/mongosh-export-landing-page.js
 *
 * Alternative - use Node script (writes valid JSON directly):
 *   npm run export:landing-page
 */

const collections = [
  'heros',
  'herosections',
  'howitworks',
  'comparisons',
  'ctas',
  'checklists',
  'reviews'
];

const allSamples = {};

collections.forEach(collName => {
  try {
    const doc = db.getCollection(collName).findOne({});
    if (doc) {
      allSamples[collName] = doc;
      print('✅ ' + collName);
    } else {
      print('⚠️  ' + collName + ' (empty or not found)');
    }
  } catch (e) {
    print('❌ ' + collName + ': ' + e.message);
  }
});

print('\n--- Copy output below (save as landing-page-samples.json) ---\n');
printjson(allSamples);
