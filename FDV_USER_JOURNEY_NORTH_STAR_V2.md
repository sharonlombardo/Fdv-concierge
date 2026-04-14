# FDV CONCIERGE — USER JOURNEY NORTH STAR V2

## April 14, 2026
## The single source of truth for site architecture, navigation, user flow, and business model.
## This document supersedes all previous user journey briefs.

---

## THE PRODUCT IN ONE SENTENCE

You're going somewhere. Come to us. We'll show you where to stay, where to eat, what to wear, what to pack. Everything is shoppable. Want us to plan the whole thing? We'll build your trip — curated to your taste. Want us to book it? Done.

---

## THE BUSINESS MODEL

FDV is NOT a subscription styling service. The curation exists in service of travel and shopping — it's not the thing in and of itself.

### Revenue streams:

**1. Affiliate commerce (always on)**
Every product in the guides is shoppable. Affiliate revenue runs on every purchase regardless of whether she pays for anything else. This is the baseline.

**2. Curated trip packages (transactional, pay per trip)**
She wants to go to Morocco. She tells the concierge when, how long, who with. The concierge uses her saves + conversation + Wellspring to build HER trip — daily itinerary, wardrobe, restaurant list, packing list. She pays a flat fee.

Pricing TBD but directionally:
- Trip plan (itinerary + wardrobe curation): ~$250-500
- Full service (plan + all bookings handled): ~$500-1000+
- Individual pieces à la carte (just the packing list, just the restaurant bookings): TBD

This is how travel advisors work. The difference: FDV has taste intelligence from her saves and conversations. The curation gets better over time.

**3. Membership (future, not now)**
NOT about unlocking content. About unlocking a relationship:
- The concierge knows her deeply
- Early access to new destinations
- Private community
- Priority booking
- Taste profile carries across trips — by trip three, the concierge barely asks
- Likely yearly, not monthly. Like a club, not a subscription.

**For the pilot and fundraise: prove the transaction first.** One woman paying $500 for a curated trip is a stronger signal than 50 women on a $29 subscription. Membership comes after the transaction is proven.

### What this means for gates:
There are no more "unlock the itinerary" gates. Instead:
- The guide is free. Browse, dream, shop, save.
- The itinerary sample is a TEASER showing the depth of what a personalized trip looks like.
- The gate is: "Want yours?" → brief form → concierge builds custom trip → payment.

---

## THE THREE-STEP FRAMEWORK

Everything maps to three verbs. The user doesn't see numbers. She flows naturally.

**DISCOVER** — Pick a destination. Browse the guide. See the places, the wardrobe, the details. Dream. Save what moves you.

**CURATE** — We build YOUR trip. Not a template. Yours. Based on what you saved, what you told the concierge, what we know about your taste. Daily flow, wardrobe, restaurants, everything.

**YOURS** — We make it happen. Book the hotels, the restaurants, the transfers. Buy the wardrobe. Pack the bag. You just show up.

---

## NAVIGATION ARCHITECTURE

### TOP NAV

```
    ☰                                                    
  (hamburger)    FIL DE VIE CONCIERGE (logo, centered, large)
                                                         
  ABOUT    DESTINATIONS    SHOP     (left-aligned below logo)
```

- Logo: FIL DE VIE CONCIERGE — centered, prominent. People know what site they're on.
- ABOUT → about page (safety net — people can always click here if confused)
- DESTINATIONS → guides/destination carousel
- SHOP → the collection, all products
- Nothing on the right. Left-to-right reading. Clean.

**Note for the future:** When the landing page is strong enough that people don't need ABOUT to understand the product, ABOUT moves to hamburger only and DESTINATIONS takes the leftmost position.

### BOTTOM NAV

```
  🏠       ☰        ✦ (gold, pulses)      🧳        👤
 HOME     MENU      CONCIERGE          SUITCASE   PASSPORT
```

- **HOME** — returns to landing page
- **MENU** — opens hamburger
- **✦ CONCIERGE** — pulsing gold circle, center position. The AI concierge. Always accessible. Tapping opens chat overlay.
- **SUITCASE** — her saves, her shopping bag, her taste portrait
- **PASSPORT** — account, membership, settings

