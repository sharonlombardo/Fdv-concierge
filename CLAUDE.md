# CLAUDE.md — FDV Concierge Project Brain
**Shared context file for Claude.ai, Claude Code, and Cowork**
**Last updated:** March 25, 2026
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

## SECTION 2 — CURRENT BUILD STATE (March 2026)

**Platform:** React/TypeScript, Vite, Tailwind, shadcn/ui
**Database:** Neon Postgres + Drizzle ORM
**Hosting:** Vercel
**Images:** Vercel Blob storage
**Auth:** Session-based
**Repo:** github.com/sharonlombardo/Fdv-concierge

**What is LIVE:**
- The Current (editorial magazine feed)
- Destinations — Morocco deep build (full itinerary + packing list)
- Shop — clothing, accessories, beauty (103 products in brand genome)
- Morocco Edit content fully seeded in production database
- Images migrated to Vercel Blob storage

**What is IN PROGRESS:**
- IA v2 architecture migration (locked March 1, 2026)
- Morocco moving from /concierge route → /destinations/morocco
- Concierge becoming its own route for AI chat (V2)

**What is COMING SOON (Notify Me capture):**
- Experiences, Culture, Objects of Desire, Daily Rituals, State of Mind

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

**TIER 1 — Must ship before pilot launches:**
1. Mid-content paywall on Morocco editorial (at emotional peak, not
   front door). Copy direction: "Some things are kept just for
   Passport holders."
2. "Added to Suitcase" toast notification — green confirmation on save.
   Instant feedback loop.
3. Suitcase as visual gallery grid — Pinterest muscle memory.
   Destination tiles with cover photo. One save = already looks like
   something.
4. End-of-article share prompt — one italic sentence at emotional peak.
   No button. "Love this? Hit share above — your friends will thank you."

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
