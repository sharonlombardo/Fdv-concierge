# FDV Concierge — The Concierge, Everywhere
## Tiered Access + Floating Presence + Memory + Knowledge
**Created:** March 30, 2026
**Context:** The site is called FDV Concierge. The concierge should be the heartbeat of the platform — present on every page, warm from the first message, deeper the more you invest. Currently it lives on a single page (/concierge-chat) and has no memory, no tiered access, and limited knowledge.

---

## PART 1 — FLOATING CONCIERGE (EVERYWHERE)

### Replace the page-based chat with a floating presence

**Current state:** Concierge lives at `/concierge-chat` — a dedicated page you have to navigate to.

**New state:** A floating chat icon on EVERY page. Tapping it opens a slide-up panel (mobile) or slide-in drawer (desktop). The concierge is always one tap away, no matter where you are in the product.

### Design:
- **Icon:** Small, elegant — the FDV compass logo or a minimal chat icon. Gold on cream. Bottom-right corner, just above the bottom nav.
- **Resting state:** Just the icon. Not intrusive. No bouncing, no badge count, no "Chat with us!" tooltip. It's there when you need it.
- **Open state:** Slide-up panel covering ~75% of the screen (mobile). The current page is still visible behind it. Header shows "YOUR CONCIERGE" in Lora serif.
- **Close:** Swipe down or tap X. Conversation persists within the session — if you close and reopen, you pick up where you left off.

### Context awareness:
When the concierge opens, it knows WHERE you are. This changes the greeting:

- On the Morocco guide: *"Exploring Morocco? I've been. Ask me anything."*
- On a capsule page: *"Seeing something you like? I can help you put the look together."*
- On the suitcase: *"Nice saves. Want me to find the thread?"*
- On the home page: *"Welcome to FDV. I'm your concierge — think of me as a well-traveled friend with good taste."*
- Return visit: *"Welcome back."* (simple, no fuss)

Pass the current route/page path to the system prompt as context so the concierge can reference where the user is.

### Keep the dedicated page too:
`/concierge-chat` still works as a full-screen experience. Some people will prefer it. The floating widget and the full page share the same conversation state within a session.

---

## PART 2 — TIERED ACCESS

### Anonymous (no account) — 3 messages

The concierge responds warmly for the first 3 messages. On the 4th attempt:

**Concierge says (not a system modal — the concierge itself speaks):**
*"I'd love to keep going — I can tell you have good taste. Create your Digital Passport and I'm all yours. It takes 10 seconds."*

**Then:** Show the "Create Your Digital Passport" auth modal (same one used for saves). After signup, conversation continues seamlessly — no reset, no lost context.

**Implementation:**
- Track message count in sessionStorage for anonymous users
- After 3 user messages, block the input and show the concierge's gate message as a chat bubble (not a system popup)
- After auth completes, increment the limit to the free tier

### Digital Passport (free account) — 15 messages per session

Signed-in users get a real conversation. Enough to get help, ask questions, explore. The concierge is helpful and knowledgeable but doesn't personalize based on saves.

After 15 messages:

**Concierge says:**
*"I've enjoyed this. If you want me to really learn your taste — what you save, what catches your eye, what you'd never wear — that's your Gold Passport. I get a lot better when I know you."*

**Then:** Show a subtle inline upgrade card (not a modal — stays in the chat flow). "Upgrade to Gold — $29/mo" with a one-line value prop.

**Implementation:**
- Track message count per session (sessionStorage)
- Reset on new session
- Gate message is a chat bubble from the concierge, not a system error

### Gold Passport ($29/mo) — Unlimited + Memory + Personalization

