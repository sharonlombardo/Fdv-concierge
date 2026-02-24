/**
 * Seed script for Morocco Edit data
 * Run with: npx tsx scripts/seed-morocco.ts
 */

import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "../shared/schema";
import { generateMoroccoSeedItems } from "../shared/morocco-seed-data";

async function seedMorocco() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be set");
  }

  console.log("Connecting to database...");
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool, { schema });

  try {
    // Get existing saves
    const existingSaves = await db.select().from(schema.saves);
    const existingItemIds = new Set(existingSaves.map(s => s.itemId));

    console.log(`Found ${existingSaves.length} existing saves`);

    // Generate seed items
    const seedItems = generateMoroccoSeedItems();
    console.log(`Generated ${seedItems.length} Morocco seed items`);

    let seededCount = 0;
    let skippedCount = 0;

    for (const item of seedItems) {
      // Skip if already exists
      if (existingItemIds.has(item.itemId)) {
        skippedCount++;
        continue;
      }

      await db.insert(schema.saves).values({
        itemType: item.itemType,
        itemId: item.itemId,
        sourceContext: 'morocco_itinerary',
        aestheticTags: ['morocco', item.time.toLowerCase()],
        savedAt: Date.now(),
        metadata: {
          seeded: true,
          day: item.day,
          time: item.time,
          flowTitle: item.flowTitle,
          isPlaceholder: item.isPlaceholder || false,
          description: item.description,
          shopLink: item.shopLink,
        },
        editionTag: 'morocco-2026',
        storyTag: 'morocco',
        editTag: 'morocco-edit',
        purchaseStatus: null,
        title: item.title,
        assetUrl: item.assetUrl,
      });
      seededCount++;

      if (seededCount % 20 === 0) {
        console.log(`  Seeded ${seededCount} items...`);
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Seeding complete!`);
    console.log(`  ✓ Seeded: ${seededCount}`);
    console.log(`  ⊘ Skipped (already exist): ${skippedCount}`);
    console.log(`  Total in database: ${existingSaves.length + seededCount}`);

  } finally {
    await pool.end();
  }
}

seedMorocco().catch(console.error);
