# FDV CONCIERGE — NORTH STAR V3 ADDITION
## Product Architecture + Demo-Ready Build Plan
**April 20, 2026**

Supplements `FDV_USER_JOURNEY_NORTH_STAR_V2.md` (April 14) — does not replace it.

---

## THE FULL PRODUCT IN ONE SENTENCE

Browse beautiful destination guides for free. Shop the wardrobe. Talk to a concierge who remembers you. Get curated edits built around your taste — as many as you want. When you're ready to go somewhere, buy the trip and we'll build the whole thing for you.

---

## THE FOUR PRODUCTS

### Product 1 — THE GUIDE (free)

**What it is:** Editorial destination guides with shoppable wardrobe. Morocco is live. Hydra, Mallorca, Amangiri, NYC in progress.

**Revenue:** Affiliate commerce on every product purchase.

**Role in funnel:** The storefront. Gets her in the door. Makes her dream. Makes her shop. Makes her save.

**What she sees:** 3 recommendations per category (WHERE TO STAY, WHERE TO EAT, WHAT TO DRINK, WHAT NOT TO MISS, SHOP LOCAL). Tight, opinionated, curated. Leaves her wanting more.

**Status:** Morocco live. Hydra next.

---

### Product 2 — CURATED EDITS (free, unlimited, the taste hook)

**What it is:** The concierge builds shoppable capsule wardrobes and styled edits based on her saves, her conversations, and her signals. "Here's a Hydra evening capsule for you." "Based on what you've been saving, here's what I'd pack for a long weekend in Morocco."

**Revenue:** Affiliate commerce. She buys the products in the edit, we earn commission. The edit itself is free.

**Role in funnel:** The flywheel. Keeps her coming back, talking, saving. Every edit conversation feeds the taste model. Every edit makes the next one better. This is how we sell product without selling.

**How it works:** The concierge offers an edit conversationally → she says yes → a capsule overlay appears in/over the chat showing 6–8 products with images, names, prices, heart icons, tap-to-buy. She can save the whole edit to her suitcase or buy individual pieces. Same visual treatment as the existing Desert Neutrals / Riad Evenings capsule views.

