import type { VercelRequest, VercelResponse } from '@vercel/node';
import pg from 'pg';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
const { Pool } = pg;

// Build product catalog for concierge system prompt
let PRODUCT_CATALOG_PROMPT = '';
try {
  const genomePath = path.join(process.cwd(), 'client/src/data/fdv_brand_genome.json');
  const genome = JSON.parse(fs.readFileSync(genomePath, 'utf8'));
  PRODUCT_CATALOG_PROMPT = genome
    .filter((p: any) => p.shop_status === 'live' || p.shop_status === 'coming_soon')
    .map((p: any) => {
      const status = p.shop_status === 'coming_soon' ? ' [coming soon]' : '';
      const desc = p.description ? p.description.split('.')[0] + '.' : '';
      return `- ${p.brand} ${p.name} (${p.price || 'TBD'})${p.color ? ', ' + p.color : ''}${desc ? ' — ' + desc : ''}${status}`;
    })
    .join('\n');
} catch (e) {
  console.warn('Could not load product genome for concierge:', e);
}

// Email sending via Resend (lazy-loaded to avoid errors if not installed yet)
async function sendWelcomeEmail(email: string, name?: string | null) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set, skipping welcome email');
    return;
  }

  const firstName = name ? name.split(' ')[0] : 'there';
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'FDV Concierge <onboarding@resend.dev>',
        to: [email],
        subject: 'Your Digital Passport is ready',
        html: `
          <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #2c2416;">
            <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #c9a84c; margin-bottom: 24px;">
              FIL DE VIE CONCIERGE
            </p>
            <p style="font-size: 20px; line-height: 1.5; margin-bottom: 16px;">
              Welcome, ${firstName}.
            </p>
            <p style="font-size: 16px; line-height: 1.7; color: #555; margin-bottom: 16px;">
              Your Digital Passport is ready. You now have a place to save what you love — places, looks, moments — and we'll start learning what matters to you.
            </p>
            <p style="font-size: 16px; line-height: 1.7; color: #555; margin-bottom: 24px;">
              Start with Morocco. It's waiting for you.
            </p>
            <a href="https://fdv-concierge.vercel.app/guides/morocco" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 14px 32px; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;">
              Explore Morocco
            </a>
            <p style="font-size: 13px; color: #999; margin-top: 40px; border-top: 1px solid #e8e0d4; padding-top: 20px;">
              Fil de Vie Concierge — Travel with intention.
            </p>
          </div>
        `,
      }),
    });
  } catch (err) {
    console.warn('Failed to send welcome email:', err);
  }
}

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Password hashing with scrypt (Node built-in)
function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

// Simple token for session (signed with secret, stateless for serverless)
const SESSION_SECRET = process.env.SESSION_SECRET || 'fdv-pilot-secret-2026';

function createToken(email: string): string {
  const payload = JSON.stringify({ email, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 }); // 30 days
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + hmac;
}

function verifyToken(token: string): { email: string } | null {
  try {
    const [payloadB64, hmac] = token.split('.');
    const payload = Buffer.from(payloadB64, 'base64').toString();
    const expectedHmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
    if (hmac !== expectedHmac) return null;
    const data = JSON.parse(payload);
    if (data.exp < Date.now()) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

function getTokenFromRequest(req: VercelRequest): string | null {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/fdv_token=([^;]+)/);
  return match ? match[1] : null;
}

function getUserEmailFromRequest(req: VercelRequest): string | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const verified = verifyToken(token);
  return verified?.email || null;
}

