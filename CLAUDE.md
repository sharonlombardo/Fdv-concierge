# CLAUDE.md — FDV Concierge Project Brain
**Shared context file for Claude.ai, Claude Code, and Cowork**
**Last updated:** April 8, 2026
**Updated by:** Claude Code session (Hero animation replaced with pre-rendered CapCut video)

> HOW THIS FILE WORKS: This is the shared brain across all three Claude
> environments. Claude Code reads it automatically at session start.
> Claude.ai gets this file + a private companion file (CLAUDE-PRIVATE.md)
> uploaded as Project Knowledge. Cowork reads from the local repo.
>
> **What lives here (public):** Architecture, build state, product data,
> feature priorities, principles, workflow, session log.
>
> **What lives in CLAUDE-PRIVATE.md (Project Knowledge only):**
> Competitive landscape, fundraising status, investor contacts, financial
> model details, strategic outreach.
>
> At the end of each significant work session, ask Claude to summarize
> what was done, then bring that summary to Claude Code and say:
> "Append today's session summary to CLAUDE.md and commit."

---

## SECTION 1 — WHO WE ARE

**Founder:** Sharon Lombardo. Solo founder. 25+ years fashion industry
(Tommy Hilfiger, Michael Kors, Kate Spade). Building two live AI-native
products simultaneously.

**The three products:**

**FDV Concierge** (fdv-concierge.vercel.app)
Luxury travel + commerce platform using taste as an operating system.
Editorial content → shoppable wardrobe capsules → trip booking.
The consumer proof-of-concept AND live demo of Wellspring OS infrastructure.

**FDV Daily** (fdvdaily.com)
Daily NYC editorial guide. Two-agent system: Scout (research) + Voice
(editorial). Separate codebase, separate workflow.

**FIL DE VIE**
Established luxury resort wear brand. DTC avg unit price ~$935 MSRP.
Celebrity clientele. 85K+ email audience. Serves as:
- Proof-of-concept market for FDV Concierge
- Credibility anchor for the target audience
- Source of real transaction data for financial model

**Wellspring OS** — the B2B infrastructure thesis underneath everything.
Aesthetic Genome / Brand Genome / Taste Genome architecture.
Addresses the "Invisible Shelf" problem: luxury inventory invisible to
AI agents. FDV Concierge is the consumer layer; Wellspring OS is the
systems-level infrastructure play.

---

## SECTION 2 — CURRENT BUILD STATE (March 26, 2026)

**Platform:** React/TypeScript, Vite, Tailwind, shadcn/ui
**Database:** Neon Postgres + Drizzle ORM (11 tables)
**Hosting:** Vercel
**Images:** Vercel Blob storage (274 mapped URLs)
**Auth:** Stateless HMAC-signed tokens in HttpOnly cookies (scrypt passwords)
**Email:** Resend API (welcome email on signup, domain verification pending)
**AI:** Claude API (claude-sonnet-4-20250514) for concierge chat
**Server:** Express.js + Vercel serverless (api/index.ts), 30+ REST API endpoints
**Repo:** github.com/sharonlombardo/Fdv-concierge (60+ commits)

### Pages & Routes (all LIVE):

**Consumer Pages:**
- `/` — Threshold/landing with hero video, category nav, embedded Current feed
- `/about` — Brand story, tiered service, editorial photography
- `/current` — The Current editorial feed (curated moments, stories, shopping)
- `/destinations` — Grid of 5 destinations (Morocco live, 4 coming soon)
- `/guides` — Guide listing gallery
- `/guides/morocco` — Morocco guide with day carousels, Shop the Story,
  email-gated itinerary (Days 3-8 blurred + unlock flow), 36+ pinnable images
- `/shop` — Product catalog, 103 items, category filtering, pin buttons, item modals
- `/concierge` (also `/itinerary/morocco`) — Full 8-day Morocco itinerary
  with weather, dining, wardrobe looks, shopping, journal, selfie picker
- `/editorial` — Morocco editorial overview, 8-day narrative with outfits
- `/packing` — Packing list with day sections, morning/afternoon/evening looks,
  checkoff, organize/pack view modes, selfie uploads
- `/travel-diary` — Post-trip journal: photos, notes, shareable story images
- `/todays-edit` — Daily edit carousel with mood cards and look tiles
- `/todays-edit/:itemId` — Desert Neutrals capsule detail by category
- `/concierge-info` — Concierge overview: what it does, Day 1 preview,
  passport tiers, "Chat with Your Concierge" CTA
- `/concierge-chat` — AI concierge chat powered by Claude API (Morocco knowledge)
- `/profile` — Email, save count, account settings

**Suitcase & Curation Pages:**
- `/suitcase` — Visual gallery grid (2-3 col), category/destination/edit views,
  search, Curate for Me, saved item cards with remove/status badges
- `/my-edits` — Capsule collection page, auto-seeds Desert Neutrals at 3+ saves
- `/capsule/:capsuleId` — Individual capsule detail with ethereal reveal animation
- `/my-trips` — Trip collection (Morocco live, 4 coming soon)
- `/suitcase/edit/:editTag` — Edit detail with tabbed filtering by type
- `/daily-flow` — Single-day itinerary view with journal integration

**Admin Pages:**
- `/library` — Image library management (upload, tag, categorize)
- `/rules` — Image rules engine (auto-assign images by time/location/keyword)
- `/image-control` — Visual image slot manager
- `/image-management` — Direct per-position image replacement
- `/test-saves` — Debug: view all saves with clear-all
- `/admin/pilot` — Pilot dashboard: user list, per-user saves, aggregate stats
  (password-gated via ADMIN_KEY query param)

**Coming Soon (placeholder pages):**
- `/destinations/hydra`, `/destinations/slow-travel`,
  `/destinations/retreat`, `/destinations/new-york`

### Key Features BUILT:

**Save/Pin System:**
- Gold pin buttons on all saveable content (images, products, places, looks)
- 36+ pinnable images across Morocco guide
- Toast notifications on save ("Saved to your Suitcase" / "Added to your Suitcase")
- Save types: look, product, place, experience, quote, article, ritual, object
- Commerce metadata on saves: brand, price, shopUrl, bookUrl
- Purchase status tracking (want/owned)

**Curate for Me:**
- AI-generated personalized capsule wardrobes from user saves
- First-save prompt: overlay after first pin triggers curate flow
- Full-screen curating animation (crossfading photography, 4-phase transitions)
- Ethereal capsule reveal with slow fade
- Unlimited curate: alternates between capsule variations
- Accessible from: hamburger menu, Morocco guide, About page
- "Edit again anytime" pulsing CTA on capsule detail

**Email Gate / Paywall:**
- Morocco guide: Days 3-8 gated with blur overlay
- "Unlock your complete Morocco experience" + email input
- Pilot tester bypass: "Continue without unlocking"
- Waitlist table captures email + source

**Content Paywall (mid-content):**
- Email gate placed at Day 3 of Morocco (emotional peak, not front door)
- Copy: "Unlock your complete Morocco experience"

**Image System:**
- Studio shot priority across all surfaces (Shop, Suitcase, capsules, carousels)
- Brand genome key mapping with 3-tier fallback (direct → case-insensitive → alias)
- Image library with tags, categories, priorities
- Rule-based auto-assignment (match by time, location, keywords)
- Custom image upload per itinerary slot
- 274 Vercel Blob CDN-mapped URLs with embedded fallbacks

**Commerce:**
- 103 products in brand genome (YSL, Alaïa, Phoebe Philo, Bottega Veneta, etc.)
- Farfetch affiliate links
- Item modals with brand/price, size/color, descriptions, shop/book buttons
- Event tracking: affiliate_click, book_click, save_item, open_modal, scroll_depth

**Navigation:**
- Bottom nav: Current | Suitcase | Guides | Shop
- Top bar with hamburger, logo, concierge icon (transparent → white on scroll)
- Hamburger drawer with 25+ items organized in sections
- Curate for Me in hamburger menu