**For pilot/demo:** 10 pre-built edits that the concierge rotates based on basic signals (destination interest, day vs. evening vs. travel, what she's saved). The system picks which one to offer. Feels personalized even with a small library.

**Technical:** Concierge gets a new tool: `show_edit` — similar to the existing `save_to_suitcase` tool. Concierge calls the tool, UI renders the capsule overlay. The capsule component already exists from the Curate for Me build.

**Status:** Not built yet. Concierge can describe edits in text but can't display them visually.

---

### Product 3 — THE CURATED TRIP (paid, $250–750)

**What it is:** A fully personalized trip built for her. Daily itinerary, wardrobe edit per day, packing list, restaurant recommendations, hotel selection, practical details. Based on her saves, her conversations, her dates, her travel party, her priorities.

**Revenue:** Flat fee purchase. Two tiers:

- **THE PLAN ($250):** Personalized itinerary + wardrobe edit + packing list. Digital deliverable in her suitcase.
- **THE FULL SERVICE ($750):** Everything in The Plan + all bookings handled. Hotels, restaurants, transfers. Booking confirmations delivered to her suitcase.

**Role in funnel:** The conversion. The business model. One person paying $500 for a curated trip is a stronger signal than 50 people on a subscription.

**How the purchase works:**
1. She sees the trip purchase option at the bottom of the guide (replaces the current trip brief form)
2. Product card with description of what she gets + price
3. Stripe checkout → payment
4. Confirmation → concierge opens and collects her trip details conversationally (when, how long, who with, what matters most)
5. Curated trip deliverable appears in her suitcase under "My Trips" (30 min to 24 hours later for demo)

**The deliverable:** A beautiful digital document inside the app. Day-by-day itinerary. Each day: morning/afternoon/evening flow, restaurant with a note about what to order, outfit with shoppable links, practical detail. Editorial images, FDV voice throughout. Think: what a luxury travel advisor would FedEx in a leather folder, but digital and saved in her app.

**For pilot/demo:** Pre-built trip deliverables for Morocco and Hydra. Hand-crafted by Sharon to be gorgeous. When someone purchases, they receive the pre-built version. AI personalization layer comes later — the experience must be perfect NOW for the demo.

**Booking confirmations (full service):** Pre-built confirmation cards that look real. "Hotel: El Fenn — 5 nights, Superior Suite, confirmed." "Dinner: Le Jardin — Friday 8:30pm, table for 2, confirmed." These are templated for the demo.

**Pricing rationale:** Industry range for luxury travel planning is $500–$1,200 per trip. FDV is lower for now because we're proving demand. $250 is an impulse purchase for the target demo. $750 matches mid-range luxury advisor fees and is justified because it includes wardrobe curation that no travel advisor offers.

**Status:** Trip brief form exists but no payment, no checkout, no deliverable format. Needs full UX build.

---

### Product 4 — THE DEEP GUIDE (digital purchase, $25–50)

**What it is:** The full destination knowledge as a purchasable digital product. Everything the concierge knows — every restaurant, hotel, bar, swimming spot, shop, practical tip. More than what's in the free guide (which only shows 3 per category). Think of it as the editor's personal notes.

**Revenue:** Direct digital product sale.

**Role in funnel:** Impulse purchase. Middle tier between free browsing and the $250+ curated trip. Proves willingness to pay before Stripe is even built for trips.

**How it works:** Available in the SHOP alongside wardrobe products. "THE HYDRA GUIDE — $35." She buys it like she buys a dress. It lives in her suitcase under "My Guides." Like an ebook in Apple Books — purchased and saved in the app.

**For pilot/demo:** Hand-crafted gorgeous digital guide. All the content exists in the concierge voice docs — it's just packaging and pricing it.

**Status:** Not built. Content exists, needs product format and Stripe integration.

---

### Product 5 (future) — AGENT BOOKING

**What it is:** The concierge actually makes reservations, books hotels, handles logistics in real time.

**Status:** Future. For now, "bookings" are simulated in the full service tier.

---

## THE DATA FLYWHEEL

Every interaction feeds the taste model. Every product makes the next interaction smarter.

- **She browses** → we learn what catches her eye (page views, scroll depth)
- **She saves** → we learn what she'd buy (hearts = explicit signals)
- **She chats** → we learn what she's thinking (natural language = richest signal)
- **She gets an edit** → we learn what she accepts vs. rejects
- **She buys a trip** → we learn her dates, travel party, priorities, budget
- **She shops from the packing list** → we learn price range, size, actual purchase behavior

By her second visit, the site should feel different. By her third trip, the concierge barely needs to ask.

**This is the investor story:** The free products (guide, edits) generate the data that makes the paid products (trips, bookings) better. The paid products generate the data that makes the free products more personalized. More conversations → better taste model → better curation → more trust → more purchases → more data. Flywheel.

---

## THE DEMO EXPERIENCE (for investors like Whitney at Signal Fire)

Whitney lands on the site. This is what she can do end to end:

1. **Land** → magazine scroll, feels the brand, sees "Travel. A State of Mind."
2. **Browse** → taps into Morocco guide, scrolls through places, restaurants, wardrobe
3. **Shop** → taps an editorial image, sees 5 products, buys the Marrakech Pants
4. **Save** → hearts a hotel, a restaurant, a dress. They go to her suitcase.
5. **Chat** → opens the concierge, asks about Hydra vs. Morocco. Concierge remembers her saves, makes a recommendation.
6. **Get an edit** → concierge says "I put together an evening edit for you based on what you've saved." Capsule overlay appears with 6 products she can buy.
7. **Buy the deep guide** → in the shop: "THE MOROCCO GUIDE — $35." Purchases, it appears in her suitcase under "My Guides."
8. **Buy the curated trip** → at the bottom of the guide: "YOUR TRIP, CURATED — $250." Stripe checkout. Confirmation. Concierge collects her details.
9. **Receive the trip** → 30 minutes later, a beautiful day-by-day itinerary appears in her suitcase under "My Trips." Wardrobe edit per day. Packing list. Restaurant picks.
10. **Buy full service** → upgrades to $750. Booking confirmations appear: El Fenn confirmed, Le Jardin reserved, transfer arranged.
11. **Come back next week** → the site remembers her. The concierge references their last conversation. A new edit is waiting in her suitcase.

Every step works. Every transaction is real. Every deliverable is beautiful.

---

## BUILD PRIORITY

### Now:
1. **Hydra guide** (content + build) — proves the model scales beyond Morocco
2. **Landing page scroll** — shipping now (April 18 brief in progress)

### Next (demo-critical):
3. **Trip purchase flow** — Stripe checkout replaces trip brief form. Product card with tiers + pricing. Payment → confirmation → concierge-as-intake.
4. **Trip deliverable** — the beautiful digital document that lands in "My Trips." Pre-built for Morocco and Hydra. Sharon designs in Canva, Claude Code builds the in-app format.
5. **Concierge visual edits** — `show_edit` tool. Concierge triggers capsule overlay in chat. 10 pre-built edits to start.
6. **Deep guide as purchasable product** — Stripe integration in shop. Digital guide saved to suitcase.
7. **Booking confirmations** (full service tier) — templated confirmation cards in suitcase.

### Then (intelligence layer):
8. **Taste Intelligence Phase B** — user_taste_profile extraction after each chat
9. **Returning user personalization** — edits auto-appear in suitcase based on signals
10. **Taste Intelligence Phase C** — Wellspring self-model connection

### Ongoing:
11. **Destination guides** — Mallorca, Amangiri, NYC (same pattern as Morocco/Hydra)
12. **Financial model + VC deck** revision with real transaction data
13. **Outreach** — Lisa Ruffle, Gillian/April, Whitney/Signal Fire, Chad Nelson/OpenAI

---

## WHAT THIS CHANGES FROM NORTH STAR V2

- **Curated edits are now a distinct free product** — not just a concierge capability but a visible, repeating engagement mechanic
- **Trip purchase has defined tiers and pricing** — $250 plan, $750 full service
- **Deep guide is a new product tier** — $25–50 digital purchase
- **The demo must be end-to-end functional** — not a prototype, a working product with real transactions
- **The edit display mechanic is defined** — concierge `show_edit` tool triggers capsule overlay in chat
- **Guide format standardized** — 3 per category in the free guide, full knowledge in concierge + deep guide

Everything else in North Star V2 still holds. This document adds the product architecture and demo build plan on top of it.

---

*V3 Addition — April 20, 2026*
