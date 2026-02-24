/**
 * Remove saves that don't have corresponding images
 * Run with: DATABASE_URL="..." npx tsx scripts/remove-incomplete-saves.ts
 */

import pg from "pg";
const { Pool } = pg;

async function removeIncompleteSaves() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Delete saves with missing images (d5-3 and d8-4 don't have wardrobe/extra images)
    const result = await pool.query(
      "DELETE FROM saves WHERE item_id LIKE 'd5-3-%' OR item_id LIKE 'd8-4-%' RETURNING item_id"
    );
    console.log(`Deleted ${result.rowCount} incomplete saves:`);
    result.rows.forEach(r => console.log(`  - ${r.item_id}`));

    // Check remaining count
    const countResult = await pool.query("SELECT COUNT(*) as count FROM saves");
    console.log(`\nRemaining saves: ${countResult.rows[0].count}`);
  } finally {
    await pool.end();
  }
}

removeIncompleteSaves().catch(console.error);
