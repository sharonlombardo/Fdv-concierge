# FDV CONCIERGE — SESSION SUMMARY: APRIL 13, 2026

## WHAT WE DID TODAY

### Morning: Pattern Lock + Brief Writing
- Reviewed Zara Travel Mode Ibiza guide screenshots (5 images) — established the pattern: multi-image collages per place on desktop → horizontal scroll on mobile, section headers for wayfinding, atmospheric full-width breaks between places
- Reviewed current FDV Morocco guide (14-page PDF) — confirmed the build was much further along than the handoff notes suggested. All section headers (THE EXPERIENCE, EAT & DRINK, SHOP LOCAL, THE STAY, THE WARDROBE), place copy, image selections already strong
- Reviewed current FDV Morocco editorial from The Current (6-page PDF) — mapped all fashion/atmosphere images that needed to merge into the guide
- Locked the pattern: ONE unified page combining guide + editorial. Place blocks stay informational. Fashion editorial images scatter between places as magazine-style breaks. Shoppable breaks get the + indicator and open EditorialProductOverlay. Atmosphere breaks just breathe with a pin.
- Wrote the master Claude Code brief: `FDV_MOROCCO_GUIDE_EDITORIAL_MERGE_BRIEF.md`

### Afternoon: Three Phases Shipped
**Phase 1 — BOOK links** (commit `c60d8ba`)
- Replaced all 13 globe icons with visible `BOOK ↗` text links in FDV gold (#c9a84c)

**Phase 2 — Editorial breaks** (commit `656f20c` + later polish commits)
- 10 editorial break images placed between place blocks across all sections
- 6 shoppable (Gaia Dress, Alaïa Souk Coat, FDV Long Caftan Red, FDV Este Dress, YSL Bikini, FDV Column Dress)
- 4 atmosphere (orange blossoms, El Fenn rooftop dinner, El Fenn ruby interior, El Fenn rooftop garden night)
- All genome keys verified against `fdv_brand_genome.json`
- EDITORIAL_PRODUCT_MAP entries wired
- 10 Inter italic editorial captions added
- Thin block dividers between sections for magazine rhythm
- New Amanjena hero image

**Phase 3 — Mobile horizontal scroll** (commit `06d5943`)
- Place images on mobile (≤640px) scroll horizontally with scroll-snap
- 85% slide width with bleed/peek showing next image edge
- Applies across all section layouts

**Fixes shipped:**
- Product modal close now preserves scroll position (was resetting to top)
- Divider rendering fixed (overflow:hidden was clipping pseudo-elements)

### Evening: Wardrobe Product Expansion
- Cataloged complete SHOP THE STORY carousel from The Current — ~40 products across 15+ screenshots
- Sorted all products into three wardrobe moments:
  - **Day in the Medina** — expanded from 6 → 23 products (blouses, caftans, day dresses, day sandals, basket bag)
  - **Riad Evenings** — expanded from 6 → 25 products (evening dresses, caftans, evening bags, jewelry including Bulgari pieces)
  - **What Travels Well** (NEW third wardrobe moment) — 19 products (sunglasses, wraps, jewelry, stationery, pool essentials, all beauty)
- "What Travels Well" uses the Column Dress editorial break image as its hero, moved from its standalone position
- Copy written: "The pieces between the outfits." / "Sunscreen you'll actually reapply..."
- Key architecture decision: products go INSIDE the existing carousels, not as a separate strip below. One long swipeable carousel per section mixing editorial images + product tiles
- Product tiles sized at 80vw to match editorial slides
- 12 items curated out for missing studio shots or wrong-story assignment
- All product cards reuse existing components — same sizing, proportions, pin mapping
- Beauty/stationery/pool items route to "Objects of Desire" bucket in suitcase

### Final commit history (all on main):
- `c60d8ba` — BOOK links
- `06d5943` — Mobile horizontal scroll
- `656f20c` — 10 editorial breaks
- `562515b` — Captions + dividers (first pass)
- `d9e1d0f` — Divider fix
- `474a9ec` — Divider polish
- `d97f001` — CLAUDE.md update
- `f03ecc1` — Wardrobe expansion (DAY 23, EVE 25, TRAVEL 19)
- `e07d0dc` — Product strips (intermediate — later merged into carousels)
- `8021bb6` — Final: products merged into carousels, tiles sized, 12 items curated out

---

## WHAT'S NEXT — TOMORROW

### 1. Merchandise Editorial Break Modals (Zara multi-product pattern)
Right now each shoppable editorial break maps to ONE product. The Zara pattern shows ALL products visible in that image. Example: the Este Dress break should show the dress AND the fringe bag. The Gaia Dress break should show the dress AND sunglasses AND sandals visible in the shot.
- Go through each of the 6 shoppable editorial breaks
- Map which additional products are visible/implied in each image
- Update EDITORIAL_PRODUCT_MAP entries to include arrays of products per break

### 2. Multi-Image Product Modals
When you tap a specific product (e.g., Este Dress), the modal currently shows one studio shot. Add the editorial image of that product in Morocco as a second image. So the modal shows studio shot + context shot. Swipeable. This is the Zara detail-view pattern.

### 3. Product Sorting Audit
- Verify all products are in the correct section (Day vs Evening vs Travel)
- Check that the Bulgari necklace ($50K) and Loewe sunglasses aren't accidentally in Day in the Medina — they should be in Evening and Travel respectively
- Confirm beauty items all route to Objects of Desire

### 4. "Shop the Full Edit" Morocco Filter
Currently links to the full shop (all destinations). Should filter to Morocco products only. Was deferred from today's brief — needs shop page refactor to support `?destination=morocco` query param.

### 5. Desktop Layout Polish
Mobile is working. Desktop layout for the wardrobe carousels may need attention — was deferred from today.

---

## BIGGER PICTURE — ON THE HORIZON

### Product & Build
- Other destinations need the same treatment: Hydra, Mallorca, Amangiri, New York
- Concierge "Akinator" onboarding flow
- Membership gates testing with pilot users

### Business
- **Financial model:** subscription revenue (Gold/Black tiers) still absent from pro forma — model is understated. Historic AOV and email open rate (needs Klaviyo pull) are two remaining gaps.
- **VC deck:** "Static Preference to Taste in Motion" slide needs FDV's actual product answer for Hydra (specific linen dress, straw tote, fragrance)
- **Investor outreach:** Quentin Clark (General Catalyst), Warren Shaeffer (Pear VC), Anvisha Pai (Moda.app) — connection requests sent
- **Partnership outreach:** Lisa Ruffle (DOTSHOP), Gillian intro via April, Melissa (Exclusive Resorts)
- **Chad Nelson (OpenAI):** enterprise team connection offered — needs follow-up

---

## KEY FILES
- Master brief: `FDV_MOROCCO_GUIDE_EDITORIAL_MERGE_BRIEF.md` (in project knowledge)
- Phase 2 spec: `FDV_PHASE2_EDITORIAL_BREAKS_SPEC.md` (in project knowledge)
- Wardrobe expansion brief: `FDV_EXPAND_WARDROBE_PRODUCTS_BRIEF.md` (in project knowledge)
- Brand genome: `fdv_brand_genome.json`
- Morocco guide component: `morocco.tsx` (was `home.tsx`, may have been renamed)
- Brand genome helper: `brand-genome.ts`

---

## CONTEXT FOR NEXT CLAUDE INSTANCE
Load the FDV shared brain from GitHub. We're continuing from the April 13 session. The Morocco guide editorial merge is ~90% complete. Tomorrow's focus is merchandising the editorial break modals (multi-product per image, Zara pattern) and verifying product sorting across the three wardrobe carousels.
