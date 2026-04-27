# NORTH STAR — FDV Concierge Priorities

**Living priorities document. Updated as work ships and direction shifts.**
**Last updated:** April 27, 2026 (EOD — phone bezel previews, real diary photos, concierge moments, Save for Later fix)

> **Companion docs:**
> - `FDV_USER_JOURNEY_NORTH_STAR_V2.md` — site architecture, nav, business model
> - `FDV_NORTH_STAR_V3_ADDITION.md` — four-product architecture, pricing tiers, demo experience
>
> This doc is the **active priorities tracker**: what's shipped, what's next, what's on the horizon. V2 and V3 define the strategic frame; this doc tracks execution against it.

---

## Positioning

**"A travel magazine you can shop" — with a concierge.**

The moat is taste, not technology. Editorial judgment applied to a specific place and a specific person.

---

## Recently Shipped (April 2026)

**Shipped April 27:**
- **Phone bezel preview in tier modals** — sample itinerary/diary content renders inside an iPhone-style frame (dynamic island, FDV CONCIERGE header, bottom nav). Fixed iPhone-proportioned height with scrollable interior. Per-tier captions. Sample previews now feel like peeking at the actual product on a phone.
- **Real Morocco diary photos in The Passage** — placeholder images replaced with El Fenn rooftop, Café Bacha, Badi Palace courtyard, and Essaouira from the Morocco guide.
- **Concierge "Have questions?" moment in all tier modals** — pulsing gold orb with prompt, positioned between phone preview and "What happens next?" — the natural moment a buyer is weighing the purchase. Compass, Passage, and Trunk all updated.
- **Save for Later button fix** — was silently failing on API errors. Now properly handles saves and routes anonymous users through the Passport gate.
- **NORTH-STAR.md created** as living priorities tracker.
- **Competitive landscape research documented** — 28+ screenshots across Stippl, Daydream, Alta, Vêtir, Sourced By, Glance, Layla AI, Navan Edge, Jacada Travel mapped into four quadrants. White space confirmed: nobody combines editorial taste + destination curation + wardrobe sourcing + booking coordination + human concierge.

**Earlier in April:**
- **Three product tiers live with full modal flows:**
  - The Compass ($250)
  - The Passage ($750)
  - The Trunk ($1,500–$2,500+)
  - Each tier has its own copy, features, and hero image
- **Tier drill-down navigation** — tappable first bullet in Passage/Trunk modals opens the lower-tier modal as an overlay, so the upgrade path is browsable in one place
- **Universal tier header images** — same hero treatment across destinations rather than per-destination
- **Landing page positioning** — "Travel. A State of Mind." with new tagline copy
- **About page** — tier descriptions updated to reflect Compass / Passage / Trunk by name
- **Typography pass** — Lora italic → Inter sans-serif for tier descriptions (readability)
- **Trunk editorial cards** — real product images replacing placeholders
- **FDV Daily** — running daily editions through April (newsletter / daily guide companion product)
- **Travel diary / keepsake feature** — included in The Passage tier
- **Living concierge** — floating button on every page, voice-aware, context-aware greetings

---

## Up Next (Build Now)

### Welcome email + printable itinerary format
Post-purchase experience. A beautifully designed confirmation that feels like receiving a letter, not a Stripe receipt. Must be printable. **Table stakes for a concierge service** — currently the gap between "purchase" and "your Compass is ready" has no editorial moment.

### Emma Rayder / Vogue outreach
Emma wrote the March 25 *"Tech to Pack for Your Next Trip"* piece covering Alta, Vêtir, Daydream, Sourced By. FDV wasn't included but fits the frame perfectly. **Time-sensitive** — the piece is fresh, the angle is hot, and the door is open while the conversation is still active.

### Remaining Hydra/Morocco modal content additions
Tier modals still have gaps in destination-specific content. Round out the sample itinerary and diary moments inside the phone bezel previews so each modal feels complete for both live destinations.

---

## Coming Soon

### Favorites / "Add to Suitcase" mechanic
Heart items across guides, collect them in a suitcase view. Two reasons it matters:
- **Stickiness** — gives a returning user a reason to come back
- **Taste data** — generates the signal we need *without* requiring a style quiz

Layers onto the existing product cards.

### Style profile (passive build)
Don't make it a form. Let it build from saves and browsing behavior, then surface as *"here's what we've learned about you."* Requires the suitcase mechanic first.

---

## On the Horizon

### EIP-style personalization
Net-a-Porter EIP concept — homepage reshuffles based on who's visiting. A personalized edit each time. Needs favorites data and the style profile foundation in place first.

### Geolocation awareness
Know where the user is browsing from and adjust the experience accordingly. Browsing from JFK is a different moment than browsing from the couch on a Tuesday night.

---

## Competitive Landscape (April 2026 Research)

Four quadrants of relevant players:

**Mass-market trip planning**
- Stippl (4.6 stars, 500K users, $2–4/mo)
- Layla AI ($4–10/mo)
- Mindtrip
- Wonderplan

**AI fashion discovery**
- Daydream — natural language shopping, 10K+ stores, 10% travel search spike
- Alta — photorealistic AI doubles, 45K trips
- Glance

**High-touch fashion services**
- Vêtir — Kate Davidson Hudson, white-glove closet digitization
- Sourced By — Gab Waller, fashion sourcing detective

**Luxury travel planning**
- Jacada ($13K+ pp)
- Navan Edge (corporate)

### FDV's white space
**Nobody combines editorial taste + destination curation + wardrobe sourcing + booking coordination + human concierge.** Closest philosophically is Vêtir, but they're closet-first, not destination-first.

---

## Not Our Lane (Parked)

Things we are deliberately not building. Re-evaluate only if positioning shifts.

- **Capsule wardrobe AI / rewear logic / weather-API packing optimization** — that's Alta / Glance territory
- **Map-in-one-view itinerary** — that's Stippl / Layla territory
- **Budget tracking / expense splitting**
- **Group travel coordination**

---

## How to Use This Doc

- **Shipped → Up Next → Coming Soon → On the Horizon** is the priority order. Top of the doc is the most recent reality; deeper sections are progressively more speculative.
- When something ships from "Up Next," promote it to "Recently Shipped" with a short note on what landed.
- When something in "Up Next" gets bumped, move it down (or to "Parked") with a one-line reason. Don't silently drop items.
- Cross-check against `FDV_USER_JOURNEY_NORTH_STAR_V2.md` (architecture) and `FDV_NORTH_STAR_V3_ADDITION.md` (four-product model + pricing) before adding new priorities — those define the strategic frame this list executes against.
