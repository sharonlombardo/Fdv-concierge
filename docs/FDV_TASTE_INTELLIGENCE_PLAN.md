# FDV CONCIERGE — TASTE INTELLIGENCE PLAN

## April 15, 2026
## Status: PHASE A SHIPPED — Phases B+C planned for after trip brief form and about page

---

## THE INSIGHT

Every concierge conversation contains signals worth more than the conversation itself. When a user says "based on my choices, where should I go?" and the concierge asks "the silence or the scene?" — the answer is a permanent data point. That's not a chat message. That's identity.

Right now the concierge has no memory between sessions. User opens chat, talks, closes, comes back — it's a stranger. The saves persist. The conversations don't inform anything.

The fix is three phases, each building on the last.

---

## PHASE A — CONVERSATION MEMORY ✅ SHIPPED (April 15, 2026)

Load the user's last 20 concierge messages from `concierge_conversations` into the system prompt as context. Claude literally remembers the conversation.

This means: "Last time you asked where to go and I suggested Hydra for the quiet, Morocco for the energy. You seemed drawn to the in-between — what's changed?"

Implementation: database query on concierge open → inject into system prompt alongside existing context (current page, saves, auth state).

---

## PHASE B — EXTRACTED TASTE PROFILE (medium effort, ship same week)

After each concierge conversation, run a lightweight Claude extraction that pulls structured taste signals and stores them on the user record.

Add `taste_profile` JSONB column to users table (or a dedicated `user_taste_profiles` table).

Schema:
```json
{
  "destinations_interested": ["Morocco", "Hydra"],
  "destinations_rejected": [],
  "vibe_preference": "in-between — not pure silence, not pure scene",
  "stated_preferences": ["likes energy but not chaos", "drawn to warmth"],
  "negative_preferences": ["not bold colors", "not crowded resorts"],
  "products_asked_about": ["Marrakech Pants"],
  "products_saved_via_concierge": ["Marrakech Pants", "Stevie Caftan"],
  "price_signals": ["comfortable at $500-800 range"],
  "occasion_signals": ["anniversary trip mentioned"],
  "travel_party": "couple",
  "travel_dates": "October 2026",
  "containment_signal": "moderate — wants some structure but not rigid",
  "social_density_signal": "moderate — wants options but not crowds",
  "last_updated": "2026-04-15"
}
```

Extraction prompt (runs after each conversation ends or after N messages):
- Feed Claude the conversation
- Ask it to extract structured taste signals
- Merge new signals into existing profile (additive, not replacement)
- Flag conflicting signals for review

This profile loads into the concierge system prompt alongside conversation history. Now it doesn't just remember what was said — it knows what it means.

---

## PHASE C — WELLSPRING SELF-MODEL CONNECTION (the full vision)

The taste profile from Phase B is a stepping stone to the full Wellspring self-model. The self-model schema, taste axes (containment, structure, entropy, social_density), user_vector_state table, and self-model worker are already designed and documented in project knowledge.

Phase C connects conversational signals to the same pipeline as save signals, browse signals, and purchase signals. All input types feed the same identity model.

Mapping examples:
- "the silence or the scene?" → "in-between" = social_density: 0.4-0.5
- "I don't like bold colors" = containment: high (0.7+)
- "somewhere quiet" = social_density: low (0.2-0.3)
- "It's our anniversary" = occasion signal, formality bias moderate
- "Something like the Alaïa but less" = price anchor + aesthetic reference

The self-model worker processes these alongside behavioral signals and updates the vector state. The composition engine then uses the vector state to build edits, trip plans, and recommendations.

---

## WHY THIS ORDER

Phase A gives immediate value — the concierge remembers. Users feel recognized.
Phase B creates the structured data that makes recommendations actually better over time.
Phase C is the moat — the full Wellspring taste architecture that no competitor can replicate.

Each phase works independently. You don't need C for B to be useful. You don't need B for A to matter.

---

## REFERENCE DOCS

- FDV_SELF_MODEL_JSON_CONTRACT_V1.json — the self-model schema
- FDV_USER_EVENTS_CONTRACT_V1.json — event types that feed the model
- FDV_SELF_MODEL_WORKER_SPEC_V1.py — the worker that processes signals
- FDV_TASTE_AXES_DEFINITIONS_V1.pdf — the axis definitions
- FDV_CONCIERGE_EVERYWHERE_BRIEF.md — Part 5 (taste signal extraction from conversations)
