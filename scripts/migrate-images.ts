/**
 * Migration script to download images from Replit and upload to Vercel Blob
 * Run with: npx tsx scripts/migrate-images.ts
 */

import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPLIT_BASE_URL = 'https://elite-canvas--sharonplombardo.replit.app';
const OUTPUT_FILE = path.join(__dirname, '../shared/vercel-blob-mappings.ts');

interface ImageSlot {
  key: string;
  currentUrl: string;
  hasCustomImage: boolean;
}

interface MigrationResult {
  key: string;
  oldPath: string;
  newUrl: string | null;
  error?: string;
}

async function fetchImageSlots(): Promise<Record<string, string>> {
  console.log('Fetching image slots from Replit API...');
  const response = await fetch(`${REPLIT_BASE_URL}/api/image-slots`);
  if (!response.ok) {
    throw new Error(`Failed to fetch image slots: ${response.status}`);
  }
  const data = await response.json();

  const customImages: Record<string, string> = {};
  for (const slot of data.slots || []) {
    if (slot.currentUrl && slot.currentUrl.includes('/objects/')) {
      customImages[slot.key] = slot.currentUrl;
    }
  }

  console.log(`Found ${Object.keys(customImages).length} custom images to migrate\n`);
  return customImages;
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to download ${url}: ${response.status}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
    return null;
  }
}

async function uploadToVercelBlob(key: string, buffer: Buffer, contentType: string): Promise<string | null> {
  try {
    // Use a versioned path to avoid conflicts with existing blobs
    const blob = await put(`images-v2/${key}`, buffer, {
      access: 'public',
      contentType,
    });
    return blob.url;
  } catch (error) {
    console.error(`Error uploading ${key}:`, error);
    return null;
  }
}

function getContentType(buffer: Buffer): string {
  // Check magic bytes for image type
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) return 'image/jpeg';
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png';
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return 'image/gif';
  if (buffer[0] === 0x52 && buffer[1] === 0x49) return 'image/webp';
  return 'image/jpeg'; // default
}

async function migrateImages() {
  // Fetch custom images from Replit API
  const customImages = await fetchImageSlots();

  const results: MigrationResult[] = [];
  const newMappings: Record<string, string> = {};

  const entries = Object.entries(customImages);
  console.log(`Migrating ${entries.length} images from Replit to Vercel Blob...\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < entries.length; i++) {
    const [key, oldPath] = entries[i];
    const url = `${REPLIT_BASE_URL}${oldPath}`;

    process.stdout.write(`[${i + 1}/${entries.length}] Migrating ${key}...`);

    // Download from Replit
    const buffer = await downloadImage(url);
    if (!buffer) {
      console.log(' ❌ Download failed');
      results.push({ key, oldPath, newUrl: null, error: 'Download failed' });
      failCount++;
      continue;
    }

    // Upload to Vercel Blob
    const contentType = getContentType(buffer);
    const newUrl = await uploadToVercelBlob(key, buffer, contentType);

    if (newUrl) {
      console.log(' ✓');
      newMappings[key] = newUrl;
      results.push({ key, oldPath, newUrl });
      successCount++;
    } else {
      console.log(' ❌ Upload failed');
      results.push({ key, oldPath, newUrl: null, error: 'Upload failed' });
      failCount++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Write new mappings file
  const mappingsContent = `// Auto-generated Vercel Blob image mappings
// Generated: ${new Date().toISOString()}
// Migrated from Replit Object Storage

export const VERCEL_BLOB_MAPPINGS: Record<string, string> = ${JSON.stringify(newMappings, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, mappingsContent);

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Migration complete!`);
  console.log(`  ✓ Success: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log(`\nNew mappings saved to: ${OUTPUT_FILE}`);

  // Also save a JSON backup
  const jsonBackup = path.join(__dirname, '../shared/vercel-blob-mappings.json');
  fs.writeFileSync(jsonBackup, JSON.stringify(newMappings, null, 2));
  console.log(`JSON backup saved to: ${jsonBackup}`);

  return { results, newMappings };
}

// Run migration
migrateImages().catch(console.error);
