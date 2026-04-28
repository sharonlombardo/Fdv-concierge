import type { VercelRequest, VercelResponse } from '@vercel/node';
import pg from 'pg';
import Stripe from 'stripe';

const { Pool } = pg;

let pool: any = null;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

// Stripe needs the raw, unmodified request body to verify the signature.
// The default Vercel JSON body parser would mutate it, so disable it here.
export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(typeof c === 'string' ? Buffer.from(c) : c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    console.error('Stripe env vars missing');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const stripe = new Stripe(stripeKey);
  const sig = req.headers['stripe-signature'] as string | undefined;
  if (!sig) return res.status(400).send('Missing stripe-signature header');

  const rawBody = await readRawBody(req);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err?.message);
    return res.status(400).send(`Webhook Error: ${err?.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata || {};
      const userEmail = meta.userEmail || session.customer_email || null;
      const tier = meta.tier || null;
      const destination = meta.destination || null;
      const itemId = meta.itemId || (destination && tier ? `trip-${destination.toLowerCase()}-${tier}-purchased` : null);
      const saveIdStr = meta.saveId || '';
      const saveId = saveIdStr ? parseInt(saveIdStr, 10) : null;

      // Morocco is the only destination with a fully built itinerary today;
      // others go into "curating" until the concierge finishes the brief.
      const tripStatus = destination === 'Morocco' ? 'ready' : 'curating';

      const db = getPool();

      // Idempotent update: only flip to purchased if not already.
      const patch = {
        status: tripStatus,
        purchaseStatus: 'purchased',
        stripeSessionId: session.id,
        stripePaymentIntent: typeof session.payment_intent === 'string' ? session.payment_intent : null,
        amountPaid: session.amount_total != null ? session.amount_total / 100 : null,
        currency: session.currency,
        paidAt: Date.now(),
      };

      if (saveId) {
        await db.query(
          `UPDATE saves
             SET purchase_status = 'purchased',
                 metadata = COALESCE(metadata, '{}'::jsonb) || $1::jsonb
           WHERE id = $2 AND COALESCE(purchase_status, '') <> 'purchased'`,
          [JSON.stringify(patch), saveId]
        );
      } else if (userEmail && itemId) {
        // Fallback: locate by email + itemId
        await db.query(
          `UPDATE saves
             SET purchase_status = 'purchased',
                 metadata = COALESCE(metadata, '{}'::jsonb) || $1::jsonb
           WHERE user_email = $2 AND item_id = $3 AND COALESCE(purchase_status, '') <> 'purchased'`,
          [JSON.stringify(patch), userEmail, itemId]
        );
      } else {
        console.warn('Webhook completed without enough metadata to update save', { userEmail, itemId, saveId });
      }

      // Log the event for the admin dashboard
      try {
        await db.query(
          `INSERT INTO events (event_type, metadata, created_at)
           VALUES ('trip_purchased', $1, NOW())`,
          [JSON.stringify({
            userEmail,
            tier,
            destination,
            amount: patch.amountPaid,
            currency: patch.currency,
            sessionId: session.id,
          })]
        );
      } catch {
        // events table may not exist in all environments — non-fatal
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Webhook handler error:', err?.message);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}
