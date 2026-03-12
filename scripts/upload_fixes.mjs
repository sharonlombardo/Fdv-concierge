/**
 * Fix Day 5 morning products + Bulgari Serpenti watch (all 4 occurrences)
 *
 * Run from ~/Projects/fdv-concierge:
 *   node ~/Desktop/CLAUDE/upload_fixes.mjs
 *
 * No deploy needed — blob uploads are instant.
 */

import { put } from '@vercel/blob';
import { readFileSync } from 'fs';

// Load .env.local manually (no dotenv dependency needed)
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) {
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    process.env[m[1].trim()] = val;
  }
}

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!BLOB_TOKEN) {
  console.error('Missing BLOB_READ_WRITE_TOKEN');
  process.exit(1);
}

// Base path — processed 1200x1600 Gemini renders
const BASE = '/Users/sharonlombardo/Desktop/CLAUDE/memory/projects/fdv_concierge/PROCESSED_1200x1600';

const uploads = [
  // --- Day 5 morning fixes ---
  // jewelry slot: was showing sunglasses, should be PP Mini Hoops
  {
    src: `${BASE}/05_JEWELRY/JEWELRY_PHOEBEPHILO_MINI_HOOPS_GOLD.jpg`,
    key: 'images-v2/d5-1-extra-2',
    label: 'Day 5 jewelry → PP Mini Hoops',
  },
  // accessory slot: was showing Loewe sunglasses, should be Le Prunier Sunscreen
  {
    src: `${BASE}/03_BEAUTY/BEAUTY_LEPRUNIER_PLUMSUNSCREEN.jpg`,
    key: 'images-v2/d5-1-extra-3',
    label: 'Day 5 accessory → Le Prunier Sunscreen',
  },

  // --- Bulgari Serpenti Watch — all 4 occurrences ---
  {
    src: `${BASE}/02_ACCESSORIES/ACCES_SERPENTI_WATCH_BLK.jpg`,
    key: 'images-v2/d1-1-extra-2',
    label: 'Day 1 jewelry → Bulgari Serpenti',
  },
  {
    src: `${BASE}/02_ACCESSORIES/ACCES_SERPENTI_WATCH_BLK.jpg`,
    key: 'images-v2/d4-9-extra-2',
    label: 'Day 4 jewelry → Bulgari Serpenti',
  },
  {
    src: `${BASE}/02_ACCESSORIES/ACCES_SERPENTI_WATCH_BLK.jpg`,
    key: 'images-v2/d5-7-extra-3',
    label: 'Day 5 evening accessory → Bulgari Serpenti',
  },
  {
    src: `${BASE}/02_ACCESSORIES/ACCES_SERPENTI_WATCH_BLK.jpg`,
    key: 'images-v2/d8-1-extra-2',
    label: 'Day 8 jewelry → Bulgari Serpenti',
  },
];

console.log(`\nUploading ${uploads.length} blob fixes...\n`);

let success = 0;
let failed = 0;

for (const { src, key, label } of uploads) {
  try {
    const fileBuffer = readFileSync(src);
    const blob = await put(key, fileBuffer, {
      access: 'public',
      token: BLOB_TOKEN,
      contentType: 'image/jpeg',
      allowOverwrite: true,
    });
    console.log(`✅ ${label}`);
    console.log(`   ${blob.url}\n`);
    success++;
  } catch (err) {
    console.error(`❌ ${label}`);
    console.error(`   ${err.message}\n`);
    failed++;
  }
}

console.log(`\nDone: ${success} uploaded, ${failed} failed.`);