**Editorial:**
- The Current feed with multiple story categories
- Morocco editorial: 8-day narrative with wardrobe looks
- Editorial product maps linking tiles to commerce data
- Morocco guide with Shop the Story sections

**Auth System (NEW — March 26):**
- "Create Your Digital Passport" signup/login flow
- Stateless HMAC-signed tokens in HttpOnly cookies (30-day expiry)
- Password hashing with Node crypto scrypt
- Passport Gate modal: triggered on save attempt when not logged in
- Pending save callback: save completes automatically after signup
- Per-user save association via user_email column

**Concierge Chat (NEW — March 26):**
- AI-powered travel concierge at /concierge-chat
- Claude API (claude-sonnet-4-20250514) with Morocco-specific system prompt
- Knows restaurants, riads, weather, what to wear, Atlas Mountains, Medina
- Suggestion chips for common questions
- Accessible from concierge-info page CTA + hamburger menu

**Admin Dashboard (NEW — March 26):**
- Pilot dashboard at /admin/pilot (ADMIN_KEY gated)
- User list: name, email, signup date, last active, save count
- Click user to expand saves
- Aggregate stats: top saved items, top page views, curate usage

**Post-Save Nudge (NEW — March 26):**
- After 3rd-5th save, shows aesthetic signal overlay
- Reads user's saved aesthetic tags, maps to human phrase
  (e.g., "desert warmth and golden light", "clean lines and quiet luxury")
- CTA: "Curate for Me" → triggers capsule curation

**Email (NEW — March 26):**
- Welcome email via Resend API on signup
- "Your Digital Passport is ready" — branded HTML template
- From: onboarding@resend.dev (domain verification pending for custom domain)

**Page View Tracking (NEW — March 26):**
- usePageView hook fires page_view event on every route change
- Data visible in admin dashboard

**User Features:**
- Travel diary with photo uploads, notes, shareable story images
- Selfie system with background removal (ImgLy)
- Journal entries synced local + server
- Packing list with checkoff functionality

### What is IN PROGRESS:
- Morocco route migration: /concierge → /destinations/morocco
- Resend domain verification for custom from-email (fdvconcierge.com on GoDaddy)
- Pilot monitoring — 3 users signed up Day 1, watching dashboard for journey data

### Key Features BUILT (March 30 — Post-Pilot Fixes):

