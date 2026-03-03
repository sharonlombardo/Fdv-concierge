import { put } from '@vercel/blob';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Load BLOB_READ_WRITE_TOKEN from .env.local manually
const envContent = readFileSync('.env.local', 'utf8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

const IMAGE_DIR = '/Users/sharonlombardo/Desktop/CLAUDE/morocco_guide_imagery';
const PREFIX = 'images-v2/guide-morocco';

async function uploadAll() {
  const files = readdirSync(IMAGE_DIR).filter(f =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  );

  console.log(`Found ${files.length} images to upload`);

  let success = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = join(IMAGE_DIR, file);
    const blobPath = `${PREFIX}/${file}`;

    try {
      const fileBuffer = readFileSync(filePath);
      const blob = await put(blobPath, fileBuffer, {
        access: 'public',
        addRandomSuffix: false,
      });
      console.log(`✓ ${file} → ${blob.url}`);
      success++;
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} uploaded, ${failed} failed`);
}

uploadAll();
