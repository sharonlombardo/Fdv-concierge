# CLAUDE.md — FDV Concierge Project Brain
**Shared context file for Claude.ai, Claude Code, and Cowork**
**Last updated:** March 26, 2026
**Updated by:** Claude.ai session with Sharon Lombardo

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
**Auth:** Session-based + email capture
**Server:** Express.js, 20+ REST API endpoints
**Repo:** github.com/sharonlombardo/Fdv-concierge (52 commits)

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
- `/concierge-info` — Premium tier info page with feature list + CTA
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

**User Features:**
- Travel diary with photo uploads, notes, shareable story images
- Selfie system with background removal (ImgLy)
- Journal entries synced local + server
- Packing list with checkoff functionality

### What is IN PROGRESS:
- Morocco route migration: /concierge → /destinations/morocco
- Concierge becoming its own route for AI chat (V2)

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
4. ❌ NOT BUILT — End-of-article share prompt. No italic share sentence
   at emotional peak. Morocco guide ends with "Some places don't need to
   be explained. They need to be felt." — share prompt could follow this.

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

## SECTION 8 — OPEN ITEMS (not blocking pilot)

- Trip purchase pricing/margins — flat fee structure, numbers TBD
- Refund/cancellation policy for subscriptions and trip purchases
- Curate My Edit algorithm deep build — Phase 2, ontology-driven (core IP)
- Klaviyo access for email open rate (needed for financial model)
- Remaining 4 Morocco stories for The Current Issue 1
- Morocco route migration: /concierge → /destinations/morocco

---

## SECTION 9 — BUILD HISTORY (March 2026)
*52 commits across Claude Code desktop + web sessions. Grouped by feature.*

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