**Saves Bug Fix (PR #9):**
- All save endpoints now scoped to authenticated user (was globally unscoped)
- Passport gate race condition fixed
- Signup endpoint fixed: only grabs signing-up user's anonymous saves

**Event Tracking (PR #9):**
- Session IDs, enhanced page views, scroll depth (25/50/75/100%), concierge
  chat tracking, session start/end with duration

**Admin Dashboard Rebuild (PR #9):**
- 6 tabs: Overview (funnel), Users (journey timeline), Content (scroll depth),
  Alerts (zero-save/inactive), Links (broken link scanner), Products (editable catalog)

**Link Health System (PR #10):**
- link_health table, manual + nightly cron URL checking, rate-limited HEAD requests
- Admin approve/reject/manual replace for broken links

**Products Table — Split Brain (PR #11):**
- Commerce data (URLs, prices, shop_status) in database, editable from admin
- Taste data (atelier codes) stays in genome JSON
- Shop status: Live / Coming Soon / Sold Out / Discontinued

**Evening Edit Redesign (PRs #12-14):**
- "Riad Evenings" — art directed by Sharon, hero + 5 mood images, curated products

**Floating Concierge — "The Concierge, Everywhere" (PR #22):**
- Gold chat icon (bottom-right) on every page, slide-up 75vh panel
- Context-aware greetings based on current page
- Tiered message limits: 3 anonymous / 15 free / unlimited Gold
- Gate messages as chat bubbles (concierge speaks the gate, not system modals)
- Conversation logging to concierge_conversations table (both sides)
- Enhanced system prompt: voice docs + product catalog + user saves + page context

**Voice Doc Infrastructure (PR #22):**
- 5 destination knowledge files in /data/concierge/ loaded dynamically at runtime
- Morocco + NYC: Sharon's personal voice. Hydra, Mallorca, Amangiri: editorial research
- loadVoiceDocs() reads .md files, skips placeholders, joins into system prompt
- loadProductCatalog() prefers DB products table, falls back to genome JSON
- Adding a destination = adding a .md file to /data/concierge/

**Guide/Itinerary Separation (PR #22):**
- ItineraryTeaser slimmed from full Day 1-8 inline content to compact preview card
- Mini day list (Days 1-3 titles + "5 more days") with gate to /concierge
- Clean separation: guide = editorial discovery, itinerary = gated product

**Curate Animation Polish (PR #22):**
- Animation tuned from ~15s to ~7s (800-1100ms per phase)
- Smooth text transitions (0.5s fade)
- Eliminated suitcase page flash: overlay stays opaque until navigation

**Weather API (PR #22):**
- /api/weather?city={city} endpoint ready (OpenWeatherMap proxy)
- Needs OPENWEATHER_API_KEY added to Vercel env vars

### What is COMING SOON (Notify Me capture):
- Experiences, Culture, Objects of Desire, Daily Rituals, State of Mind
- Hydra, Slow Travel, Retreat, New York destinations

**Current Issue 1:** Morocco as anchor story. 5 stories planned. In
active editorial development.

---

## SECTION 3 — ARCHITECTURE (LOCKED March 1, 2026)

**Navigation:**
- Bottom nav: Home | Destinations | Shop | My Edits | Suitcase
- Top bar: Hamburger (left) | FDV logo → Concierge tap (center) | Search (right)
- Profile lives in hamburger menu

**Membership Tiers:**
- Digital Passport: free
- Gold Passport: $29/month
- Black Passport: $59/month

**Gate Logic:**
- Free: Destination guide + editorial overview + Day 1 packing peek
- Gold+: Full itinerary + full packing list (all days, 5 positions each)
- Black: My Wardrobe (closet) + unlimited My Edits + Book the Trip

**Core Sections:**
- Editions = brand-owned content
- Edits = user-owned saved capsules
- The Current = discovery feed
- Suitcase = user memory/saves
- Concierge = AI routing (V2)

**Suitcase contains:**
- Saved items
- My Wardrobe (Black tier)
- My Packing Lists (Gold+)
- My Edits (all tiers, tiered access)

**My Edits:** AI-curated daily looks. 1/day free, 3/day Gold,
unlimited Black. Has its own bottom nav tab.

**Cross-tagging rule:** ALL Morocco products surface in: The Current
editorial + destination guide + itinerary + packing list + Shop
(with "As seen in: Morocco" badge). One data layer, many surfaces.

**Commerce aesthetic:** Pure B&W. Gold only for saved pin state.

**Onboarding:** "Create Your Digital Passport." No taste questions upfront.

**Save behavior:** Save requires Passport (any tier). Anonymous users
can browse and purchase but not save.

**Subscriptions only** — no single itinerary purchases. Trip booking
is a separate premium product.

---

## SECTION 4 — PRODUCT DATA

**Brand Genome:** client/src/lib/brand-genome.ts
**Product JSON:** client/src/data/fdv_brand_genome.json
**103 products** currently seeded. Categories: clothing (dresses, tops,
outerwear, swimwear), accessories (sunglasses, jewelry, bags, scarves),
beauty (skincare, fragrance, wellness).

**Passport Collection** (physical merch — to produce):
Gold/black covers, luggage tags, dopp bags. Drop-shipped.

**Objects of Desire:** Coming soon section.

---

## SECTION 5 — PILOT FEATURE PRIORITY LIST
*From AmiGo competitive analysis session, March 25, 2026*
*Status updated: March 26, 2026 after full codebase audit*

**TIER 1 — Must ship before pilot launches:**
1. ✅ SHIPPED — Mid-content paywall on Morocco editorial. Email gate at
   Day 3 with blur overlay + "Unlock your complete Morocco experience."
   Pilot tester bypass included. (Copy could be refined to match
   "Some things are kept just for Passport holders" direction.)
2. ✅ SHIPPED — "Added to Suitcase" toast notification. Both pin-button
   and suitcase-button show confirmation toasts with 2s duration.
3. ✅ SHIPPED — Suitcase as visual gallery grid. 2-3 column Pinterest-style
   grid with visual cards, category/destination/edit views, search.
4. ✅ SHIPPED — End-of-article share prompt. Italic "Love this? Tap the
   share icon above — your friends will thank you." after closing quote
   on Morocco guide + all 5 Current stories.

**TIER 2 — Build during pilot, first 30 days:**
5. Shareable Edition/Edit link — Morocco Edit as forwardable link.
   85K FIL DE VIE audience = distribution network.
6. Invite mechanic — first 200 members get 5 invites each. Waitlist
   bypass for invitees.
7. Location-aware nearby discovery — when member is in Marrakech,
   FDV surfaces Morocco content automatically. Needs geocoded places.
8. Three-signal save count on place cards — Recommended / Saved /
   In Packing List.

**TIER 3 — Post-pilot, V2:**
9. Set Cover Photo for Suitcase trips
10. FDV Correspondents program — tastemakers by city, writing venue
    notes. Start identifying from FIL DE VIE customer list now.
11. Passport stamps / travel log — full Suitcase realization with
    wardrobe layer.

**DO NOT BUILD for pilot:** Global explore map. Needs content density.
Individual place maps within Morocco itinerary = fine.

**BONUS — Built but not on original priority list:**
- Curate for Me: full AI capsule generation flow with animation
- First-save prompt triggering curation
- Travel diary with photo journal + shareable story images
- Selfie system with background removal
- Image management admin tools (library, rules, slots)
- Today's Edit carousel
- Event/analytics tracking system

---

## SECTION 6 — KEY PRINCIPLES (non-negotiable)

- Fashion looks shown HEAD TO TOE always. Never cropped.
- Taste intelligence is the moat, not inventory. No inventory model.
- AI agent orchestration for commerce — FDV doesn't hold stock.
- Solo + AI fluency is a differentiator, not a liability.
- Build and iterate over extensive planning. Momentum over perfection.
- Imagery is primary interface between Sharon's aesthetic intelligence
  and AI systems. Visual curation > linguistic description.

---

## SECTION 7 — HOW SHARON WORKS WITH CLAUDE

**Claude.ai:**
Strategy, research, competitive analysis, narrative, editorial voice,
investor framing, content. The thinking layer.
Project: FDV Concierge (has IA doc, wireframe guide, VC deck as
project knowledge files + CLAUDE-PRIVATE.md)

**Claude Code (terminal + web):**
Build, fix, deploy, commit. The execution layer.
Reads CLAUDE.md automatically at session start.
Has direct codebase access.

**Cowork:**
File tasks, document automation, desktop workflows. The admin layer.
Reads from local repo folder.

**The bridge:** Sharon carries context between environments manually.
This CLAUDE.md file + CLAUDE-PRIVATE.md exist to reduce that overhead.

**Sharon's communication style:**
- Direct. No flattery. Pushback welcome.
- Visual thinker — imagery over description
- Builds momentum through iteration, not planning
- Peer-to-peer framing with investors and partners

---

## SECTION 8 — OPEN ITEMS (updated April 1, 2026)

**Immediate (User Journey Redesign — from Oren/Susannah feedback):**
- Navigation restructure: DESTINATIONS · SHOP · SUITCASE🧳 · CONCIERGE · PASSPORT
- Destinations grid (5 cards: Morocco, Hydra, Mallorca, Amangiri, New York)
- Tappable image mechanic (Zara Home split screen: editorial LEFT, product(s) RIGHT)
- Early sign-up prompt (taste profile framing, access not friction)
- Save moment enhancement ("Saved to your Edit. The more you save, the better I know you.")
- Gate 1: end of guide → Digital Passport → Itinerary Overview
- Returning user detection
- Concierge woven into journey moments (floating widget from arrival)
- About page with tiers clearly explained
- Gates 2 + 3 (Gold/Black upsells)

**Technical:**
- OpenWeatherMap API key → add to Vercel environment variables
- Fix Bottega Solstice 403 broken link
- Fix Phoebe Philo boot 503 warning link

**Post-Pilot Active:**
- Lisa Ruffle outreach message (warm, peer-to-peer)
- Gillian intro via April (creative director, Brooklyn, modern marketplace)
- Product genome enrichment — ~10 Phoebe Philo items need atelier_codes
- "Static Preference to Taste in Motion" slide revision
- Phase 1 SQL migrations brief (Wellspring build sequence)
- Map atelier_codes to Wellspring controlled vocabulary
- Financial model completion

**Ongoing / Not Blocking Pilot:**
- Resend domain verification — fdvconcierge.com DNS records on GoDaddy
- Klaviyo access for email open rate (needed for financial model)
- Trip purchase pricing/margins — flat fee structure, numbers TBD
- Refund/cancellation policy for subscriptions and trip purchases
- Curate My Edit algorithm deep build — Phase 2, ontology-driven (core IP)
- Taste signal extraction from concierge conversations (Phase 2)
- Remaining 4 Morocco stories for The Current Issue 1
- Morocco route migration: /concierge → /destinations/morocco
- Rotate Anthropic API key (was shared in chat — should regenerate)

---

## SECTION 9 — BUILD HISTORY (March 2026)
*52 commits across Claude Code desktop + web sessions. Grouped by feature.*

### Pilot Launch Build (March 26, 2026 — Claude Code web)
- Auth system: signup/login with HMAC-signed cookie tokens, Passport Gate
  modal on save attempts, per-user save association, profile page updates
- Admin dashboard: /admin/pilot with user table, save drill-down, aggregate
  stats (top saves, page views, curate usage), password-gated
- End-of-article share prompt on Morocco guide + Current feed stories
- Concierge info page redesign: Day 1 preview, passport tiers, chat CTA
- Day 8 CTA updated: "Meet Your Concierge" replacing old copy
- Concierge chat: /concierge-chat with Claude API, Morocco knowledge prompt
- Welcome email via Resend API on signup (domain verification pending)
- Post-save concierge nudge: aesthetic signal after 3rd-5th save
- Curate rotation fix: peek/consume split, localStorage persistence
- Hamburger menu: "YOUR MOROCCO" → "YOUR TRIPS", added "Chat with Concierge"
- Page view tracking hook for analytics
- Vercel-GitHub integration reconnected (was disconnected)
- Environment variables added: SESSION_SECRET, ADMIN_KEY, RESEND_API_KEY,
  ANTHROPIC_API_KEY

### Image System Overhaul
- Studio shot priority system: studio product images now override editorial
  fallbacks across Shop, Suitcase, capsules, carousels, and itinerary views
- Brand genome key mapping for look items (FLOW keys, not SECTION keys)
- Fixed Column Dress image (cropped white bar + "Style" text label)
- Removed 3 wrong editorial fallback images from Shop grid
- Shop grid display: editorial images use cover, studio shots use contain
- Suitcase deduplication (Khaite slippers) + studio image resolution for saves
- Fixed all daily flow images, itinerary overview images, carousel products
  to use studio shots

### Save/Pin System — Morocco Guide
- Save pins added to ALL 36+ images in Morocco guide (every photo pinnable)
- Pins moved from text to main images
- Fixed 17 missing pins on large/left images
- 19 Morocco guide places all have save pins

### Suitcase & Save Organization
- Fixed Travel/Destinations tab: stopped filtering out place/destination saves
- Fixed Slow Travel grouping: matches both 'slow' and 'slow-travel' storyTags

### Curate for Me Feature (major new feature)
- "Curate for Me" button — AI generates personalized capsule wardrobes from saves
- First-save prompt: centered overlay appears after first pin, triggers curate flow
- Ethereal curate animation: full-screen crossfading photography with text overlay,
  slow fade-out, dreamy capsule reveal (rebuilt multiple times for polish)
- Unlimited curate: alternates between capsule variations for pilot
- Curate for Me accessible from: hamburger menu, Morocco guide (between
  Shop Local and The Stay), About page sidebar link
- "Edit again anytime" CTA on capsule detail page with pulsing animation
- Whisper-weight contextual text around Curate button and save grid
- Curate-again messaging on capsule detail, first-save prompt, Morocco guide
- Fix: re-trigger on every navigation, not just first mount

### My Edits Tab
- "Edits built from what you've saved" heading
- Heading styling refinements (size, opacity)

### Navigation & Menu
- Hamburger menu reordered with section labels and divider
- Curate for Me added to hamburger drawer

### About Page
- New copy: "drawn to" → "love", "what resonates" → "what matters to you"
- Sidebar link opens hamburger drawer
- 6 editorial photography images woven between text sections

### Editorial & Copy
- Intro block rewrite: new copy, lighter styling, Curate for Me + details links
- Concierge subtitle copy update
- Morocco guide blank page fix (missing Link import)

---

## DAILY SESSION LOG
*Append new entries at the top. Format: Date | Environment | Summary*

---

### April 8, 2026 | Claude.ai + Claude Code (web) — Bug Fix Marathon + UX Planning

**What shipped today:**

**Bug fixes via Dispatch/Claude Code:**
- Product modal cropping + close button fixed globally
- Travel diary photo uploads fixed
- Phoebe Philo image fixed
- Capsule grid sizing fixed
- MARRAKECH title fixed
- Nav bar color fixed
- Photo persistence (user scoping) fixed
- Batch upload fixed
- Save association for pilot users fixed
- Security bug fixed
- Admin save details fixed
- Save confirmation UX fixed

**Additional fixes this session (Claude Code):**
- Bottom nav now renders on landing page (was returning `null` on `/` route)
- Bottom nav icons no longer clip during iOS scroll — fixed with `calc(60px + env(safe-area-inset-bottom))` and `translateZ(0)` GPU compositing layer
- Product modal hard ceiling added — modal can no longer slide above top nav bar on mobile. `top: 56px` constraint + flex-col layout with non-scrolling header (drag handle + X button) + scrollable content area
- Product modal X button visibility fixed — 44x44px touch target, 25% opacity dark circle with white X, z-index 60

**Hero animation — CapCut video replacement:**
The React animation was replaced entirely with a pre-rendered CapCut video. 362-line component → 30 lines. One looping MP4 (~25MB, 1080p, H.264, 24fps, ~1:40 loop) hosted on Vercel Blob. Starts muted, mute/unmute toggle top right. All scattered text, white title cards, multilingual greetings, section words baked into video. Sharon has full editorial control without touching code.

**Key architectural lesson logged:**
When React's rendering model fundamentally conflicts with a feature's requirements, move the complexity out of React entirely.

**Still broken (carry forward):**
- Back button in daily flow
- Suitcase save from itinerary modal
- Breakfast/lunch/dinner items opening to shopping instead of event details

**Next sprint — Destinations page redesign:**
Current state: vertical scroll of destination cards when tapping THE GUIDES. Replace with Zara Travel Mode style full-screen side-swipe carousel. One destination per screen, full bleed photo, bold destination name, atmospheric one-liner, VIEW GUIDE button, swipe left/right between all five destinations. Morocco = live (GUIDE badge). Others = Coming Soon. FDV aesthetic — cream, serif italic, consistent with rest of site.

**Pilot feedback received:**
- Maggie: oriented, going back in, product modal bug reported and fixed
- All modal/close bugs now resolved

**Pending outreach:**
- Lisa Ruffle (DOTSHOP) still pending
- Anvisha Pai (Moda.app) — DM sent, awaiting response
- Warren Shaeffer + Quentin Clark — connection requests sent

---

### April 3-8, 2026 | Claude Code (web) — Hero Animation Debugging + CapCut Video Replacement
**Topic:** Multi-day debugging of hero animation flickering → replaced entire system with Sharon's pre-rendered CapCut video

**The Problem (April 3):**
Hero animation had persistent flickering and partial rectangle artifacts. Images from different parts of the 53-item media sequence were appearing as partial rectangles overlaid on the current image. The issue manifested as a "next picture breaking in on the picture before with only partial screen" — squares, rectangles of random images bleeding through during transitions.

**Debugging Journey (April 3 — what was tried and what we learned):**
The original hero animation used React state (`useState(mediaIndex)`) with conditional rendering to cycle through 53 media items (35 stills + 18 videos). Multiple approaches were attempted to fix flickering:

1. **Imperative DOM manipulation** (bypass React for media layer) — Introduced the rectangle artifact bug. React reconciliation conflicted with imperatively-created DOM elements, causing ghost images.

2. **Double-buffer with `img.decode()`** — Two `<img>` elements swapping opacity after decode. Failed because decode() promises resolved out of order — stale images appeared on top of current ones.

3. **Create/destroy pattern** (like video elements) — Created/destroyed `<img>` elements per transition. Failed because a React-rendered `<img>` was inside the same container being imperatively modified. Every React re-render (on text changes) re-inserted the React-owned `<img>`, creating ghost images.

4. **Safari compositor bugs** — Hidden `<video>` elements with `visibility: hidden` or `opacity: 0` leaked partial frames in Safari's compositor. Video elements needed to be fully removed from DOM, not just hidden.

5. **Video `key` prop causing unmount/mount** — `key={currentMedia}` on `<video>` elements caused React to destroy and recreate the element on each video change. Between the unmount and mount, the fallback still layer flashed briefly, causing the "nearest still" to appear between every video-to-video transition.

**Key Technical Insight:**
The fundamental tension: React wants to own the DOM (virtual DOM reconciliation), but smooth media transitions require frame-precise control that React's rendering cycle can't guarantee. Every attempt to work around this (imperative DOM, double-buffering, create/destroy) introduced new bugs because React and imperative code fought over the same DOM nodes.

**Critical Discovery — Branch vs Main:**
Multiple fix attempts were pushed to the `claude/add-claude-md-XVdke` branch, but Vercel deploys from `main`. Sharon kept testing the same broken `main` code while fixes sat unseen on the feature branch. This was identified and corrected — all subsequent pushes went directly to `main`.

**The Solution (April 8):**
Sharon rebuilt the entire hero animation as a **single pre-rendered video in CapCut**. All transitions, timing, text overlays, and effects baked into one file. This eliminated:
- All React state management for media cycling
- All flickering/rectangle/compositor bugs
- 362 lines of complex animation code
- The fundamental React-vs-imperative-DOM tension

**Final Implementation:**
```tsx
// hero-animation.tsx — from 362 lines to 30 lines
export function HeroAnimation() {
  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <video autoPlay muted loop playsInline
        src="https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/landing%20page%20video.mp4"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Mute toggle button */}
    </section>
  );
}
```

**CapCut Export Settings (for future reference):**
- Resolution: 1080P (portrait, matching mobile-first design)
- Codec: H.264, Format: MP4
- Bitrate: ~2000-3000 kbps custom (keeps file under 30 MB)
- Frame rate: 24fps
- Duration: ~1m 40s (loops via `<video loop>`)
- Original 4K export was 642 MB → compressed to ~25 MB

**Video Features:**
- All destination imagery (Morocco, Hydra, Mallorca, NYC, etc.)
- Multilingual greetings with typewriter-style text (HO·LA, ΓΕΙΑ, こんにちは, SA·LU·TE, مرحبا, שלום, HELLO)
- Feature words (TRAVEL, TIPS, MEMORIES, SHOP)
- White card destination reveals (MOROCCO, HYDRA, MALLORCA)
- Background music with mute/unmute toggle
- Seamless loop

**Mute/Unmute Toggle:**
- Starts muted (required for browser autoplay policies)
- Speaker icon button (🔇/🔊) positioned below SHOP nav link (top: 48px, right: 16px)
- Toggle unmutes video for music playback

**Also During This Session:**
- Debug overlay system built (`?debug=1` URL parameter) for slow-mode + index display — useful tool for future video/animation debugging
- Shot list document (`data/hero-animation-shot-list.md`) updated but now superseded by CapCut video
- Multiple admin dashboard and mobile UI fixes merged to main by other sessions

**Files Modified:**
- client/src/components/hero-animation.tsx (rewritten from 362 → 30 lines)
- data/hero-animation-shot-list.md (updated, now historical reference)
- CLAUDE.md (this session recap)

**Key Lesson:**
When React's rendering model fundamentally conflicts with a feature's requirements (frame-precise media transitions), the best solution may be to move the complexity OUT of React entirely. Sharon's CapCut video is more reliable, looks better (she has full editorial control), and is trivially simple to implement. The "AI-native" instinct to solve everything in code missed the obvious creative solution.

**Video URL:** `https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/landing%20page%20video.mp4`

**PRs/Commits:** ~15 commits across April 3-8, all on main. PR #25 created on feature branch (now superseded).

**Still Pending (carried forward):**
- OpenWeatherMap API key → Vercel env vars
- Resend domain verification for custom from-email
- Navigation restructure from April 1 user journey redesign brief
- Repository visibility: Sharon making repo public so Claude.ai can view code directly

---

### April 2, 2026 | Claude Code (web) — Hero Animation Video Integration + Media Pool Expansion
**Topic:** Multiple rounds of video integration, timing refinement, and media curation for the Zara-inspired hero animation

**Session Overview:**
Extended the hero animation from a stills-only experience to a mixed media loop with editorial video clips, closely matching the Zara Travel Mode reference video. Multiple rounds of feedback from Sharon with live screenshots drove iterative refinement of timing, media selection, and visual quality.

**Video Integration (Major Feature):**
- Added video clips mixed into the hero media pool (first 4, then expanded to 10)
- Videos render as `<video autoPlay muted playsInline>` with object-fit: cover
- `isVideo()` helper checks URL extension (.mp4/.MP4/.webm/.mov) to choose between image div and video element
- Videos uploaded by Sharon to Vercel Blob storage, URLs provided for each batch
- Dual timer system: videos hold longer than stills (separate durations)

**Timing Refinement (Multiple Iterations):**
- Analyzed Zara Travel Mode video pacing: stills ~1s, videos ~2s
- Had Gemini analyze Sharon's Zara screen recording for shot-by-shot breakdown with timestamps
- Started at 3.5s video / variable still durations → too slow
- Went to 2s video / 1s still → good but stills slightly long
- Final state: **750ms stills / 2s videos** — matches Zara's rapid-fire energy for stills while letting video clips breathe

**Media Pool Curation (42 items final — 32 stills + 10 videos):**

*Videos added (10 total):*
- hero-video-1 through hero-video-4 (original batch — fashion/destination clips)
- blowing shirt clip (fashion editorial)
- woman in white in water (replaced model on rock)
- hydra clip 1 (destination)
- Gemini-generated model in white dress by ocean (long descriptive filename)
- italy coast (destination)
- mallorca (destination)

*Stills added from Vercel Blob (4):*
- morocco blk outfit, morocco cream skirt (fashion stills)
- new york 1, new york 2 (destination stills)

*Media removed:*
- retreat-place-1 and retreat-hero (desert tent images) — too low resolution, Sharon identified via screenshots
- guide-1 through guide-4 clips (screen recordings of scrolling through the app) — looked like demo footage, not editorial content, Sharon said "the guide shots just aren't working"
- postcard clip — removed alongside guide clips

**Zara Reference Analysis:**
- Sharon provided ~25 frame-by-frame screenshots from the Zara Travel Mode video across 5 batches
- Sharon had Gemini analyze the full video, producing a shot-by-shot CSV breakdown with timestamps, durations, and content types
- Key insight: Gemini miscategorized ~half the shots (listed videos as stills), but the timing data was useful
- Zara mix is roughly 50/50 stills and video, with stills at ~1s and videos at ~2s
- Used this analysis to calibrate our timing and media ratio

**Bugs Fixed:**
- **Text overlapping nav bar**: TypewriterText missing `position: "absolute"` — CSS position properties (top/right/bottom/left) were ignored, all text rendered at top-left over nav. Fixed by adding absolute positioning.
- **Wrong word set (multiple times)**: Iterations accidentally stripped words or added wrong ones (DISCOVER, EAT, RITUAL). Restored correct set: 7 multilingual greetings + TRAVEL, TIPS, MEMORIES, SHOP.
- **Typewriter speed**: 80ms/char too fast, 3000ms adaptive too slow and cut off mid-type. Settled on 200ms/char fixed (matched Zara pacing).
- **useDelayedTypewriter window.__heroTimer bug**: Using `(window as any).__heroTimer` for interval storage got overwritten when multiple ScatteredSyllable components rendered simultaneously. Fixed with `useRef` per component instance.
- **Low-res images spotted by Sharon**: retreat-place-1 and retreat-hero identified via screenshots and removed.

**Final Animation State:**
- 42 media items: 32 stills (750ms each) + 10 videos (2s each)
- Full loop duration: ~44 seconds
- Text sequence: 7 multilingual greetings (HO·LA scattered, ΓΕΙΑ, こんにちは, SA·LU·TE scattered, مرحبا, שלום, HELLO) + 4 feature words (TRAVEL, TIPS, MEMORIES, SHOP) + 3 white card destinations (MOROCCO, HYDRA, MALLORCA) + ~60% silent frames
- Typewriter effect: 200ms/char letter-by-letter reveal with cursor blink
- Dark overlay at 0.15 opacity only during text/scattered moments
- White cards: cream background (#F7F5F1), text positioned lower-left like Zara
- Scattered syllables: extra-large type at different screen positions with staggered delays

**Key Files Modified:**
- client/src/components/hero-animation.tsx (video support, timing changes, media pool updates across multiple commits)
- CLAUDE.md (April 1 session recap added)

**Technical Decisions:**
- Vercel Blob storage for all video + new still uploads (URL-encoded filenames)
- VIDEO_BASE constant points to blob root (not images-v2 subfolder) for new uploads
- 16:9 aspect ratio recommended for new video clips (Sharon asked for specs)
- Stills can be any high-res proportion, rendered with backgroundSize: cover

**PRs/Commits:** Multiple commits across the session, all pushed to main, auto-deployed via Vercel

**Still Pending (carried forward):**
- Sharon may add more destination videos
- OpenWeatherMap API key → Vercel env vars
- Resend domain verification for custom from-email
- Navigation restructure from April 1 user journey redesign brief

---

### April 1, 2026 | Claude Code (web) — Evening: Landing Page Redesign + Hero Animation
**Topic:** Full landing page rebuild, Zara Travel Mode-inspired hero animation with video

**Landing Page Redesign (3 changes):**
1. Full-screen 100vh animated hero replacing static video landing
2. Top nav restructured: hamburger + FDV badge + ABOUT · THE GUIDES · SHOP (transparent overlay on hero, Zara-style 9px uppercase links)
3. Bottom nav background changed to black (#1A1A18) with white icons

**Hero Animation — Multiple Iteration Rounds:**
Built from scratch, iterated 8+ times based on Sharon's live feedback + Zara Travel Mode
video reference (frame-by-frame analysis from 40-second screen recording).

Final version features:
- **Typewriter effect**: letter-by-letter text appearance at 200ms/char (matched to Zara pacing)
- **7 multilingual greetings**: HOLA (scattered syllables HO·LA), ΓΕΙΑ, こんにちは, SALUTE (scattered SA·LU·TE), مرحبا, שלום, HELLO
- **4 feature words**: TRAVEL, TIPS, MEMORIES, SHOP
- **3 white card destinations**: MOROCCO, HYDRA, MALLORCA — typewriter on cream background, lower-left positioned like Zara
- **Scattered syllable treatment**: HO·LA and SA·LU·TE appear as extra-large syllables at different screen positions with staggered delays (inspired by Zara's SALUTI treatment at 0:34-0:36)
- **4 video clips** mixed into 32-item media pool (uploaded to Vercel Blob), hold 3.5s vs 0.5-0.9s for images
- **28 editorial photos** across 5 destinations (removed 2 low-res desert images)
- **~60% silent frames**: most of the sequence is images/video cycling with no text overlay
- **Dark overlay** only appears when text is showing (not during silent or white card moments)

**Iteration History (what was tried/fixed):**
1. Initial build: simple greeting words cycling over images — too plain
2. Added 4 text treatments (scattered, section words, silent frames, white cards) — too flickery
3. Multiple timing/speed adjustments — words too fast, then too slow
4. Typewriter attempt #1: text had no `position: absolute` → everything rendered at top-left over nav
5. Word set accidentally stripped to 7 — restored full multilingual set
6. Typewriter at 3s/word (adaptive) was too slow, words cut off mid-type — fixed to 200ms/char
7. Sharon provided frame-by-frame Zara screenshots (~25 frames across 40s) — used to match exact pacing, white card position (lower-left), and scattered syllable treatment
8. Final: added video clips from Vercel Blob storage for Zara-like motion energy

**Key Files Modified/Created:**
- client/src/components/hero-animation.tsx (NEW — core animation, heavily iterated)
- client/src/pages/threshold.tsx (replaced video hero with HeroAnimation component)
- client/src/components/top-bar.tsx (nav restructure: ABOUT · THE GUIDES · SHOP)
- client/src/components/bottom-nav.tsx (black #1A1A18 background)

**Technical Decisions:**
- Dual independent timer system: images/video cycle on their own rhythm, text sequence on a separate timer
- Videos render as `<video autoPlay muted playsInline>` with object-fit: cover
- `isVideo()` helper checks URL extension to choose between image div and video element
- White cards pause the image/video timer (no cycling behind white)
- Auth redirect: logged-in users skip hero → go straight to /current
- Wouter routing (not react-router) for navigation

**PRs/Commits:** 10 commits across the session, all merged to main via fast-forward

**Also Done This Session:**
- Merged PR #22 (floating concierge + voice docs)
- Committed April 1 Claude.ai session recaps to CLAUDE.md (user journey redesign + Moda competitive intel)
- Voice docs copied from brand voice/ folder to data/concierge/

---

### April 1, 2026 | Claude.ai — Afternoon: User Journey Redesign
**Topic:** Competitive UX research (Zara Travel, Net-a-Porter, Zara Home) + full user journey architecture

**The Problem:** Oren Zaslansky (founder, strategic advisor) and Susannah (exact ICP)
both confirmed confusion about what the site is and what to do without external
guidance. Site is feature-first, not journey-first.

**Competitive UX Research:**
- Zara Travel: numbered nav as sequence, destination grid, full-screen about
- Net-a-Porter: early modal sign-up (access-framed), "walking through doors" mechanic
- Zara Home: KEY MECHANIC — story is spine, tap image → split opens (editorial LEFT,
  product(s) RIGHT, scrollable), close → back exactly where you were. No navigation loss.

**Strategic Decision LOCKED: Travel First.**
Amazon/books analogy. Travel saves carry intent, timing, mood, price tolerance.
That's the proprietary signal. Travel-first surfaces moat data AND solves UX confusion.

**Architecture Decisions LOCKED:**
- The Current + Guides merged → THE GUIDE (one editorial product per destination)
- Nav: DESTINATIONS · SHOP · SUITCASE🧳 · CONCIERGE · PASSPORT
- Suitcase contains: My Edit (all saves) + My Trips (purchased itineraries)
- "Your Trips" as separate nav section eliminated — lives inside Suitcase
- Save reframe: "Saved to your Edit. The more you save, the better I know you."
- After 3-4 saves: "I'm starting to see your world. Want me to pull this together?"

**Gate Architecture (LOCKED):**
- Gate 1 (end of guide): Digital Passport (free) → Itinerary Overview
- Gate 2 (end of itinerary overview): Gold ($29/mo) → Full itinerary + daily flow
- Gate 3 (first moment in Gold): Black ($59/mo) → Concierge, packing, customization
- Gates feel earned not imposed — she always gets something real first

**Concierge = PRIMARY Differentiator:**
- Not a chatbot. A travel companion that knows her.
- Floating widget on every page from arrival: "New here? I can show you around."
- The Akinator principle: for some users Concierge IS the onboarding
- PRIMARY nav item, not buried support feature
- Woven into journey at specific moments (end of guide, after saves, inside edit)

**Early Sign-Up Prompt (new — not previously built):**
- After first page view or first scroll
- Framing: ACCESS not discount. "Start building your travel world."
- → "Create your Digital Passport" / "Not now"

**Implementation Priority for Claude Code:**
1. Navigation restructure
2. Destinations grid
3. Tappable image mechanic (Zara Home split screen)
4. Early sign-up prompt
5. Save moment enhancement
6. Gate 1 (end of guide → passport → itinerary overview)
7. Returning user detection
8. Concierge woven into journey moments
9. About page with tiers
10. Gates 2 + 3

**Success Criteria:**
- Oren understands FDV in 30 seconds without instructions
- Susannah (exact ICP) knows immediately what to do and wants to sign up
- New user reaches first save within 3 minutes
- Concierge can fully onboard a confused user conversationally

**Files Produced:** FDV_SESSION_APRIL1.md, FDV_USER_JOURNEY_MASTER_BRIEF.md

---

### April 1, 2026 | Claude.ai — Moda.app Competitive Intelligence + Outreach
**Topic:** Discovered Moda.app, strategic read, investor/founder outreach

**Moda.app Discovery:**
Anvisha Pai, MIT founder, raised $7.5M from General Catalyst (Quentin Clark)
and Pear VC (Warren Shaeffer). Launched "world's first design agent with taste" —
editable canvas with brand-aligned AI design execution. 3,000+ users last month.

**Strategic Read:**
Moda is a design productivity tool. B2B, horizontal, marketing teams.
Their "taste" = visual brand consistency in execution.
FDV taste = longitudinal personal preference intelligence across travel,
commerce, and experience over time.
Not competitive. Adjacent.

Key framing locked: **Moda is a product. Wellspring is infrastructure.**
Canva/Adobe can eventually ship what Moda does. They cannot ship a taste genome
built on behavioral data and a self-model. That's the moat distinction.

**Why GC/Pear Funded Moda:**
- Editable canvas is genuine technical wedge vs current AI tools
- Anvisha's track record ($300M exit) de-risks the bet
- Window is real but probably short — Canva/Adobe will catch up
- Makes GC/Pear fluent in taste-AI conversation — could be an opening
  in 60-90 days, not now

**Outreach Executed:**
1. Connection requests sent to Warren Shaeffer (Pear) and Quentin Clark (GC)
2. Direct message sent to Anvisha Pai
   Subject: "The taste thesis — from the luxury side"
   Tone: peer-to-peer, no ask, non-competing positioning clear,
   FIL DE VIE and FDV Concierge named

**Next on This Thread:**
- Let Anvisha outreach breathe, no follow up
- Revisit GC/Pear in 60-90 days when Moda story has developed
- Watch for warm path into either firm through network

---

### March 30, 2026 | Claude Code (web) — Evening Session
**Topic:** Floating Concierge, Voice Docs, Animation Polish, Guide/Itinerary Separation

**Floating Concierge — "The Concierge, Everywhere" (PR #22):**
Built complete floating concierge widget. Gold chat icon bottom-right on every page
(z-index 85, above bottom nav). Slide-up 75vh panel with context-aware greetings
per route. Tiered message limits: 3 anonymous → 15 free → unlimited Gold. Gate
messages spoken as chat bubbles by the concierge, not system modals. Anonymous gate
triggers Passport Gate signup. Free gate shows subtle Gold upgrade card inline.
Conversation logging to new concierge_conversations table (both user + assistant).
Hidden on /concierge-chat and "/" (landing page).

**Voice Doc Infrastructure (PR #22):**
Created /data/concierge/ folder with 5 destination knowledge files. loadVoiceDocs()
reads all .md files at runtime, skips placeholders, joins into system prompt with
source notes (personal authority vs editorial research). loadProductCatalog() prefers
DB products table, falls back to genome JSON. Sharon pushed real voice doc content
from her Mac via git — Morocco + NYC (personal voice), Hydra + Mallorca + Amangiri
(editorial research). All 5 now live in system prompt.

**Guide/Itinerary Separation:**
Slimmed ItineraryTeaser in morocco.tsx from rendering full Day 1-8 editorial content
inline to a compact preview card. Shows El Fenn hero image, Days 1-3 titles,
"+ 5 more days of curated Morocco", all unlock actions gate to /concierge.

**Curate Animation Polish:**
Tuned from ~15s to ~7s. Phase duration: 1100ms. Text fade: 0.5s. Image crossfade:
0.8s. Fixed flickery text at 800ms. Eliminated suitcase page flash by keeping
overlay at full opacity until navigation (root cause: overlay lived inside
suitcase.tsx, navigating unmounted it before capsule page mounted).

**Weather API:**
Added /api/weather?city={city} endpoint as OpenWeatherMap proxy. Needs
OPENWEATHER_API_KEY added to Vercel env vars (manual step).

**Riad Evenings Updates:**
Resolved PR #13 merge conflict (kept evening images over daylight). Added 5th
mood image: eat-1-large.jpg (El Fenn golden light).

**PRs Merged:** #22 (squash merge — floating concierge + voice docs + animation + guide separation)

**Key Files Modified:**
- client/src/components/floating-concierge.tsx (NEW)
- api/index.ts (concierge chat rewrite, voice docs, product catalog, conversation logging, weather)
- client/src/App.tsx (added FloatingConcierge)
- client/src/pages/guides/morocco.tsx (ItineraryTeaser rewrite)
- client/src/components/curating-animation.tsx (timing polish)
- client/src/pages/suitcase.tsx (flash fix)
- client/src/data/capsule-data.ts (evening images + 5th mood)
- data/concierge/*.md (5 voice docs with real content)

**Still Needed:**
- OPENWEATHER_API_KEY in Vercel env vars (Sharon doing tomorrow AM)
- Taste signal extraction from conversations (Phase 2)
- Resend domain verification (ongoing)

---

### March 31, 2026 | Claude.ai — Oren Zaslansky Feedback Session
**Topic:** Pilot feedback analysis, user journey brief, navigation redesign direction

**Oren Zaslansky** (Sharon's brother, Flock Freight founder, FDV strategic advisor)
tested the pilot. Key dynamic: his verbal feedback ("confused," "doesn't make sense")
contradicts his actual behavior — 40-minute session, 9 saves, 100% scroll depth on
The Current, used concierge chat, came back after a 16-minute break.

**His Core Feedback:**
- "Doesn't want to look at instructions — makes him feel stupid"
- "Want it to be a funnel that gets narrower, not bigger and repetitive"
- "Need more context and understanding right from the get go"
- "Think about beginning, middle, end of the user journey"
- Referenced Akinator as narrowing-curation example
- Wants clarity on ICP: demographics, psychographics

**Key Insight:** The product held him despite the friction. Features aren't missing —
features are invisible. The first 60 seconds is the problem, not the product itself.
Sharon was the concierge on the phone, pointing him where to click. The product needs
to do what Sharon did on that call.

**User Journey Brief Created:** FDV_USER_JOURNEY_BRIEF.md
- 5 phases: Arrival → Hook → Save Moment → Gate → Return
- New vs. returning user detection
- Welcome screen for first-time visitors
- Progress indicators throughout
- ICP definition included

**Brainstorm — Frictionless Entry Ideas:**
1. Motion not text — 10-second visual sequence showing the concept without words
2. Start with a single choice — two images, "where are you drawn?" = first taste signal
3. Scroll IS the signal — dwell time tracking, no saves needed to start learning
4. Concierge as narrator — quiet margin notes while you scroll, not a chatbot
5. Show the output first — a completed edit as the landing
6. Onboarding IS the content — tooltips woven into The Current

**Net-a-Porter Navigation Analysis:**
- Persistent visible nav (not hamburger) — user always knows what they can do
- FDV should NOT become Net-a-Porter (no inventory to fill categories)
- FDV SHOULD borrow navigation clarity
- Proposed persistent nav: CURRENT · GUIDES · STYLE · SUITCASE · SHOP

**Dashboard Status:** 5 users, 78 sessions, 2 chats, 0 curates.
Morocco guide completions: everyone who starts finishes (3→3→3→3 at 25/50/75/100%).
Links: 1 broken (Bottega Solstice 403), 1 warning (Phoebe Philo boot 503).

**Open Items:**
- OpenWeatherMap API key → Vercel env var
- Fix Bottega Solstice 403 and Phoebe Philo boot 503 links
- User journey redesign — scope TBD
- Lisa Ruffle outreach message
- Product genome enrichment (~10 items)
- "Taste in Motion" slide revision
- Gillian intro via April

---

### March 31, 2026 | Claude Code — FDV Daily Deploy + Auto-Deploy Fix
**Topic:** Deployed Mar 31 FDV Daily edition, fixed Vercel auto-deploy integration

Deployed March 31 edition (Rauschenberg at Guggenheim, Colbo, Le Dive) via manual
`vercel --prod` after discovering auto-deploy wasn't triggering on push. Diagnosed
root cause: Vercel-GitHub integration link was stale. CLI `vercel git disconnect/connect`
updated the record but didn't fix the trigger. Fixed via Vercel dashboard: Settings → Git
→ Disconnect → Reconnect to sharonlombardo/Fdv-daily-. Verified with empty commit —
new build triggered within seconds. Updated FDV Daily CLAUDE.md with new deploy pipeline
(no more manual `vercel --prod` needed) and fallback instructions.

Note: GitHub App permissions were NOT the issue ("All repositories" was already selected).
The fix was the Vercel-side dashboard reconnect.

---

### March 30, 2026 | Claude.ai — Full Day Session
**Topic:** Critical bug fixes, admin dashboard rebuild, link health, products table, Evening Edit

**Pilot Day 1 Results:** 3 users signed up (Maggie Meade, Christina Glickman, April).
April reported saves not working — led to critical bug discovery. April's feedback:
"You have taken a shopping/discovery experience to the next level. Bravo!!!"
April also offered intro to Gillian — creative director in Brooklyn building a
modern marketplace/concept shop, connected to The Board community.

**Critical Bug Fix — Saves Not Working (PR #9):**
6 critical issues found. Save endpoints were operating globally with no per-user
scoping — every query hit entire saves table. Fixed: all endpoints now use
authenticated user's email from auth cookie. Fixed passport gate race condition.
Fixed signup endpoint grabbing ALL anonymous saves instead of just the signing-up
user's. Saves now work correctly for all pilot users.

**Event Tracking Expansion (PR #9):**
Session IDs per-session in sessionStorage. Enhanced page view events (viewport,
referrer, time-on-page). Scroll depth tracking on 3 editorial pages (25/50/75/100%).
Concierge chat tracking (start, message count). Session start/end with duration.

**Admin Dashboard Rebuild (PR #9):**
6 tabs: Overview, Users, Content, Alerts, Links, Products. Overview has metric
cards + conversion funnel. Users tab shows saves + chronological journey timeline.
Content tab has editorial scroll depth + affiliate clicks. Alerts for zero-save
and inactive users. Links tab with broken link scanner. Products tab: full catalog
editable from admin panel.

**Link Health System (PR #10):**
New link_health table. Manual "Run Link Check" button scans all product URLs via
HEAD requests with rate limiting (500ms between, grouped by domain). Nightly cron
at 3 AM ET for automated checking. Admin Links tab: see broken, approve replacements,
paste manual URLs. Frontend hook (use-link-health.ts) ready to hide broken links.

**Products Table — Split Brain Fix (PR #11):**
New products database table seeded from brand genome JSON. Commerce data (URLs,
prices, shop_status) now lives in database, editable from admin Products tab.
Brand genome JSON remains source of truth for taste data (atelier codes, Wellspring
vocabulary). Shop status dropdown: Live / Coming Soon / Sold Out / Discontinued.

**Product URL Fixes:**
- Bottega Veneta Solstice Bag: Net-a-Porter → Bergdorf Goodman
- Demellier Santorini Basket: brand site → Saks Fifth Avenue
- Khaite Otto Slippers → Phoebe Philo Robe Slide (full swap: $595→$890, cream leather)
- Phoebe Philo Ankle Boot: null/coming_soon → Tilt Ankle Boot Oxblood, $1,650, live
- 2 additional broken links fixed via admin Links tab
- All fixes propagated: saves table, genome JSON, capsule data, editorial map, suitcase dedup

**Evening Edit Redesign (PRs #12-14):**
Art directed by Sharon. Title: "Your Capsule" → "Riad Evenings". Subtitle:
"Marrakech does drama. You might as well participate." Hero: woman in red at
El Fenn. 5 mood images, all evening-appropriate. Anchor look: FIL DE VIE
Isadora Dress ($795). Supporting: Alaïa Velvet Thong Mules, Chloé Wristlette,
Phoebe Philo Mini Hoops, Hildegaard Oil.

**Architecture Decision — Data Separation:**
Database (products table): URLs, prices, shop_status — editable from admin.
Genome JSON (repo): atelier codes, Wellspring taste data — stays in code.
When a URL breaks → fix in admin panel → done. No JSON commits needed.

**Key Numbers:** 4 users in system (3 pilot + Sharon test), 6 sessions recorded,
103 products in database, 5 broken URLs fixed, 4 PRs merged (#9-#14), 6 admin
dashboard tabs live.

---

### March 30, 2026 | Cowork — Morning Session
**Topic:** New Cowork project setup + full context transfer from maxed-out thread

Pilot launched to 10 women on March 29 (Sunday). Set up new FDV Concierge
Cowork project with dedicated workspace (separate from FDV Daily). Loaded
full project context from Desktop CLAUDE folder (memory files, chat transcripts,
glossary, competitive insights, people profiles), repo project files
(FDV_CONCIERGE_SUMMARY.md, CANONICAL_DATA_REFERENCE.md, design_guidelines.md),
and project knowledge PDFs.

Handoff from maxed-out Claude.ai thread — 5 open items carried forward:
1. Admin dashboard enrichment brief for Claude Code (page views per user,
   items saved, Curate for Me usage, affiliate clicks, drop-off points)
2. Product genome enrichment — pending_review Phoebe Philo items need atelier_codes
3. Lisa Ruffle outreach draft
4. Phase 1 SQL migrations brief
5. "Static Preference to Taste in Motion" slide revision

Admin dashboard currently shows: who signed up, save counts. Needs richer
pilot analytics before first check-in with testers.

Image upload was broken in previous thread — needs resolution in new session.

Context saved to Cowork auto-memory (6 memory files) and this session log
for cross-environment alignment.

---

### March 26, 2026 | Claude Code (web) — Evening Session
**Topic:** Full pilot launch build — all 9 items implemented and deployed

Built and deployed the complete pilot launch feature set from the 10-item
brief. Implemented in order: auth system (Item 1), admin dashboard (Item 2),
share prompts (Item 3), concierge redesign (Item 5), welcome email (Item 6),
concierge chat with Claude API (Item 7), post-save nudge (Item 8), curate
rotations (Item 9). Item 4 (itinerary opener) was already built.

Key technical decisions: stateless HMAC-signed tokens instead of sessions
(Vercel serverless can't use session stores), direct fetch to Resend/Anthropic
APIs instead of SDKs (npm install blocked in cloud env), email as user
association key for saves (simpler than userId).

Bug fixes during testing: curate rotation always showing Evening Marrakech
(getNextUnsavedCapsule called 3x per render — split into peek/consume),
concierge chat page unreachable (added nav links), hamburger menu label
("YOUR MOROCCO" → "YOUR TRIPS").

Deployment issue: Vercel-GitHub integration had disconnected — no deploys
for 7 days. Reconnected via Settings → Git → GitHub → Install. Had to
redeploy without build cache to pick up latest code.

Set up Resend account for email. Registered fdvconcierge.com domain on
GoDaddy for future email sending (DNS verification still pending).

Added 4 environment variables to Vercel: SESSION_SECRET, ADMIN_KEY,
RESEND_API_KEY, ANTHROPIC_API_KEY.

Admin dashboard confirmed working: shows 1 user (Sharon), 191 saves,
page view stats. Ready for pilot users.

---

### March 26, 2026 | Claude.ai + Claude Code
**Topic:** Pilot launch list — full build brief for first 10 women

Completed full audit of current build state via CLAUDE.md + source files. Confirmed Tier 1 items 1-3 already shipped. Built complete pilot launch brief for Claude Code covering: auth + per-user saves (foundation), admin dashboard for pilot visibility, end-of-article share prompt, itinerary opener copy, concierge section redesign, email setup (info@fildevieconcierge.com), Claude API hookup for concierge chat, post-save nudge, daily Curate for Me rotations. Evening Edit flagged for Sharon to art direct separately. Brief handed to Claude Code in sequence order.

Also completed: AmiGo competitive deep dive (~40 screenshots), feature priority list, shared brain infrastructure (CLAUDE.md + CLAUDE-PRIVATE.md), fdv-context and fdv-session skills, source files uploaded to project knowledge.

Produced: Complete pilot launch brief (9 items, sequenced)
Next: Claude Code builds in order starting with auth. Check back on auth progress before moving to dependent items (post-save nudge, curate rotations).

---

### March 26, 2026 | Claude Code (web)
**Topic:** Build history sync — bringing Claude.ai up to speed

Added comprehensive build log of all 52 commits to CLAUDE.md so Claude.ai
has full context of what's been built. Created fdv-context skill for
session-start briefings. Cloned repo to Sharon's Mac for Cowork access.

---

### March 26, 2026 | Cowork
**Topic:** Shared brain setup + fdv-session skill

Established CLAUDE.md read protocol for Cowork sessions — confirmed repo path at `~/Projects/fdv-concierge/CLAUDE.md`, read full project brain via Desktop Commander. Created `fdv-session` skill with full round-trip lifecycle: Session Start (reads CLAUDE.md, parses key sections, delivers concise briefing) and Session Close (formats session log entry, appends to CLAUDE.md via Desktop Commander, offers to update build state/priority sections). Also updated auto-memory with correct repo path, session start feedback protocol, and Cowork skills filesystem reference. Discovered Desktop Commander's `read_file` returns empty for .md files — skill documents the `start_process` + `cat` workaround.

---

### March 25, 2026 | Claude Code (web)
**Topic:** CLAUDE.md commit + public/private split

Committed original CLAUDE.md to repo. Then split into two files:
- CLAUDE.md (public, in repo) — architecture, build state, features, principles
- CLAUDE-PRIVATE.md (for Claude.ai Project Knowledge only) — competitive
  landscape, fundraising, investor contacts, financial model, strategic outreach

---

### March 25, 2026 | Claude.ai
**Topic:** AmiGo competitive deep dive + feature prioritization

Full walkthrough of AmiGo app (amigo.app) via ~40 screenshots.
Analyzed: feed, explore/map, wishlist, itineraries, place cards,
editorial articles, tastemaker profiles, Premium paywall, invite
mechanic, local experts program.

Key findings:
- AmiGo: 73K users, bootstrapped, no commerce, $129/yr subscription
- Founder: Alexia Tamer, Columbia MBA, solo founder, ~14 person team
- No VC funding confirmed
- Estimated ARR: $200K-750K ceiling
- Their gap: drives intent, captures zero booking/wardrobe revenue
- FDV's moat: wardrobe + transaction layer they can never retrofit

Produced: Full pilot feature priority list (see Section 5)
Produced: Detailed AmiGo analysis recap for Cowork handoff
Produced: This CLAUDE.md file

Also discussed: CLAUDE.md as shared brain system across all three
Claude environments. GitHub as the shared layer. Daily sync workflow.

---
*[Future entries appended above this line by Claude Code after each session]*