### THE PULSING CONCIERGE CIRCLE

Center of the bottom nav. Pulses gently in FDV gold (#c9a84c) to invite tapping.

When tapped, opens a chat overlay (not a new page). The greeting adapts to context:
- Landing page: *"New here? Tell me where you want to go."*
- In a guide: *"Want to know more about this place?"*
- In the wardrobe: *"Looking for something specific?"*
- After saves: *"I'm starting to see your taste. Want me to build your trip?"*

Input options: TEXT (type) and VOICE (speak).
Below input: "YOU MIGHT LIKE" — 2-3 products based on her saves (or popular picks if new).

### HAMBURGER MENU (numbered, matches nav order)

```
|01|  ABOUT                    Who we are + how it works
|02|  DESTINATIONS             The guides
|03|  SHOP                     The collection
|04|  YOUR CONCIERGE           Plan, ask, curate
|05|  YOUR SUITCASE            Saves, edits, trips
|06|  YOUR PASSPORT            Membership + details
```

The hamburger IS the site map. Six items. Numbered. Clean.

### INSIDE |05| YOUR SUITCASE
- My saves (hearts)
- My edits (curated capsules)
- My trips (booked / in progress)

### INSIDE |06| YOUR PASSPORT
- Membership (current tier + upgrade)
- My details (profile, preferences)
- Notifications
- Links to suitcase + edits

---

## LANDING PAGE FLOW

### What the user sees (mobile-first, top to bottom):

**1. Hero video** — full screen, atmospheric, the FDV world. Already built. Loop.

**2. Atmospheric text** — big type, generous spacing. Zara Home scale. Travel-themed.

*"Pick your destination. We've thought of everything — the places, the wardrobe, the details."*

Or:

*"Where to go. What to bring. All of it, curated."*

**3. Destination cards** — the carousel. Full-height images, destination name, VIEW GUIDE button. Morocco (active), others COMING SOON. Side-swipe with arrows + bleed/peek.

**4. End.** That's the whole landing page. Maybe one quiet footer line: *"Or ask your concierge"* pointing to the pulsing circle.

### What gets REMOVED:
- The text block about FDV Concierge
- The "Curate for Me → / The details →" links
- The category tabs (GUIDES · STYLE · CULTURE · OBJECTS · RITUALS)
- THE CURRENT section
- The SHOP THE STORY carousel
- Everything after the destination cards

### Returning users:
Auth cookie detected → skip landing. Drop into last context (suitcase, guide, or edit).

---

## THE GUIDE EXPERIENCE

When she taps VIEW GUIDE on a destination:

### Section nav (horizontal scroll):
THE EXPERIENCE · EAT & DRINK · SHOP LOCAL · THE STAY · THE WARDROBE

### Content flow:
1. Hero image + editorial intro (Sharon's voice)
2. THE EXPERIENCE — places with editorial breaks
3. EAT & DRINK — restaurants with editorial breaks
4. SHOP LOCAL — shops with editorial breaks
5. THE STAY — hotels with editorial breaks
6. THE WARDROBE — Day / Evening / What Travels Well (product carousels)
7. GUIDE MAP
8. TRIP TEASER + GATE (see below)

### Inside the guide:
- Every image has a ♡ heart icon top-right for saving
- Shoppable images have the + indicator → tap opens product overlay
- BOOK ↗ links on every place block
- Editorial break images between places (magazine rhythm)
- Place images scroll horizontally on mobile

---

## HEART ICONS (replacing pins)

Global change: all pin icons → heart icons (♡ empty, ♥ filled when saved).
Same positioning, same save behavior, same suitcase routing.
Hearts are universal. No learning curve. No explanation needed.

---

## THE TRIP TEASER + GATE

At the bottom of the guide, after THE WARDROBE:

### The teaser:
A sample of what a personalized trip looks like — Day 1 arrival, one dinner, one experience. Beautiful. Specific. Shows the DEPTH of what's possible.

*"This is what a FIL DE VIE trip looks like. Every detail considered."*

### The gate:
NOT "unlock the full itinerary." Instead:

*"Want yours? Tell us about your trip."*

→ Brief form: When are you going? How long? Who with? What matters most to you?
→ Concierge builds her custom trip using her saves + conversation data + Wellspring
→ She receives her personalized itinerary + wardrobe + packing list
→ Payment (flat fee, pricing TBD)

For pilot: the gate exists but is bypassed. Everyone sees the full sample. The brief form is live for testing but no payment required.

---

## THE CONCIERGE

The concierge is the primary differentiator. Not a chatbot. Not support. A travel companion with taste who can also transact.

### Access:
- Pulsing gold circle in bottom nav (always visible)
- Context-triggered moments inside the guide
- Hamburger menu |04|

### What it knows:
- Full site map — every page, every section, every route
- Full product catalog — can recommend specific pieces with prices
- Full guide content — references places, restaurants, hotels by name
- Her saves (when authenticated) — can reference what she's saved
- Her conversation history — remembers what she asked before
- Wellspring taste axes — can map her signals to structured preference data

### What it does:
- Answers questions about destinations, products, travel planning
- Recommends products based on her taste signals
- Builds custom trip plans from her saves and conversation
- Guides confused users through the site ("what is this?" → full walkthrough)
- Sells naturally — surfaces products, suggests the curated trip at the right moment
- Handles bookings (future — when agent mode is built)

### Conversational taste data (the second moat):
Every conversation is a signal that feeds the self-model:
- "I don't like bold colors" → containment: high
- "Somewhere quiet" → social_density: low
- "Something like the Alaïa but less" → price anchor + aesthetic reference
- "It's our anniversary" → occasion, formality bias

Wellspring is taste architecture. The concierge is taste acquisition. Together: more conversations → better taste model → better curation → more trust → more conversations. Flywheel.

---

## CURATE FOR ME — TIMING FIX

**Current (broken):** Popup fires on passport creation + again after saves. Double prompt.

**Correct:**
- On passport creation: NO popup. Just welcome.
- After 3-4 saves: Concierge gently asks *"Want me to build your trip from what you've saved?"*
- The prompt comes from the CONCIERGE (chat bubble), not a system modal.

---

## ABOUT PAGE

Needs rewriting to match new architecture:

1. **What FDV is** — one paragraph. Travel + wardrobe + curation. One place for everything.
2. **How it works** — Browse the guides → save what you love → we build your trip
3. **The concierge** — your travel companion with taste
4. **What you can buy** — curated trips, wardrobes, individual products
5. **Who it's for** — the woman who values intentionality over accumulation

Remove references to subscription tiers, The Current, Curate for Me as separate features.

---

## CONCIERGE INTELLIGENCE ARCHITECTURE — MAJOR WORKSTREAM

The concierge prompt is not a one-time write. It's a living body of knowledge — comparable in importance to the brand genome and Wellspring OS. The brand genome encodes what products ARE. The concierge intelligence encodes how the brand TALKS, SELLS, READS PEOPLE, and ACTS.

This workstream needs a dedicated brainstorm and ongoing knowledge infusion, just like the product genome and taste architecture.

### The five layers:

**1. Voice layer** — how she talks in real-time conversation
- Word choices, sentence rhythm, what she never says
- Different from editorial voice (faster, more responsive, less crafted)
- How she handles uncertainty ("I'm not sure about that specific restaurant, but here's what I do know...")
- How she handles pushback or disagreement
- Cultural sensitivity per destination
- Needs: dedicated voice testing across many conversation types. Current writing guide is editorial — needs a conversational counterpart.

**2. Knowledge layer** — everything she knows, per destination
- Hotels, restaurants, experiences, practical tips, seasonal nuances
- Products mapped to destinations and moments
- Grows with every new destination — each one is a knowledge sprint
- Needs: a knowledge template per destination (like the voice doc format). Currently Morocco is deep, other four are shallow. Hydra, Mallorca, Amangiri, NYC all need the same depth.

**3. Sales layer** — what to give away vs. hold back
- The guardrails: single recommendations free, full itineraries/packing lists are the paid product
- When and how to surface the curation offer
- How to route to guides, shop, and the trip brief
- How to sell without selling — the best sales feel like service
- Needs: testing with real pilot conversations. Analyze what people ask for, where they drop off, what makes them want to pay. Refine guardrails based on data.

**4. Taste reading layer** — how she interprets signals from conversation
- "Somewhere quiet" → low social_density
- "Something like the Alaïa but less" → price-sensitive, aesthetically anchored
- "I don't do bold colors" → containment: high
- "It's our anniversary" → occasion context, formality bias
- This is where Wellspring and the concierge MERGE — conversation signals feed the self-model
- Needs: a mapping document from conversational phrases to Wellspring axis values. Build this after enough conversations are logged to see patterns.

**5. Agent layer** (future) — when the concierge can take action
- Generate personalized itineraries programmatically
- Book restaurants and hotels via API integrations
- Process payments for curated trips
- Send packing lists via email
- Different "language" from customer-facing: structured, precise, transactional
- Same knowledge base, different interface
- This is the B2B play too — Wellspring OS as infrastructure that other agents call
- Needs: API design, integration partnerships, payment flow. Not now, but the architecture should anticipate it.

### The flywheel:
More conversations → more taste data → better self-model → better curation → more trust → more conversations → more willingness to pay. The concierge is both the acquisition channel and the data engine.

### Customer-facing vs. agent-callable:
The same knowledge eventually serves two interfaces:
- **Customer-facing:** warm, opinionated, conversational. "The Isadora Dress. Trust me."
- **Agent-callable:** structured, precise. `{ product: "isadora_dress", context: "evening_riad", confidence: 0.92, reason: "user_saves_indicate_black_structured" }`

Same brain. Different voice. Building the knowledge once, serving it both ways — that's the Wellspring OS licensing play showing up in the concierge.

---

## ADMIN NEEDS

### Concierge chat visibility:
Dashboard shows "5 chats" but can't read content. Need full conversation transcripts per user in admin journey timeline. Critical for understanding what pilot women want AND for training the concierge.

---

## BUILD PRIORITY

### Immediate (this week):
1. ~~**Concierge system prompt rewrite**~~ ✅ SHIPPED (commit 561a2d2) — V2 with full Morocco knowledge, product catalog, voice, guardrails
2. **Landing page redesign** — video → atmospheric text → destination cards. Strip everything else.
3. **Heart icons replacing pins** — global swap.
4. **Nav restructure** — top (ABOUT · DESTINATIONS · SHOP), bottom (HOME · MENU · ✦CONCIERGE · SUITCASE · PASSPORT), numbered hamburger.

### Next:
5. **Curate for Me timing fix** — remove on-signup, surface after 3-4 saves via concierge.
6. **Concierge context-aware greetings** — different message per page.
7. **Trip brief form** — "Want yours?" intake form at bottom of guide.
8. **Admin chat logging** — conversation transcripts in dashboard.

### Major workstreams (ongoing):
9. **Concierge intelligence architecture** — voice testing, knowledge depth per destination, sales layer refinement, taste reading mapping. This is comparable to the brand genome in scope and importance. Dedicated brainstorm sessions needed.
10. **Destination knowledge sprints** — Hydra, Mallorca, Amangiri, NYC each need Morocco-level depth in the concierge prompt.

### Later:
11. **About page rewrite**
12. **Concierge reads user saves** (personalization)
13. **Trip payment flow** (Stripe one-time)
14. **Concierge booking capabilities** (agent mode)
15. **Taste signal extraction from conversations** → Wellspring self-model

---

## DOCUMENTS THIS SUPERSEDES
- FDV_USER_JOURNEY_BRIEF.md (March 31)
- FDV_USER_JOURNEY_MASTER_BRIEF.md (April 1)
- All previous nav restructure briefs
- All previous membership gate / tier specs
- All previous subscription pricing specs

This document is the current truth.
