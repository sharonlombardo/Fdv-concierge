/**
 * Fix asset URLs in saves to use Vercel Blob storage
 * Run with: DATABASE_URL="..." npx tsx scripts/fix-save-urls.ts
 */

import pg from "pg";
const { Pool } = pg;

// Vercel Blob image mappings
const IMAGE_MAPPINGS: Record<string, string> = {
  "d1-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1-wardrobe",
  "d1-3-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3-wardrobe",
  "d1-6-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6-wardrobe",
  "d2-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1-wardrobe",
  "d2-4-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4-wardrobe",
  "d2-7-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7-wardrobe",
  "d3-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1-wardrobe",
  "d3-5-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5-wardrobe",
  "d3-9-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9-wardrobe",
  "d4-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1-wardrobe",
  "d4-4-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4-wardrobe",
  "d4-9-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9-wardrobe",
  "d5-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1-wardrobe",
  "d5-7-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7-wardrobe",
  "d6-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1-wardrobe",
  "d6-4-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4-wardrobe",
  "d6-8-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8-wardrobe",
  "d7-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1-wardrobe",
  "d7-4-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4-wardrobe",
  "d7-7-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-7-wardrobe",
  "d8-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-wardrobe",
  // Extra images
  "d1-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1-extra-0",
  "d1-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1-extra-1",
  "d1-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1-extra-2",
  "d1-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1-extra-3",
  "d1-3-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3-extra-0",
  "d1-3-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3-extra-1",
  "d1-3-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3-extra-2",
  "d1-3-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3-extra-3",
  "d1-6-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6-extra-0",
  "d1-6-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6-extra-1",
  "d1-6-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6-extra-2",
  "d1-6-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6-extra-3",
  "d2-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1-extra-0",
  "d2-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1-extra-1",
  "d2-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1-extra-2",
  "d2-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1-extra-3",
  "d2-4-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4-extra-0",
  "d2-4-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4-extra-1",
  "d2-4-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4-extra-2",
  "d2-4-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4-extra-3",
  "d2-7-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7-extra-0",
  "d2-7-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7-extra-1",
  "d2-7-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7-extra-2",
  "d2-7-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7-extra-3",
  "d3-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1-extra-0",
  "d3-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1-extra-1",
  "d3-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1-extra-2",
  "d3-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1-extra-3",
  "d3-5-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5-extra-0",
  "d3-5-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5-extra-1",
  "d3-5-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5-extra-2",
  "d3-5-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5-extra-3",
  "d3-9-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9-extra-0",
  "d3-9-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9-extra-1",
  "d3-9-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9-extra-2",
  "d3-9-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9-extra-3",
  "d4-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1-extra-0",
  "d4-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1-extra-1",
  "d4-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1-extra-2",
  "d4-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1-extra-3",
  "d4-4-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4-extra-0",
  "d4-4-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4-extra-1",
  "d4-4-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4-extra-2",
  "d4-4-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4-extra-3",
  "d4-9-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9-extra-0",
  "d4-9-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9-extra-1",
  "d4-9-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9-extra-2",
  "d4-9-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9-extra-3",
  "d5-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1-extra-0",
  "d5-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1-extra-1",
  "d5-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1-extra-2",
  "d5-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1-extra-3",
  "d5-7-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7-extra-0",
  "d5-7-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7-extra-1",
  "d5-7-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7-extra-2",
  "d5-7-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7-extra-3",
  "d6-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1-extra-0",
  "d6-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1-extra-1",
  "d6-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1-extra-2",
  "d6-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1-extra-3",
  "d6-4-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4-extra-0",
  "d6-4-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4-extra-1",
  "d6-4-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4-extra-2",
  "d6-4-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4-extra-3",
  "d6-8-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8-extra-0",
  "d6-8-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8-extra-1",
  "d6-8-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8-extra-2",
  "d6-8-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8-extra-3",
  "d7-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1-extra-0",
  "d7-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1-extra-1",
  "d7-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1-extra-2",
  "d7-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1-extra-3",
  "d7-4-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4-extra-0",
  "d7-4-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4-extra-1",
  "d7-4-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4-extra-2",
  "d7-4-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4-extra-3",
  "d7-7-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-7-extra-0",
  "d7-7-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-7-extra-1",
  "d7-7-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-7-extra-2",
  "d7-7-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-7-extra-3",
  "d8-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-extra-0",
  "d8-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-extra-1",
  "d8-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-extra-2",
  "d8-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-extra-3",
};

function getImageUrlForItemId(itemId: string): string | null {
  // For look items like "d1-1-look", use the wardrobe image "d1-1-wardrobe"
  if (itemId.endsWith('-look')) {
    const wardrobeKey = itemId.replace('-look', '-wardrobe');
    return IMAGE_MAPPINGS[wardrobeKey] || null;
  }

  // For extra items like "d1-1-extra-0", use directly
  if (itemId.includes('-extra-')) {
    return IMAGE_MAPPINGS[itemId] || null;
  }

  return null;
}

async function fixSaveUrls() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be set");
  }

  console.log("Connecting to database...");
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Get all saves
    const result = await pool.query('SELECT id, item_id, asset_url FROM saves');
    console.log(`Found ${result.rows.length} saves`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const row of result.rows) {
      const newUrl = getImageUrlForItemId(row.item_id);

      if (newUrl && newUrl !== row.asset_url) {
        await pool.query(
          'UPDATE saves SET asset_url = $1 WHERE id = $2',
          [newUrl, row.id]
        );
        updatedCount++;
        if (updatedCount % 20 === 0) {
          console.log(`  Updated ${updatedCount} saves...`);
        }
      } else {
        skippedCount++;
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`URL fix complete!`);
    console.log(`  ✓ Updated: ${updatedCount}`);
    console.log(`  ⊘ Skipped (no mapping or already correct): ${skippedCount}`);

  } finally {
    await pool.end();
  }
}

fixSaveUrls().catch(console.error);