// Run migrations on first request
let migrated = false;
async function runMigrations() {
  if (migrated) return;
  migrated = true;
  try {
    await pool.query('ALTER TABLE saves ADD COLUMN IF NOT EXISTS user_email TEXT');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_saves_user_email ON saves(user_email)');
    // Auth migrations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT UNIQUE,
        password TEXT NOT NULL,
        email TEXT UNIQUE,
        name TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        last_active TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT NOW()');
    // Link health table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS link_health (
        id SERIAL PRIMARY KEY,
        source_table TEXT NOT NULL,
        source_id TEXT NOT NULL,
        url_field TEXT NOT NULL,
        url TEXT NOT NULL,
        status_code INTEGER,
        is_healthy BOOLEAN NOT NULL DEFAULT true,
        last_checked_at TIMESTAMP NOT NULL DEFAULT NOW(),
        first_broken_at TIMESTAMP,
        consecutive_failures INTEGER DEFAULT 0,
        item_title TEXT,
        item_brand TEXT,
        replacement_url TEXT,
        replacement_status TEXT,
        replacement_source TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_link_health_unhealthy ON link_health (is_healthy) WHERE is_healthy = false');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_link_health_source ON link_health (source_table, source_id)');
    // Products table — source of truth for commerce data (URLs, prices, availability)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        database_match_key TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        brand TEXT NOT NULL,
        name TEXT NOT NULL,
        color TEXT,
        sizes TEXT[],
        price TEXT,
        price_numeric INTEGER,
        description TEXT,
        url TEXT,
        shop_status TEXT DEFAULT 'live',
        image_key TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_products_status ON products (shop_status)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_products_match_key ON products (database_match_key)');
    // Concierge conversation logging
    await pool.query(`
      CREATE TABLE IF NOT EXISTS concierge_conversations (
        id SERIAL PRIMARY KEY,
        user_email TEXT,
        session_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        page_context TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_convo_user ON concierge_conversations (user_email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_convo_session ON concierge_conversations (session_id)');
  } catch (e) {
    console.warn('Migration warning:', e);
  }
}

// Image mappings from Vercel Blob (migrated from Replit)
const EMBEDDED_IMAGE_MAPPINGS: Record<string, string> = {
  "opening-cover": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/opening-cover",
  "opening-edit-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/opening-edit-1",
  "opening-edit-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/opening-edit-2",
  "opening-edit-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/opening-edit-4",
  "morocco-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-hero",
  "morocco-style-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-style-1",
  "morocco-texture-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-texture-1",
  "morocco-tile-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-1",
  "morocco-tile-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-2",
  "morocco-tile-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-3",
  "morocco-tile-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-4",
  "morocco-tile-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-5",
  "morocco-tile-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-6",
  "morocco-object-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-object-1",
  "morocco-experience-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-experience-1",
  "morocco-motion-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-motion-1",
  "morocco-ritual-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-ritual-1",
  "hydra-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-hero",
  "hydra-style-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-style-1",
  "hydra-texture-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-texture-1",
  "hydra-tile-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-tile-1",
  "hydra-tile-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-tile-2",
  "hydra-tile-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-tile-3",
  "hydra-tile-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-tile-4",
  "hydra-tile-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-tile-5",
  "hydra-tile-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-tile-6",
  "hydra-object-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-object-1",
  "hydra-light-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-light-1",
  "hydra-light-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-light-2",
  "hydra-ritual-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-ritual-1",
  "slow-travel-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-travel-hero",
  "slow-culture-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-culture-1",
  "slow-lunch": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-lunch",
  "slow-museum": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-museum",
  "slow-style-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-style-1",
  "slow-tile-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-tile-1",
  "slow-tile-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-tile-2",
  "slow-tile-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-tile-3",
  "slow-tile-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-tile-4",
  "slow-tile-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-tile-5",
  "slow-tile-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-tile-6",
  "slow-object-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-object-1",
  "slow-ritual-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-ritual-1",
  "retreat-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-hero",
  "retreat-ritual-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-ritual-1",
  "retreat-motion-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-motion-1",
  "retreat-place-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-place-1",
  "retreat-tile-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-tile-1",
  "retreat-tile-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-tile-2",
  "retreat-tile-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-tile-3",
  "retreat-tile-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-tile-4",
  "retreat-tile-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-tile-5",
  "retreat-tile-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-tile-6",
  "retreat-object-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-object-1",
  "retreat-style-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-style-1",
  "newyork-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/newyork-hero",
  "newyork-style-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/newyork-style-1",
  "newyork-culture-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/newyork-culture-1",
  "ny-tile-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-tile-1",
  "ny-tile-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-tile-2",
  "ny-tile-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-tile-3",
  "ny-tile-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-tile-4",
  "ny-tile-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-tile-5",
  "ny-tile-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-tile-6",
  "newyork-experience-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/newyork-experience-1",
  "ny-culture-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-culture-1",
  "ny-culture-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-culture-2",
  "newyork-object-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/newyork-object-1",
  "ny-reset-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-reset-1",
  "ny-reset-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-reset-2",
  "ny-reset-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-reset-3",
  "ny-reset-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-reset-4",
  "newyork-ritual-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/newyork-ritual-1",
  "transition-frame-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/transition-frame-1",
  "transition-frame-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/transition-frame-2",
  "transition-frame-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/transition-frame-3",
  "transition-frame-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/transition-frame-4",
  "transition-frame-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/transition-frame-5",
  "suitcase-capsule-card": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/suitcase-capsule-card",
  "destination-morocco": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/destination-morocco",
  "destination-hydra": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/destination-hydra",
  "destination-slow-travel": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/destination-slow-travel",
  "destination-retreat": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/destination-retreat",
  "destination-new-york": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/destination-new-york",
  "todays-edit-mood-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-mood-1",
  "todays-edit-mood-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-mood-2",
  "todays-edit-mood-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-mood-3",
  "todays-edit-mood-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-mood-4",
  "todays-edit-look-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-look-1",
  "todays-edit-look-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-look-2",
  "todays-edit-look-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-look-3",
  "todays-edit-look-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-look-4",
  "todays-edit-look-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-look-5",
  "todays-edit-look-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-look-6",
  "landing-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/landing-hero",
  "todays-edit-card": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-card",
  "d1-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-hero",
  "d1-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1",
  "d1-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1-wardrobe",
  "d1-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-2",
  "d1-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3",
  "d1-3-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3-wardrobe",
  "d1-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-4",
  "d1-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-5",
  "d1-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6",
  "d1-6-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6-wardrobe",
  "d1-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-7",
  "d2-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-hero",
  "d2-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1",
  "d2-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1-wardrobe",
  "d2-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-2",
  "d2-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-3",
  "d2-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4",
  "d2-4-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4-wardrobe",
  "d2-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-5",
  "d2-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-6",
  "d2-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7",
  "d2-7-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7-wardrobe",
  "d2-8": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-8",
  "d3-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-hero",
  "d3-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1",
  "d3-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1-wardrobe",
  "d3-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-2",
  "d3-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-3",
  "d3-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-4",
  "d3-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5",
  "d3-5-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5-wardrobe",
  "d3-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-6",
  "d3-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-7",
  "d3-8": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-8",
  "d3-9": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9",
  "d3-9-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9-wardrobe",
  "d4-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-hero",
  "d4-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1",
  "d4-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1-wardrobe",
  "d4-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-2",
  "d4-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-3",
  "d4-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4",
  "d4-4-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4-wardrobe",
  "d4-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-5",
  "d4-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-6",
  "d4-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-7",
  "d4-8": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-8",
  "d4-9": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9",
  "d4-9-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9-wardrobe",
  "d4-10": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-10",
  "d5-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-hero",
  "d5-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1",
  "d5-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1-wardrobe",
  "d5-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-2",
  "d5-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-3",
  "d5-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-4",
  "d5-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-5",
  "d5-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-6",
  "d5-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7",
  "d5-7-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7-wardrobe",
  "d6-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-hero",
  "d6-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1",
  "d6-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1-wardrobe",
  "d6-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-2",
  "d6-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-3",
  "d6-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4",
  "d6-4-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4-wardrobe",
  "d6-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-5",
  "d6-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-6",
  "d6-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-7",
  "d6-8": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8",
  "d6-8-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8-wardrobe",
  "d7-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-hero",
  "d7-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1",
  "d7-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1-wardrobe",
  "d7-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-2",
  "d7-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-3",
  "d7-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4",
  "d7-4-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4-wardrobe",
  "d7-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-5",
  "d7-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-6",
  "d7-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-7",
  "d7-7-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-7-wardrobe",
  "d7-8": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-8",
  "d7-9": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-9",
  "d8-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-hero",
  "d8-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1",
  "d8-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-wardrobe",
  "d8-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-2",
  "d8-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-3",
  "d8-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-4",
  "d8-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-5",
  "d8-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-6",
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
  "d8-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-extra-0",
  "d8-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-extra-1",
  "d8-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-extra-2",
  "d8-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-extra-3"
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url, method } = req;
  const path = url?.split('?')[0] || '';

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await runMigrations();

    // ═══ AUTH ENDPOINTS ═══

    // POST /api/auth/signup — Create Digital Passport
    if (path === '/api/auth/signup' && method === 'POST') {
      const { name, email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
      if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

      // Check if email already exists
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
      }

      const hashedPassword = await hashPassword(password);
      const result = await pool.query(
        'INSERT INTO users (username, email, name, password, created_at, last_active) VALUES ($1, $1, $2, $3, NOW(), NOW()) RETURNING id, email, name, created_at',
        [email, name || null, hashedPassword]
      );
      const user = result.rows[0];

      // Note: anonymous saves are not associated on signup since we can't distinguish
      // which anonymous saves belong to which browser session. Saves made after signup
      // are automatically associated via the auth cookie.

      // Send welcome email (non-blocking)
      sendWelcomeEmail(email, name).catch(() => {});

      // Set auth cookie
      const token = createToken(email);
      res.setHeader('Set-Cookie', `fdv_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);

      return res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, createdAt: user.created_at } });
    }

    // POST /api/auth/login
    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

      const result = await pool.query('SELECT id, email, name, password, created_at FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = result.rows[0];
      const valid = await verifyPassword(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Update last active
      await pool.query('UPDATE users SET last_active = NOW() WHERE id = $1', [user.id]);

      // Set auth cookie
      const token = createToken(email);
      res.setHeader('Set-Cookie', `fdv_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);

      return res.status(200).json({ user: { id: user.id, email: user.email, name: user.name, createdAt: user.created_at } });
    }

    // POST /api/auth/logout
    if (path === '/api/auth/logout' && method === 'POST') {
      res.setHeader('Set-Cookie', 'fdv_token=; Path=/; HttpOnly; Max-Age=0');
      return res.status(200).json({ success: true });
    }

    // GET /api/auth/me — Check current session
    if (path === '/api/auth/me' && method === 'GET') {
      const email = getUserEmailFromRequest(req);
      if (!email) return res.status(200).json({ user: null });

      const result = await pool.query('SELECT id, email, name, created_at FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) return res.status(200).json({ user: null });

      const user = result.rows[0];
      // Update last active
      await pool.query('UPDATE users SET last_active = NOW() WHERE id = $1', [user.id]);
      return res.status(200).json({ user: { id: user.id, email: user.email, name: user.name, createdAt: user.created_at } });
    }

    // ═══ ADMIN ENDPOINTS ═══

    // GET /api/admin/users — All users with stats (admin key protected)
    if (path === '/api/admin/users' && method === 'GET') {
      const urlObj = new URL(url || '', `http://${req.headers.host}`);
      const adminKey = urlObj.searchParams.get('admin_key');
      if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      const users = await pool.query(`
        SELECT u.id, u.email, u.name, u.created_at, u.last_active,
          (SELECT COUNT(*) FROM saves WHERE user_email = u.email) as save_count,
          (SELECT COUNT(*) FROM events WHERE metadata->>'userEmail' = u.email) as event_count
        FROM users u
        ORDER BY u.created_at DESC
      `);
      return res.status(200).json(users.rows);
    }

    // GET /api/admin/users/:email/saves
    if (path.startsWith('/api/admin/users/') && path.endsWith('/saves') && method === 'GET') {
      const urlObj = new URL(url || '', `http://${req.headers.host}`);
      const adminKey = urlObj.searchParams.get('admin_key');
      if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      const email = decodeURIComponent(path.split('/api/admin/users/')[1].split('/saves')[0]);
      const saves = await pool.query('SELECT * FROM saves WHERE user_email = $1 ORDER BY saved_at DESC', [email]);
      return res.status(200).json(saves.rows);
    }

    // GET /api/admin/users/:email/events
    if (path.startsWith('/api/admin/users/') && path.endsWith('/events') && method === 'GET') {
      const urlObj = new URL(url || '', `http://${req.headers.host}`);
      const adminKey = urlObj.searchParams.get('admin_key');
      if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      const email = decodeURIComponent(path.split('/api/admin/users/')[1].split('/events')[0]);
      const events = await pool.query(
        "SELECT * FROM events WHERE metadata->>'userEmail' = $1 OR source_page LIKE '%' || $1 || '%' ORDER BY created_at DESC LIMIT 200",
        [email]
      );
      return res.status(200).json(events.rows);
    }

    // GET /api/admin/aggregate — Top saved items, clicks, curate usage
    if (path === '/api/admin/aggregate' && method === 'GET') {
      const urlObj = new URL(url || '', `http://${req.headers.host}`);
      const adminKey = urlObj.searchParams.get('admin_key');
      if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      const topSaved = await pool.query(
        "SELECT item_id, title, item_type, COUNT(*) as save_count FROM saves GROUP BY item_id, title, item_type ORDER BY save_count DESC LIMIT 20"
      );
      const topClicks = await pool.query(
        "SELECT destination_url, COUNT(*) as click_count FROM events WHERE event_type = 'affiliate_click' GROUP BY destination_url ORDER BY click_count DESC LIMIT 20"
      );
      const curateCount = await pool.query(
        "SELECT COUNT(*) as count FROM events WHERE event_type = 'curate_for_me'"
      );
      const pageViews = await pool.query(
        "SELECT source_page, COUNT(*) as view_count FROM events WHERE event_type = 'page_view' GROUP BY source_page ORDER BY view_count DESC LIMIT 30"
      );
      const userCount = await pool.query('SELECT COUNT(*) as count FROM users');

      // Session metrics
      const sessionCount = await pool.query(
        "SELECT COUNT(DISTINCT metadata->>'sessionId') as count FROM events WHERE metadata->>'sessionId' IS NOT NULL"
      );
      const avgPagesPerSession = await pool.query(
        `SELECT AVG(page_count)::numeric(10,1) as avg_pages FROM (
          SELECT metadata->>'sessionId' as sid, COUNT(*) as page_count
          FROM events WHERE event_type = 'page_view' AND metadata->>'sessionId' IS NOT NULL
          GROUP BY metadata->>'sessionId'
        ) t`
      );
      const avgSessionDuration = await pool.query(
        `SELECT AVG((metadata->>'sessionDuration')::int)::int as avg_ms
         FROM events WHERE event_type = 'session_end' AND metadata->>'sessionDuration' IS NOT NULL`
      );
      // Scroll depth stats for editorial pages
      const scrollDepth = await pool.query(
        `SELECT source_page, (metadata->>'depth')::int as depth, COUNT(*) as count
         FROM events WHERE event_type = 'scroll_depth'
         GROUP BY source_page, metadata->>'depth'
         ORDER BY source_page, depth`
      );
      // Chat usage
      const chatCount = await pool.query(
        "SELECT COUNT(*) as count FROM events WHERE event_type = 'concierge_chat'"
      );
      // Funnel data
      const funnelVisited = await pool.query(
        "SELECT COUNT(DISTINCT metadata->>'sessionId') as count FROM events WHERE event_type = 'page_view'"
      );
      const funnelSignedUp = await pool.query('SELECT COUNT(*) as count FROM users');
      const funnelSaved1 = await pool.query(
        "SELECT COUNT(DISTINCT user_email) as count FROM saves WHERE user_email IS NOT NULL"
      );
      const funnelSaved3 = await pool.query(
        `SELECT COUNT(*) as count FROM (
          SELECT user_email FROM saves WHERE user_email IS NOT NULL
          GROUP BY user_email HAVING COUNT(*) >= 3
        ) t`
      );
      const funnelViewedSuitcase = await pool.query(
        "SELECT COUNT(DISTINCT metadata->>'userEmail') as count FROM events WHERE event_type = 'page_view' AND source_page = '/suitcase' AND metadata->>'userEmail' IS NOT NULL"
      );
      const funnelUsedChat = await pool.query(
        "SELECT COUNT(DISTINCT metadata->>'userEmail') as count FROM events WHERE event_type = 'concierge_chat' AND metadata->>'userEmail' IS NOT NULL"
      );
      // Zero-save users alert
      const zeroSaveUsers = await pool.query(
        `SELECT u.email, u.name, u.created_at FROM users u
         WHERE NOT EXISTS (SELECT 1 FROM saves WHERE user_email = u.email)
         ORDER BY u.created_at DESC`
      );

      return res.status(200).json({
        topSaved: topSaved.rows,
        topClicks: topClicks.rows,
        curateUsage: parseInt(curateCount.rows[0].count, 10),
        pageViews: pageViews.rows,
        totalUsers: parseInt(userCount.rows[0].count, 10),
        sessions: {
          total: parseInt(sessionCount.rows[0]?.count || '0', 10),
          avgPages: parseFloat(avgPagesPerSession.rows[0]?.avg_pages || '0'),
          avgDurationMs: parseInt(avgSessionDuration.rows[0]?.avg_ms || '0', 10),
        },
        scrollDepth: scrollDepth.rows,
        chatUsage: parseInt(chatCount.rows[0].count, 10),
        funnel: {
          visited: parseInt(funnelVisited.rows[0]?.count || '0', 10),
          signedUp: parseInt(funnelSignedUp.rows[0]?.count || '0', 10),
          saved1: parseInt(funnelSaved1.rows[0]?.count || '0', 10),
          saved3: parseInt(funnelSaved3.rows[0]?.count || '0', 10),
          viewedSuitcase: parseInt(funnelViewedSuitcase.rows[0]?.count || '0', 10),
          usedChat: parseInt(funnelUsedChat.rows[0]?.count || '0', 10),
        },
        alerts: {
          zeroSaveUsers: zeroSaveUsers.rows,
        },
      });
    }

    // GET /api/admin/users/:email/journey — chronological event timeline
    if (path.startsWith('/api/admin/users/') && path.endsWith('/journey') && method === 'GET') {
      const urlObj = new URL(url || '', `http://${req.headers.host}`);
      const adminKey = urlObj.searchParams.get('admin_key');
      if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      const email = decodeURIComponent(path.split('/api/admin/users/')[1].split('/journey')[0]);
      const events = await pool.query(
        `SELECT event_type, source_page, metadata, created_at FROM events
         WHERE metadata->>'userEmail' = $1 OR metadata->>'sessionId' IN (
           SELECT DISTINCT metadata->>'sessionId' FROM events WHERE metadata->>'userEmail' = $1
         )
         ORDER BY created_at ASC LIMIT 500`,
        [email]
      );
      // Also load concierge conversations for this user
      let conversations: any[] = [];
      try {
        const convoResult = await pool.query(
          `SELECT role, content, page_context, session_id, created_at FROM concierge_conversations
           WHERE user_email = $1 ORDER BY created_at ASC LIMIT 200`,
          [email]
        );
        conversations = convoResult.rows.map((r: any) => ({
          event_type: 'concierge_message',
          source_page: r.page_context,
          metadata: { role: r.role, content: r.content, sessionId: r.session_id },
          created_at: r.created_at,
        }));
      } catch (e) { /* table might not exist yet */ }
      // Merge and sort by timestamp
      const merged = [...events.rows, ...conversations].sort(
        (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      return res.status(200).json(merged);
    }

    // POST /api/saves/associate-email — backfill anonymous saves with user email
    if (path === '/api/saves/associate-email' && method === 'POST') {
      const { email } = req.body || {};
      if (!email) return res.status(400).json({ error: 'email is required' });
      // Associate all saves that have no email with this user
      const result = await pool.query(
        'UPDATE saves SET user_email = $1 WHERE user_email IS NULL',
        [email]
      );
      return res.status(200).json({ success: true, updated: result.rowCount });
    }

    // GET /api/saves/count?email=x — get save count for a user
    if (path === '/api/saves/count' && method === 'GET') {
      const urlObj = new URL(url || '', `http://${req.headers.host}`);
      const email = urlObj.searchParams.get('email');
      let result;
      if (email) {
        result = await pool.query('SELECT COUNT(*) as count FROM saves WHERE user_email = $1', [email]);
      } else {
        result = await pool.query('SELECT COUNT(*) as count FROM saves');
      }
      return res.status(200).json({ count: parseInt(result.rows[0].count, 10) });
    }

    // GET /api/images - Return embedded image mappings
    if (path === '/api/images' || path === '/api') {
      const images = Object.entries(EMBEDDED_IMAGE_MAPPINGS).map(([key, imageUrl]) => ({
        id: 0,
        imageKey: key,
        customUrl: imageUrl,
        originalUrl: null,
        label: null,
        updatedAt: Date.now(),
      }));
      return res.status(200).json(images);
    }

    // GET /api/image-slots
    if (path === '/api/image-slots') {
      // Build slots array from mappings
      const slots = Object.entries(EMBEDDED_IMAGE_MAPPINGS).map(([key, imageUrl]) => ({
        key,
        label: key,
        section: 'Images',
        defaultUrl: imageUrl,
        currentUrl: imageUrl,
        hasCustomImage: true,
      }));
      return res.status(200).json({
        slots,
        grouped: {},
        mappings: EMBEDDED_IMAGE_MAPPINGS
      });
    }

    // GET /api/journal
    if (path === '/api/journal') {
      return res.status(200).json({});
    }

    // GET /api/saves
    if (path === '/api/saves' && method === 'GET') {
      const currentUserEmail = getUserEmailFromRequest(req);
      const result = currentUserEmail
        ? await pool.query('SELECT * FROM saves WHERE user_email = $1 ORDER BY saved_at DESC', [currentUserEmail])
        : await pool.query('SELECT * FROM saves WHERE user_email IS NULL ORDER BY saved_at DESC');
      // Transform snake_case to camelCase for frontend
      const saves = result.rows.map(row => ({
        id: row.id,
        itemType: row.item_type,
        itemId: row.item_id,
        sourceContext: row.source_context,
        aestheticTags: row.aesthetic_tags,
        savedAt: row.saved_at,
        metadata: row.metadata,
        editionTag: row.edition_tag,
        storyTag: row.story_tag,
        editTag: row.edit_tag,
        purchaseStatus: row.purchase_status,
        title: row.title,
        assetUrl: row.asset_url,
        brand: row.brand,
        price: row.price,
        shopUrl: row.shop_url,
        bookUrl: row.book_url,
        detailDescription: row.detail_description,
        category: row.category,
        isCurated: row.is_curated,
      }));
      return res.status(200).json(saves);
    }

    // GET /api/saves/detail/:itemId
    if (path.startsWith('/api/saves/detail/')) {
      const itemId = path.replace('/api/saves/detail/', '');
      const currentUserEmail = getUserEmailFromRequest(req);
      const result = currentUserEmail
        ? await pool.query(
            'SELECT brand, price, shop_url, book_url, detail_description, category, is_curated FROM saves WHERE item_id = $1 AND user_email = $2',
            [itemId, currentUserEmail]
          )
        : await pool.query(
            'SELECT brand, price, shop_url, book_url, detail_description, category, is_curated FROM saves WHERE item_id = $1 AND user_email IS NULL',
            [itemId]
          );
      if (result.rows.length === 0) {
        return res.status(200).json({});
      }
      const row = result.rows[0];
      return res.status(200).json({
        brand: row.brand,
        price: row.price,
        shopUrl: row.shop_url,
        bookUrl: row.book_url,
        detailDescription: row.detail_description,
        category: row.category,
        isCurated: row.is_curated,
      });
    }

    // GET /api/saves/check/:itemId
    if (path.startsWith('/api/saves/check/')) {
      const itemId = decodeURIComponent(path.replace('/api/saves/check/', ''));
      const currentUserEmail = getUserEmailFromRequest(req);
      const result = currentUserEmail
        ? await pool.query('SELECT id FROM saves WHERE item_id = $1 AND user_email = $2 LIMIT 1', [itemId, currentUserEmail])
        : await pool.query('SELECT id FROM saves WHERE item_id = $1 AND user_email IS NULL LIMIT 1', [itemId]);
      return res.status(200).json({ isPinned: result.rows.length > 0 });
    }

    // POST /api/saves — create a new save
    if (path === '/api/saves' && method === 'POST') {
      const body = req.body || {};
      const { itemType, itemId, sourceContext, aestheticTags, savedAt, metadata, editionTag, storyTag, editTag, purchaseStatus, title, assetUrl, brand, price, shopUrl, bookUrl, detailDescription, category, isCurated } = body;

      // Get user email from auth cookie (primary) or request body (fallback)
      const userEmail = getUserEmailFromRequest(req) || body.userEmail || null;

      if (!itemType || !itemId) {
        return res.status(400).json({ error: 'itemType and itemId are required' });
      }

      // Per-user dedup: check if THIS USER already saved this item
      // If authenticated, scope to user; if anonymous, scope to anonymous saves
      const dedupCondition = userEmail ? 'AND user_email = $2' : 'AND user_email IS NULL';
      const dedupParams = userEmail ? [itemId, userEmail] : [itemId];

      const existing = await pool.query(
        `SELECT id FROM saves WHERE item_id = $1 ${dedupCondition} LIMIT 1`,
        dedupParams
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Already pinned' });
      }
      // Check by image URL — same image = same product (per-user)
      if (assetUrl) {
        const imageCondition = userEmail ? 'AND user_email = $2' : 'AND user_email IS NULL';
        const imageParams = userEmail ? [assetUrl, userEmail] : [assetUrl];
        const imageCheck = await pool.query(
          `SELECT id FROM saves WHERE asset_url = $1 ${imageCondition} LIMIT 1`,
          imageParams
        );
        if (imageCheck.rows.length > 0) {
          return res.status(400).json({ error: 'Already pinned' });
        }
      }
      // Also check by normalized title+brand to prevent dupes from different surfaces (per-user)
      if (title) {
        const brandNorm = (brand || '').toLowerCase().trim();
        const titleNorm = (title || '').toLowerCase().trim();
        const sameBrandParams = userEmail
          ? [brandNorm, userEmail]
          : [brandNorm];
        const sameBrandCondition = userEmail
          ? `LOWER(TRIM(COALESCE(brand,''))) = $1 AND user_email = $2`
          : `LOWER(TRIM(COALESCE(brand,''))) = $1 AND user_email IS NULL`;
        const sameBrand = await pool.query(
          `SELECT id, title FROM saves WHERE ${sameBrandCondition}`,
          sameBrandParams
        );
        const normalize = (s: string) => s.toLowerCase().trim()
          .replace(/[éèê]/g, 'e').replace(/[àâä]/g, 'a').replace(/[ïîì]/g, 'i')
          .replace(/[ôöò]/g, 'o').replace(/[üûù]/g, 'u').replace(/[ç]/g, 'c')
          .replace(/[—–\-:,\.]/g, ' ')
          .replace(/[^\w\s]/g, '')
          .replace(/\b(bag|the|a|an|in|of)\b/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        const newCore = normalize(titleNorm);
        const isDupe = sameBrand.rows.some((r: any) => normalize(r.title || '') === newCore);
        if (isDupe) {
          return res.status(400).json({ error: 'Already pinned' });
        }
      }

      const result = await pool.query(
        `INSERT INTO saves (item_type, item_id, source_context, aesthetic_tags, saved_at, metadata, edition_tag, story_tag, edit_tag, purchase_status, title, asset_url, brand, price, shop_url, book_url, detail_description, category, is_curated, user_email)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
         RETURNING *`,
        [
          itemType,
          itemId,
          sourceContext || null,
          aestheticTags || null,
          savedAt || Date.now(),
          metadata ? JSON.stringify(metadata) : null,
          editionTag || null,
          storyTag || null,
          editTag || null,
          purchaseStatus || null,
          title || null,
          assetUrl || null,
          brand || null,
          price || null,
          shopUrl || null,
          bookUrl || null,
          detailDescription || null,
          category || null,
          isCurated || false,
          userEmail,
        ]
      );
      const row = result.rows[0];
      return res.status(200).json({
        id: row.id,
        itemType: row.item_type,
        itemId: row.item_id,
        sourceContext: row.source_context,
        aestheticTags: row.aesthetic_tags,
        savedAt: row.saved_at,
        metadata: row.metadata,
        editionTag: row.edition_tag,
        storyTag: row.story_tag,
        editTag: row.edit_tag,
        purchaseStatus: row.purchase_status,
        title: row.title,
        assetUrl: row.asset_url,
      });
    }

    // DELETE /api/saves/:itemId — remove a save (per-user)
    if (path.startsWith('/api/saves/') && method === 'DELETE') {
      const itemId = decodeURIComponent(path.replace('/api/saves/', ''));
      const currentUserEmail = getUserEmailFromRequest(req);
      if (currentUserEmail) {
        await pool.query('DELETE FROM saves WHERE item_id = $1 AND user_email = $2', [itemId, currentUserEmail]);
      } else {
        await pool.query('DELETE FROM saves WHERE item_id = $1 AND user_email IS NULL', [itemId]);
      }
      return res.status(200).json({ success: true });
    }

    // POST /api/saves/dedup — remove duplicate saves (3-phase: exact, normalized, fuzzy)
    if (path === '/api/saves/dedup' && method === 'POST') {
      // Phase 1: Dedup by exact itemId
      const r1 = await pool.query(
        `DELETE FROM saves WHERE id NOT IN (SELECT MIN(id) FROM saves GROUP BY item_id) RETURNING id`
      );
      // Phase 2: Dedup by normalized title+brand (case-insensitive, trimmed)
      const r2 = await pool.query(
        `DELETE FROM saves WHERE id NOT IN (
          SELECT MIN(id) FROM saves
          GROUP BY LOWER(TRIM(COALESCE(NULLIF(title, ''), item_id))), LOWER(TRIM(COALESCE(brand, '')))
        ) RETURNING id`
      );
      // Phase 3: Fuzzy dedup — catches accent/dash variations + common suffix stripping
      const allSaves = await pool.query('SELECT id, title, brand FROM saves ORDER BY id');
      const rows = allSaves.rows;
      const toDelete: number[] = [];
      const seenCoreKeys = new Map<string, number>();
      const normalizeFuzzy = (s: string) => s.toLowerCase().trim()
        .replace(/[éèê]/g, 'e').replace(/[àâä]/g, 'a').replace(/[ïîì]/g, 'i')
        .replace(/[ôöò]/g, 'o').replace(/[üûù]/g, 'u').replace(/[ç]/g, 'c')
        .replace(/[—–\-:,\.]/g, ' ')
        .replace(/[^\w\s]/g, '')
        .replace(/\b(bag|the|a|an|in|of)\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      for (const row of rows) {
        const brand = normalizeFuzzy(row.brand || '');
        const title = normalizeFuzzy(row.title || '');
        const coreKey = `${title}|${brand}`;
        if (seenCoreKeys.has(coreKey)) {
          toDelete.push(row.id);
        } else {
          seenCoreKeys.set(coreKey, row.id);
        }
      }
      let fuzzyRemoved = 0;
      if (toDelete.length > 0) {
        const r3 = await pool.query('DELETE FROM saves WHERE id = ANY($1) RETURNING id', [toDelete]);
        fuzzyRemoved = r3.rowCount || 0;
      }
      // Phase 4: Image URL dedup — same image = same product regardless of title
      const r4 = await pool.query(`
        DELETE FROM saves
        WHERE id NOT IN (
          SELECT MIN(id) FROM saves
          WHERE asset_url IS NOT NULL AND asset_url != ''
          GROUP BY asset_url
        )
        AND asset_url IS NOT NULL AND asset_url != ''
        RETURNING id
      `);
      const imageRemoved = r4.rowCount || 0;
      return res.status(200).json({ removed: (r1.rowCount || 0) + (r2.rowCount || 0) + fuzzyRemoved + imageRemoved });
    }

    // PATCH /api/saves/:itemId — update a save
    if (path.startsWith('/api/saves/') && method === 'PATCH') {
      const itemId = decodeURIComponent(path.replace('/api/saves/', ''));
      const { metadata, purchaseStatus, category, storyTag } = req.body || {};
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (metadata !== undefined) {
        updates.push(`metadata = $${paramIndex}`);
        values.push(JSON.stringify(metadata));
        paramIndex++;
      }
      if (purchaseStatus !== undefined) {
        updates.push(`purchase_status = $${paramIndex}`);
        values.push(purchaseStatus);
        paramIndex++;
      }
      if (category !== undefined) {
        updates.push(`category = $${paramIndex}`);
        values.push(category);
        paramIndex++;
      }
      if (storyTag !== undefined) {
        updates.push(`story_tag = $${paramIndex}`);
        values.push(storyTag);
        paramIndex++;
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(itemId);
      const result = await pool.query(
        `UPDATE saves SET ${updates.join(', ')} WHERE item_id = $${paramIndex} RETURNING *`,
        values
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Save not found' });
      }
      return res.status(200).json(result.rows[0]);
    }

    // GET /api/library
    if (path === '/api/library') {
      return res.status(200).json([]);
    }

    // GET /api/rules
    if (path === '/api/rules') {
      return res.status(200).json([]);
    }

    // GET /api/selfies
    if (path === '/api/selfies') {
      return res.status(200).json([]);
    }

    // POST /api/waitlist — coming soon notify me
    if (path === '/api/waitlist' && method === 'POST') {
      const { email, itemTitle, itemId, source } = req.body || {};
      if (!email) {
        return res.status(400).json({ error: 'email is required' });
      }
      try {
        await pool.query(
          `INSERT INTO waitlist (email, item_title, item_id, source, created_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (email, item_id) DO NOTHING`,
          [email, itemTitle || null, itemId || null, source || 'coming_soon_notify']
        );
      } catch (dbError: any) {
        // Table may not exist yet — create it
        if (dbError.code === '42P01') {
          await pool.query(`
            CREATE TABLE IF NOT EXISTS waitlist (
              id SERIAL PRIMARY KEY,
              email TEXT NOT NULL,
              item_title TEXT,
              item_id TEXT,
              source TEXT DEFAULT 'coming_soon_notify',
              created_at TIMESTAMP DEFAULT NOW(),
              UNIQUE(email, item_id)
            )
          `);
          await pool.query(
            'INSERT INTO waitlist (email, item_title, item_id, source, created_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (email, item_id) DO NOTHING',
            [email, itemTitle || null, itemId || null, source || 'coming_soon_notify']
          );
        } else {
          console.warn('Waitlist insert failed:', dbError);
        }
      }
      return res.status(200).json({ success: true });
    }

    // GET /api/admin/check-links — manual link health check
    if (path === '/api/admin/check-links' && method === 'GET') {
      const urlObj = new URL(url || '', `http://${req.headers.host}`);
      const adminKey = urlObj.searchParams.get('admin_key');
      if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      // Gather all external URLs from saves and brand genome
      const savesResult = await pool.query(
        `SELECT DISTINCT item_id, shop_url, book_url, title, brand FROM saves
         WHERE (shop_url IS NOT NULL AND shop_url != '') OR (book_url IS NOT NULL AND book_url != '')`
      );

      const linksToCheck: { sourceTable: string; sourceId: string; urlField: string; url: string; title: string; brand: string }[] = [];
      for (const row of savesResult.rows) {
        if (row.shop_url) linksToCheck.push({ sourceTable: 'saves', sourceId: row.item_id, urlField: 'shopUrl', url: row.shop_url, title: row.title || '', brand: row.brand || '' });
        if (row.book_url) linksToCheck.push({ sourceTable: 'saves', sourceId: row.item_id, urlField: 'bookUrl', url: row.book_url, title: row.title || '', brand: row.brand || '' });
      }

      // Deduplicate by URL
      const uniqueUrls = new Map<string, typeof linksToCheck[0]>();
      for (const link of linksToCheck) {
        if (!uniqueUrls.has(link.url)) uniqueUrls.set(link.url, link);
      }

      const results = { total: uniqueUrls.size, healthy: 0, broken: 0, warnings: 0, errors: [] as string[] };
      const DELAY_MS = 500;
      const TIMEOUT_MS = 10000;

      for (const [checkUrl, link] of uniqueUrls) {
        try {
          await new Promise(r => setTimeout(r, DELAY_MS));
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

          const resp = await fetch(checkUrl, {
            method: 'HEAD',
            redirect: 'follow',
            signal: controller.signal,
            headers: { 'User-Agent': 'FDV-LinkChecker/1.0' },
          }).catch(async () => {
            // Fallback to GET if HEAD fails (some servers reject HEAD)
            return fetch(checkUrl, {
              method: 'GET',
              redirect: 'follow',
              signal: controller.signal,
              headers: { 'User-Agent': 'FDV-LinkChecker/1.0' },
            });
          });
          clearTimeout(timeout);

          const statusCode = resp.status;
          const isHealthy = statusCode >= 200 && statusCode < 400;
          const isWarning = statusCode === 403 || statusCode >= 500;

          // Upsert into link_health
          const existing = await pool.query('SELECT id, consecutive_failures FROM link_health WHERE url = $1 LIMIT 1', [checkUrl]);
          if (existing.rows.length > 0) {
            const row = existing.rows[0];
            if (isHealthy) {
              await pool.query(
                'UPDATE link_health SET status_code = $1, is_healthy = true, consecutive_failures = 0, last_checked_at = NOW() WHERE id = $2',
                [statusCode, row.id]
              );
            } else {
              const newFailures = (row.consecutive_failures || 0) + 1;
              await pool.query(
                `UPDATE link_health SET status_code = $1, consecutive_failures = $2, is_healthy = $3,
                 first_broken_at = COALESCE(first_broken_at, NOW()), last_checked_at = NOW() WHERE id = $4`,
                [statusCode, newFailures, newFailures < 2, row.id]
              );
            }
          } else {
            await pool.query(
              `INSERT INTO link_health (source_table, source_id, url_field, url, status_code, is_healthy, item_title, item_brand, consecutive_failures, first_broken_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
              [link.sourceTable, link.sourceId, link.urlField, checkUrl, statusCode, isHealthy, link.title, link.brand, isHealthy ? 0 : 1, isHealthy ? null : new Date()]
            );
          }

          if (isHealthy) results.healthy++;
          else if (isWarning) results.warnings++;
          else results.broken++;
        } catch (err: any) {
          results.broken++;
          // Log DNS/connection failures
          const existing = await pool.query('SELECT id, consecutive_failures FROM link_health WHERE url = $1 LIMIT 1', [checkUrl]);
          if (existing.rows.length > 0) {
            const row = existing.rows[0];
            const newFailures = (row.consecutive_failures || 0) + 1;
            await pool.query(
              `UPDATE link_health SET status_code = 0, consecutive_failures = $1, is_healthy = $2,
               first_broken_at = COALESCE(first_broken_at, NOW()), last_checked_at = NOW(), notes = $3 WHERE id = $4`,
              [newFailures, newFailures < 2, err.message?.slice(0, 200), row.id]
            );
          } else {
            await pool.query(
              `INSERT INTO link_health (source_table, source_id, url_field, url, status_code, is_healthy, item_title, item_brand, consecutive_failures, first_broken_at, notes)
               VALUES ($1, $2, $3, $4, 0, false, $5, $6, 1, NOW(), $7)`,
              [link.sourceTable, link.sourceId, link.urlField, checkUrl, link.title, link.brand, err.message?.slice(0, 200)]
            );
          }
          results.errors.push(`${link.title || checkUrl}: ${err.message?.slice(0, 100)}`);
        }
      }

      return res.status(200).json(results);
    }

    // GET /api/admin/links — link health dashboard data
    if (path === '/api/admin/links' && method === 'GET') {
      const urlObj = new URL(url || '', `http://${req.headers.host}`);
      const adminKey = urlObj.searchParams.get('admin_key');
      if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      const all = await pool.query('SELECT COUNT(*) as count FROM link_health');
      const healthy = await pool.query('SELECT COUNT(*) as count FROM link_health WHERE is_healthy = true');
      const broken = await pool.query('SELECT * FROM link_health WHERE is_healthy = false ORDER BY first_broken_at DESC');
      const warnings = await pool.query("SELECT * FROM link_health WHERE status_code IN (403, 500, 502, 503) AND is_healthy = true ORDER BY last_checked_at DESC");
      const pending = await pool.query("SELECT * FROM link_health WHERE replacement_status = 'pending' ORDER BY first_broken_at DESC");

      return res.status(200).json({
        total: parseInt(all.rows[0].count, 10),
        healthyCount: parseInt(healthy.rows[0].count, 10),
        broken: broken.rows,
        warnings: warnings.rows,
        pendingReplacements: pending.rows,
      });
    }

    // POST /api/admin/links/:id/action — approve, reject, manual replace
    if (path.startsWith('/api/admin/links/') && path.endsWith('/action') && method === 'POST') {
      const urlObj = new URL(url || '', `http://${req.headers.host}`);
      const adminKey = urlObj.searchParams.get('admin_key');
      if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      const linkId = path.split('/api/admin/links/')[1].split('/action')[0];
      const { action, manualUrl } = req.body || {};

      if (action === 'approve') {
        // Apply the suggested replacement URL to the source saves
        const link = await pool.query('SELECT * FROM link_health WHERE id = $1', [linkId]);
        if (link.rows.length > 0 && link.rows[0].replacement_url) {
          const row = link.rows[0];
          // Update saves with the old URL
          if (row.url_field === 'shopUrl') {
            await pool.query('UPDATE saves SET shop_url = $1 WHERE shop_url = $2', [row.replacement_url, row.url]);
          } else if (row.url_field === 'bookUrl') {
            await pool.query('UPDATE saves SET book_url = $1 WHERE book_url = $2', [row.replacement_url, row.url]);
          }
          await pool.query("UPDATE link_health SET replacement_status = 'approved', is_healthy = true WHERE id = $1", [linkId]);
        }
      } else if (action === 'reject') {
        await pool.query("UPDATE link_health SET replacement_status = 'rejected' WHERE id = $1", [linkId]);
      } else if (action === 'manual' && manualUrl) {
        const link = await pool.query('SELECT * FROM link_health WHERE id = $1', [linkId]);
        if (link.rows.length > 0) {
          const row = link.rows[0];
          if (row.url_field === 'shopUrl') {
            await pool.query('UPDATE saves SET shop_url = $1 WHERE shop_url = $2', [manualUrl, row.url]);
          } else if (row.url_field === 'bookUrl') {
            await pool.query('UPDATE saves SET book_url = $1 WHERE book_url = $2', [manualUrl, row.url]);
          }
          await pool.query(
            "UPDATE link_health SET replacement_url = $1, replacement_status = 'approved', replacement_source = 'manual', is_healthy = true WHERE id = $2",
            [manualUrl, linkId]
          );
        }
      } else if (action === 'remove') {
        // Mark as unavailable — hide the shop/book link
        const link = await pool.query('SELECT * FROM link_health WHERE id = $1', [linkId]);
        if (link.rows.length > 0) {
          const row = link.rows[0];
          if (row.url_field === 'shopUrl') {
            await pool.query('UPDATE saves SET shop_url = NULL WHERE shop_url = $1', [row.url]);
          } else if (row.url_field === 'bookUrl') {
            await pool.query('UPDATE saves SET book_url = NULL WHERE book_url = $1', [row.url]);
          }
          await pool.query("UPDATE link_health SET replacement_status = 'removed', notes = 'Product marked unavailable' WHERE id = $1", [linkId]);
        }
      }

      return res.status(200).json({ success: true });
    }

    // POST /api/admin/products/seed — seed products table from brand genome JSON
    if (path === '/api/admin/products/seed' && method === 'POST') {
      const urlObj = new URL(url || '', `http://${req.headers.host}`);
      const adminKey = urlObj.searchParams.get('admin_key');
      if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      // Read genome data from request body (client sends it)
      const { products: genomeProducts } = req.body || {};
      if (!genomeProducts || !Array.isArray(genomeProducts)) {
        return res.status(400).json({ error: 'products array required in body' });
      }

      let inserted = 0, skipped = 0;
      for (const p of genomeProducts) {
        const key = p.database_match_key;
        if (!key) { skipped++; continue; }
        try {
          await pool.query(
            `INSERT INTO products (database_match_key, category, brand, name, color, sizes, price, price_numeric, description, url, shop_status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             ON CONFLICT (database_match_key) DO UPDATE SET
               category = EXCLUDED.category, brand = EXCLUDED.brand, name = EXCLUDED.name,
               color = EXCLUDED.color, sizes = EXCLUDED.sizes, price = EXCLUDED.price,
               price_numeric = EXCLUDED.price_numeric, description = EXCLUDED.description,
               url = COALESCE(products.url, EXCLUDED.url),
               shop_status = CASE WHEN products.url IS NOT NULL AND products.url != EXCLUDED.url THEN products.shop_status ELSE EXCLUDED.shop_status END,
               updated_at = NOW()`,
            [
              key,
              p.category || '',
              p.brand || '',
              p.name || '',
              p.color || null,
              p.sizes || null,
              p.price || null,
              p.price_numeric || null,
              p.description || null,
              p.url || null,
              p.shop_status || 'live',
            ]
          );
          inserted++;
        } catch (e: any) {
          console.warn(`Product seed skip: ${key}:`, e.message);
          skipped++;
        }
      }
      return res.status(200).json({ inserted, skipped, total: genomeProducts.length });
    }

    // GET /api/admin/products — admin product list
    if (path === '/api/admin/products' && method === 'GET') {
      const urlObj = new URL(url || '', `http://${req.headers.host}`);
      const adminKey = urlObj.searchParams.get('admin_key');
      if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      const result = await pool.query('SELECT * FROM products ORDER BY brand, name');
      return res.status(200).json(result.rows);
    }

    // PUT /api/admin/products/:id — update product commerce fields
    if (path.startsWith('/api/admin/products/') && method === 'PUT') {
      const urlObj = new URL(url || '', `http://${req.headers.host}`);
      const adminKey = urlObj.searchParams.get('admin_key');
      if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      const productId = path.replace('/api/admin/products/', '');
      const { url: newUrl, price, shop_status, name, color, description } = req.body || {};

      const updates: string[] = [];
      const values: any[] = [];
      let idx = 1;
      if (newUrl !== undefined) { updates.push(`url = $${idx++}`); values.push(newUrl); }
      if (price !== undefined) { updates.push(`price = $${idx++}`); values.push(price); }
      if (shop_status !== undefined) { updates.push(`shop_status = $${idx++}`); values.push(shop_status); }
      if (name !== undefined) { updates.push(`name = $${idx++}`); values.push(name); }
      if (color !== undefined) { updates.push(`color = $${idx++}`); values.push(color); }
      if (description !== undefined) { updates.push(`description = $${idx++}`); values.push(description); }

      if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

      updates.push(`updated_at = NOW()`);
      values.push(productId);
      await pool.query(
        `UPDATE products SET ${updates.join(', ')} WHERE id = $${idx}`,
        values
      );

      // Also update saves table if URL changed
      if (newUrl !== undefined) {
        const product = await pool.query('SELECT database_match_key FROM products WHERE id = $1', [productId]);
        if (product.rows.length > 0) {
          // Update any saves that reference this product's old URL
          await pool.query(
            `UPDATE saves SET shop_url = $1 WHERE item_id LIKE $2 OR item_id LIKE $3`,
            [newUrl, `%${product.rows[0].database_match_key}%`, `%${product.rows[0].database_match_key.toLowerCase()}%`]
          );
        }
      }

      return res.status(200).json({ success: true });
    }

    // GET /api/products — public product commerce data (for frontend, cached)
    if (path === '/api/products' && method === 'GET') {
      const result = await pool.query(
        'SELECT database_match_key, brand, name, price, url, shop_status, color, description FROM products WHERE shop_status != $1 ORDER BY brand, name',
        ['discontinued']
      );
      // Return as a map keyed by database_match_key for fast lookups
      const productMap: Record<string, any> = {};
      for (const row of result.rows) {
        productMap[row.database_match_key] = {
          brand: row.brand,
          name: row.name,
          price: row.price,
          url: row.url,
          shopStatus: row.shop_status,
          color: row.color,
          description: row.description,
        };
      }
      return res.status(200).json(productMap);
    }

    // GET /api/link-health — client-side check for broken links (cached per-request)
    if (path === '/api/link-health' && method === 'GET') {
      const broken = await pool.query(
        "SELECT url, replacement_url, replacement_status FROM link_health WHERE is_healthy = false"
      );
      const healthMap: Record<string, { broken: boolean; replacement?: string }> = {};
      for (const row of broken.rows) {
        healthMap[row.url] = {
          broken: true,
          replacement: row.replacement_status === 'approved' ? row.replacement_url : undefined,
        };
      }
      return res.status(200).json(healthMap);
    }

    // POST /api/events — event tracking
    if (path === '/api/events' && method === 'POST') {
      const { eventType, itemId, destinationUrl, sourcePage, metadata } = req.body || {};
      if (!eventType) {
        return res.status(400).json({ error: 'eventType is required' });
      }
      try {
        await pool.query(
          'INSERT INTO events (event_type, item_id, destination_url, source_page, metadata, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
          [eventType, itemId || null, destinationUrl || null, sourcePage || null, metadata ? JSON.stringify(metadata) : null]
        );
      } catch (dbError) {
        console.warn('Events table insert failed (table may not exist):', dbError);
      }
      return res.status(200).json({ success: true, eventType, itemId });
    }

    // POST /api/concierge/chat — AI concierge chat with logging, context, knowledge
    if (path === '/api/concierge/chat' && method === 'POST') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Concierge not configured' });
      }

      const { messages, pageContext, sessionId: clientSessionId } = req.body || {};
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages array is required' });
      }

      const userEmail = getUserEmailFromRequest(req);
      const sessionId = clientSessionId || 'unknown';

      // Load user's recent saves for personalization (authenticated users only)
      let userSavesContext = '';
      if (userEmail) {
        try {
          const savesResult = await pool.query(
            `SELECT title, brand, "storyTag", "pinType" FROM saves WHERE user_email = $1 ORDER BY id DESC LIMIT 20`,
            [userEmail]
          );
          if (savesResult.rows.length > 0) {
            const saveLines = savesResult.rows.map((s: any) =>
              `${s.brand ? s.brand + ' ' : ''}${s.title || 'Untitled'}${s.storyTag ? ' (from ' + s.storyTag + ')' : ''}`
            ).join(', ');
            userSavesContext = `\n\nUSER'S RECENT SAVES: ${saveLines}
Use these to personalize your responses. Reference specific items they've saved when relevant. For example, if they saved the Isadora Dress, mention it when discussing evening wear.`;
          }
        } catch (e) {
          // Non-critical — continue without save context
        }
      }

      const pageCtx = pageContext ? `\nCURRENT PAGE: The user is currently on ${pageContext}. Reference this context naturally when relevant.` : '';
      const tier = userEmail ? 'authenticated' : 'anonymous';

      const systemPrompt = `You are the FDV Concierge. You speak like a well-traveled friend with exceptional taste — warm, direct, occasionally surprising. You have opinions. You would never recommend the tourist restaurant. You know why THAT riad and not the other one. You don't hedge. You don't say "it depends." You say "here's what I'd do."

You dress the way you travel — with intention. When someone asks what to wear, you don't list options. You make a call. "The Isadora Dress. The Alaïa mules. Gold earrings, not silver. Trust me."

You're not a search engine. You're not a customer service bot. You're the friend who's already been everywhere and packed perfectly.

IMPORTANT: You are NOT a general-purpose AI assistant. You help with travel, style, the FDV platform, and taste. If someone asks you to write code or solve math problems, gracefully redirect: "That's not really my world — but if you want to talk about where to eat in Marrakech, I'm your person."

TONE:
- Warm but not effusive
- Confident, never pretentious — you have opinions and share them
- Specific — you give real names, real places, real details, real prices
- Atmospheric — you paint pictures with words
- Concise — you respect people's time

MOROCCO KNOWLEDGE:
You know Morocco deeply — Marrakech, the Atlas Mountains, the coast, the desert.
- Restaurants: Le Jardin (quiet courtyard, great lunch), Nomad (rooftop, modern Moroccan, order small plates), La Maison Arabe (cooking classes worth it), Dar Yacout (multi-course feast, lantern-lit, go hungry), Al Fassia (all-female kitchen, Moroccan classics done properly), La Famille (vegetarian, hidden garden), Le Comptoir Darna (late night, live entertainment)
- Hotels: Royal Mansour (ultimate luxury, private riads), La Mamounia (grand dame, stunning gardens), El Fenn (boutique, art-filled, incredible rooftop), Kasbah Bab Ourika (Atlas foothills, stunning views), Kasbah Tamadot (Richard Branson's, mountain escape), Riad Jardin Secret (intimate, quiet medina courtyard)
- Experiences: Jemaa el-Fnaa (go at sunset), the souks (leather first, then textiles), Bahia Palace (morning light is best), Jardin Majorelle (YSL's garden, go early), Badi Palace (ruins with scale and silence), the tanneries (bring mint), Le Jardin Secret (peaceful escape from medina chaos)
- Atlas: Ourika Valley (easy half-day), Imlil (Toubkal base), Kasbah Bab Ourika (lunch with a view)
- Day trips: Essaouira (2.5hrs, windy coast, seafood), Ouzoud Falls, Aït Benhaddou (Game of Thrones kasbah)
- Packing: linen everything, cotton, modest shoulders/knees for mosques, comfortable shoes for cobblestones, light jacket for evenings, Atlas scarf for mountains

FDV PRODUCT CATALOG — reference specific products by name and price when giving style advice:
${PRODUCT_CATALOG_PROMPT || '(Product catalog loading...)'}

When recommending products, be specific: "The FIL DE VIE Isadora Dress ($795) — it's hand crocheted in Bolivia, perfect for a riad evening." Don't just say "a black dress."

For items marked [coming soon], mention them but note availability: "The Gaia Dress would be perfect — it's coming soon to FDV."

${pageCtx}
USER TIER: ${tier}${userSavesContext}

Keep responses focused and helpful. Use paragraph breaks for readability. Don't use bullet points unless listing specific items or making a packing list.`;

      try {
        // Log user's latest message
        const latestUserMsg = messages[messages.length - 1];
        if (latestUserMsg && latestUserMsg.role === 'user') {
          pool.query(
            `INSERT INTO concierge_conversations (user_email, session_id, role, content, page_context) VALUES ($1, $2, $3, $4, $5)`,
            [userEmail, sessionId, 'user', latestUserMsg.content, pageContext || null]
          ).catch(() => {});
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: systemPrompt,
            messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error('Anthropic API error:', errText);
          return res.status(500).json({ error: 'Concierge unavailable' });
        }

        const data = await response.json();
        const reply = data.content?.[0]?.text || 'I wasn\'t able to respond. Please try again.';

        // Log assistant response
        pool.query(
          `INSERT INTO concierge_conversations (user_email, session_id, role, content, page_context) VALUES ($1, $2, $3, $4, $5)`,
          [userEmail, sessionId, 'assistant', reply, pageContext || null]
        ).catch(() => {});

        return res.status(200).json({ reply });
      } catch (err) {
        console.error('Concierge chat error:', err);
        return res.status(500).json({ error: 'Concierge unavailable' });
      }
    }

    // GET /api/admin/conversations — admin view of concierge conversations
    if (path === '/api/admin/conversations' && method === 'GET') {
      const { email: filterEmail, limit: limitParam } = req.query || {};
      const lim = Math.min(parseInt(limitParam as string) || 100, 500);
      let query = 'SELECT * FROM concierge_conversations';
      const params: any[] = [];
      if (filterEmail) {
        query += ' WHERE user_email = $1';
        params.push(filterEmail);
      }
      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
      params.push(lim);
      const result = await pool.query(query, params);
      return res.status(200).json(result.rows);
    }

    // GET /api/weather — real-time weather for concierge
    if (path === '/api/weather' && method === 'GET') {
      const city = req.query?.city as string;
      if (!city) return res.status(400).json({ error: 'city parameter required' });
      const weatherKey = process.env.OPENWEATHER_API_KEY;
      if (!weatherKey) return res.status(500).json({ error: 'Weather not configured' });
      try {
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=imperial&appid=${weatherKey}`
        );
        if (!weatherRes.ok) return res.status(502).json({ error: 'Weather service error' });
        const weatherData = await weatherRes.json();
        return res.status(200).json(weatherData);
      } catch (err) {
        return res.status(500).json({ error: 'Weather fetch failed' });
      }
    }

    // POST handlers (stub for any uncaught POST)
    if (method === 'POST') {
      return res.status(200).json({ success: true });
    }

    return res.status(404).json({ error: 'Not found', path });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
