/**
 * One-time script to upload Ferragamo Loly Sandal image to correct Blob key.
 * Run with: npx tsx scripts/upload-ferragamo.ts
 */
import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

// Load env vars from .env.local manually
const envPath = path.join(import.meta.dirname || '.', '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    // Strip surrounding quotes from values
    const val = match[2].trim().replace(/^["']|["']$/g, '');
    process.env[match[1].trim()] = val;
  }
}

const IMAGE_PATH = path.join(
  process.env.HOME || '',
  'Desktop/CLAUDE/memory/projects/PRODUCT IMAGES HIGH RES/FOOTWEAR:FERRAGAMO:LOLYSANDAL:BROWN:490 copy.jpg'
);
const BLOB_KEY = 'images-v2/d7-4-extra-0';

async function upload() {
  console.log(`Reading image from: ${IMAGE_PATH}`);
  const buffer = fs.readFileSync(IMAGE_PATH);
  console.log(`Image size: ${buffer.length} bytes`);

  console.log(`Uploading to Blob key: ${BLOB_KEY}`);
  const blob = await put(BLOB_KEY, buffer, {
    access: 'public',
    contentType: 'image/jpeg',
    allowOverwrite: true,
  });

  console.log(`Uploaded successfully!`);
  console.log(`URL: ${blob.url}`);
}

upload().catch(console.error);