The concierge knows the user. It has access to:
- Their saves (what they've saved, from where, when)
- Their browse history (from event tracking)
- Their previous concierge conversations (from logging)
- Their taste signals (once Wellspring self-model is live)

**What changes in the conversation:**
- References their specific saves: *"You saved the Stevie Caftan — it would be perfect with those Alaïa mules you were looking at."*
- Cross-references taste: *"You're drawn to black and structured pieces but with one soft element. Here's what I'd pack."*
- Remembers across sessions: *"Last time you asked about restaurants near the riad. Did you end up going to Nomad?"*
- Can generate personalized edits: *"Based on your saves, here's an evening edit I put together for you."*

**Implementation:**
- Load user's recent saves and top aesthetic tags into the system prompt
- Load last 2-3 concierge conversation summaries into context
- No message limit
- Pass subscription tier to system prompt so concierge adjusts depth

### Black Passport ($59/mo) — Agent mode

Everything in Gold, plus the concierge can take action:
- *"Can you swap the Day 4 restaurant for somewhere with outdoor seating?"* → modifies itinerary
- *"Find me a white linen dress under $600"* → searches genome, suggests options
- *"Book me a table at Nomad for Thursday"* → (future: booking integration)

**For pilot:** Don't build agent mode yet. Just have the concierge acknowledge the request and say *"I've noted that — your concierge team will follow up."* This creates the expectation without requiring the infrastructure.

---

## PART 3 — CONVERSATION LOGGING

### New table: `concierge_conversations`

```sql
CREATE TABLE IF NOT EXISTS concierge_conversations (
  id SERIAL PRIMARY KEY,
  user_email TEXT,                    -- null for anonymous
  session_id TEXT NOT NULL,           -- from event tracking session
  role TEXT NOT NULL,                 -- 'user' or 'assistant'
  content TEXT NOT NULL,              -- the message text
  page_context TEXT,                  -- which page they were on
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_convo_user ON concierge_conversations (user_email);
CREATE INDEX idx_convo_session ON concierge_conversations (session_id);
```

### Log every message — both sides
When the user sends a message, log it. When the concierge responds, log it. Include the page_context so we know where the conversation started.

### Admin dashboard: add to Users tab
When viewing a user's journey, show their concierge conversations inline — interleaved with page views and saves. This gives Sharon the full picture: she browsed Morocco → asked the concierge about restaurants → saved a dress → asked what shoes to wear with it.

---

## PART 4 — KNOWLEDGE EXPANSION

### Current system prompt knowledge:
- Morocco itinerary (8 days, logistics)
- Platform navigation help
- FDV voice (basic)

### Add to system prompt context:

**1. Brand genome product data:**
Load a condensed version of the product catalog into the system prompt. The concierge should be able to recommend specific products by name, brand, price, and description.

Format for system prompt:
```
PRODUCT CATALOG (reference when making style recommendations):
- FIL DE VIE Isadora Dress ($795) — Hand crocheted in Bolivia, black, evening
- FIL DE VIE Stevie Caftan ($825) — Silk georgette, embroidered birds, evening
- Alaïa Velvet Thong Mules ($1,450) — Black velvet, stiletto heel, evening
[... all 103 products, one line each]
```

**2. Expanded Morocco knowledge:**
Sharon to provide a personal knowledge doc — restaurants she knows beyond the itinerary, timing tips, things to avoid, insider perspective. Load this as additional context.

**3. Page context:**
Pass the current page URL to the system prompt on each message. The concierge should know if the user is looking at the capsule, the itinerary, the suitcase, etc.

```
CURRENT CONTEXT: The user is currently on /capsule/desert-neutrals viewing the Desert Neutrals capsule.
USER SAVES: [list of recent saves if authenticated]
SUBSCRIPTION: [free | gold | black]
```

**4. FDV Voice guidelines (add to system prompt):**
```
VOICE: You are the FDV Concierge. You speak like a well-traveled friend 
with exceptional taste — warm, direct, occasionally surprising. You have 
opinions. You would never recommend the tourist restaurant. You know why 
THAT riad and not the other one. You don't hedge. You don't say "it depends." 
You say "here's what I'd do."

You dress the way you travel — with intention. When someone asks what to 
wear, you don't list options. You make a call. "The Isadora Dress. The Alaïa 
mules. Gold earrings, not silver. Trust me."

You're not a search engine. You're not a customer service bot. You're the 
friend who's already been everywhere and packed perfectly.

IMPORTANT: You are NOT a general-purpose AI assistant. You help with 
travel, style, the FDV platform, and taste. If someone asks you to write 
code or solve math problems, gracefully redirect: "That's not really my 
world — but if you want to talk about where to eat in Marrakech, I'm 
your person."
```

---

## PART 5 — TASTE SIGNAL EXTRACTION (PHASE 2)

After conversation logging is live, add a nightly analysis job:

1. Load the day's concierge conversations
2. For each conversation with an authenticated user, run through Claude:
   ```
   Given this concierge conversation, extract any taste signals.
   Map to Wellspring axes where possible:
   - containment (0-1)
   - structure (0-1)  
   - entropy (0-1)
   - social_density (0-1)
   
   Also note:
   - Explicit preferences stated ("I don't like bold colors")
   - Implicit signals ("somewhere quiet" = low social_density)
   - Product interest (what they asked about)
   - Negative signals (what they rejected or avoided)
   ```
3. Write extracted signals to user_events table as `source: concierge_chat`
4. These signals feed the self-model on next refresh

**Don't build this yet.** Get conversation logging live first. The extraction can come after we have real conversation data to work with.

---

## IMPLEMENTATION PRIORITY

1. **Floating chat widget** — concierge everywhere, context-aware greetings
2. **Conversation logging** — every message stored, visible in admin
3. **Tiered message limits** — 3 anonymous, 15 free, unlimited Gold
4. **Gate messages** — concierge speaks the gate (not system modals)
5. **Knowledge expansion** — product catalog + voice guidelines in system prompt
6. **Admin integration** — conversations in user journey view
7. **Save-aware personalization** — Gold tier reads user saves (requires loading saves into prompt)
8. **Taste signal extraction** — Phase 2, after data accumulates

Items 1-4 should ship together. Item 5 can be same PR or fast follow. Items 6-7 are this week. Item 8 is next week.

---

## PART 6 — REAL-TIME WEATHER

### What it does:
The concierge can answer weather questions about any destination in real time — and weave it into style advice naturally.

### Implementation:
Integrate OpenWeatherMap API (free tier is sufficient for pilot volume).

```
GET https://api.openweathermap.org/data/2.5/forecast?q={city}&units=imperial&appid={API_KEY}
```

### Create a weather function the concierge can call:
When the user asks about weather (or when the concierge is giving packing/style advice for a destination), call the weather API and include the result in the response context.

### The FDV difference:
The concierge doesn't just report temperature. It translates weather into style:

- "Marrakech next week is hitting 85°F — linen everything, skip the leather jacket, and bring that Atlas scarf for the evenings when it drops."
- "Hydra in October is beautiful — mid-70s during the day but the wind off the Saronic picks up at night. Bring a wrap."
- "New York this weekend is classic spring — 60s and sunny. Trench coat weather. The cherry blossoms should be peaking."

### System prompt addition:
```
WEATHER: You have access to real-time weather data. When discussing 
travel plans, packing, or style for a specific destination and timeframe, 
check the weather and weave it naturally into your advice. Don't just 
report the forecast — translate it into what to wear and what to expect.
```

### Setup:
1. Get OpenWeatherMap API key (free tier)
2. Add as Vercel environment variable: OPENWEATHER_API_KEY
3. Create `/api/weather?city={city}` endpoint
4. Add weather tool to the concierge's Claude API call configuration

---

## SUCCESS CRITERIA
- Concierge is accessible from every page via floating icon
- Anonymous users feel the value in 3 messages and want to sign up
- Free users feel the depth in 15 messages and see why Gold matters
- Gold users feel KNOWN — the concierge references their saves and history
- Every conversation is logged and visible to Sharon in the admin dashboard
- The concierge can answer real-time weather questions and translate them into style advice
- The concierge never feels like a chatbot. It feels like a person with taste.
