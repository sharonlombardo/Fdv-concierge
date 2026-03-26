import type { VercelRequest, VercelResponse } from '@vercel/node';
import pg from 'pg';
import crypto from 'crypto';
const { Pool } = pg;

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

      // Associate any anonymous saves with this email
      await pool.query('UPDATE saves SET user_email = $1 WHERE user_email IS NULL', [email]);

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

      return res.status(200).json({
        topSaved: topSaved.rows,
        topClicks: topClicks.rows,
        curateUsage: parseInt(curateCount.rows[0].count, 10),
        pageViews: pageViews.rows,
        totalUsers: parseInt(userCount.rows[0].count, 10)
      });
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
      const result = await pool.query('SELECT * FROM saves ORDER BY saved_at DESC');
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
      const result = await pool.query(
        'SELECT brand, price, shop_url, book_url, detail_description, category, is_curated FROM saves WHERE item_id = $1',
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
      const result = await pool.query('SELECT id FROM saves WHERE item_id = $1 LIMIT 1', [itemId]);
      return res.status(200).json({ isPinned: result.rows.length > 0 });
    }

    // POST /api/saves — create a new save
    if (path === '/api/saves' && method === 'POST') {
      const body = req.body || {};
      const { itemType, itemId, sourceContext, aestheticTags, savedAt, metadata, editionTag, storyTag, editTag, purchaseStatus, title, assetUrl, brand, price, shopUrl, bookUrl, detailDescription, category, isCurated, userEmail } = body;

      if (!itemType || !itemId) {
        return res.status(400).json({ error: 'itemType and itemId are required' });
      }

      // Check if already exists — by exact itemId, image URL, or normalized title+brand
      const existing = await pool.query('SELECT id FROM saves WHERE item_id = $1 LIMIT 1', [itemId]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Already pinned' });
      }
      // Check by image URL — same image = same product
      if (assetUrl) {
        const imageCheck = await pool.query(
          'SELECT id FROM saves WHERE asset_url = $1 LIMIT 1',
          [assetUrl]
        );
        if (imageCheck.rows.length > 0) {
          return res.status(400).json({ error: 'Already pinned' });
        }
      }
      // Also check by normalized title+brand to prevent dupes from different surfaces
      if (title) {
        const brandNorm = (brand || '').toLowerCase().trim();
        const titleNorm = (title || '').toLowerCase().trim();
        // Fetch all saves with same brand, compare titles in app code
        const sameBrand = await pool.query(
          `SELECT id, title FROM saves WHERE LOWER(TRIM(COALESCE(brand,''))) = $1`,
          [brandNorm]
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
          userEmail || null,
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

    // DELETE /api/saves/:itemId — remove a save
    if (path.startsWith('/api/saves/') && method === 'DELETE') {
      const itemId = decodeURIComponent(path.replace('/api/saves/', ''));
      await pool.query('DELETE FROM saves WHERE item_id = $1', [itemId]);
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

    // POST /api/concierge/chat — AI concierge chat
    if (path === '/api/concierge/chat' && method === 'POST') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Concierge not configured' });
      }

      const { messages } = req.body || {};
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages array is required' });
      }

      const systemPrompt = `You are the FDV Concierge — a warm, knowledgeable travel companion for Fil de Vie Concierge, a luxury travel and style platform. You speak like a trusted friend who happens to have impeccable taste, deep knowledge of Morocco, and a gift for logistics.

Your tone is:
- Warm but not effusive
- Confident but never pretentious
- Specific — you give real names, real places, real details
- Atmospheric — you paint pictures with words
- Concise — you respect people's time

You know Morocco deeply — Marrakech, the Atlas Mountains, the coast, the desert. You know:
- The best restaurants (Le Jardin, Nomad, La Maison Arabe, Dar Yacout, Al Fassia)
- The best riads and hotels (Royal Mansour, La Mamounia, Kasbah Bab Ourika, Kasbah Tamadot)
- Marrakech's Medina: Jemaa el-Fnaa, the souks, Bahia Palace, Jardin Majorelle, the tanneries
- Atlas foothills: Ourika Valley, Imlil, Toubkal region
- Day trips: Essaouira (2.5hrs), Ouzoud Falls, Aït Benhaddou
- Weather: warm days, cool desert nights, layer for the mountains
- What to wear: linen, cotton, modest shoulders/knees for mosques, comfortable shoes for medina cobblestones, a light jacket for evenings

You also know the FDV product catalog — luxury resort wear, desert neutrals, evening looks. When someone asks about packing or what to wear, you can suggest categories (flowing dresses, linen sets, leather sandals, a statement bag) without being overly commercial.

If someone asks about booking, say that the full concierge booking service is coming soon with the Black Passport tier, but you're happy to help them plan.

Keep responses focused and helpful. Use paragraph breaks for readability. Don't use bullet points unless listing specific items.`;

      try {
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
        return res.status(200).json({ reply });
      } catch (err) {
        console.error('Concierge chat error:', err);
        return res.status(500).json({ error: 'Concierge unavailable' });
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
