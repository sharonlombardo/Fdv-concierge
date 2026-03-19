import { Link } from "wouter";

const BLOB = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2';

const fullWidthImg: React.CSSProperties = {
  width: '100%',
  maxHeight: 500,
  objectFit: 'cover',
  borderRadius: 8,
  margin: '32px 0',
};

export default function About() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafaf9" }}>
      <style>{`
        .inline-link {
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
          color: #1a1a1a;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .inline-link:hover {
          color: #c9a84c;
        }
      `}</style>
      <div className="max-w-[560px] mx-auto px-6 py-16 md:py-24">

        {/* Hero line */}
        <p
          className="text-center mb-10 md:mb-14"
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "clamp(20px, 5vw, 24px)",
            fontStyle: "italic",
            color: "#1a1a1a",
            lineHeight: 1.5,
          }}
        >
          FIL DE VIE is a state of mind.
        </p>

        {/* Image 1 — halter dress */}
        <img src={`${BLOB}/about-halter-dress`} alt="" style={fullWidthImg} />

        {/* Body section 1 */}
        <div
          className="space-y-5 mb-10 md:mb-12"
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "16px",
            color: "#1a1a1a",
            lineHeight: 1.7,
          }}
        >
          <p>
            We gather destinations, wardrobes, and experiences that share a certain sensibility — thoughtful travel, beautiful spaces, well-made things, and a quiet confidence about how it all fits together.
          </p>
          <p>
            Some people come here to plan a trip. Others come to find the right dress for a rooftop dinner in Marrakech, or to save a hotel they'll book next winter. However you use it, the idea is simple: when something moves you, save it.
          </p>
        </div>

        {/* Image 2 — santorini archway */}
        <img src={`${BLOB}/about-santorini-archway`} alt="" style={fullWidthImg} />

        {/* Divider */}
        <div className="flex justify-center my-10 md:my-12">
          <div style={{ width: 40, height: 1, backgroundColor: "#c9a84c" }} />
        </div>

        {/* Body section 2 */}
        <div
          className="space-y-5 mb-10 md:mb-12"
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "16px",
            color: "#1a1a1a",
            lineHeight: 1.7,
          }}
        >
          <p>
            Everything you save goes into your{" "}
            <Link href="/suitcase"><span className="inline-link">Suitcase</span></Link>.
          </p>
          <p>
            Your Suitcase is more than a place to keep things. It's a living portrait of what you love — and the more it holds, the better we can curate for you. Over time, we learn what matters to you and surface new stories, places, and pieces that feel like yours.
          </p>
          <p>
            From your{" "}
            <Link href="/suitcase"><span className="inline-link">Suitcase</span></Link>
            {" "}or <span className="inline-link" style={{ cursor: "pointer" }} onClick={() => window.dispatchEvent(new Event('open-hamburger'))}>sidebar</span>, you can tap{" "}
            <Link href="/suitcase?curate=true"><span className="inline-link">Curate for Me</span></Link>
            {" "}— which creates personalized edits drawn from what you've already saved — trips, looks, restaurants, objects, or combinations you wouldn't have thought to put together yourself. Your edits live in{" "}
            <Link href="/my-edits"><span className="inline-link">My Edits</span></Link>.
          </p>
        </div>

        {/* Image 3+4 — two side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '32px 0' }}>
          <img src={`${BLOB}/about-harbor-boats`} alt="" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 8 }} />
          <img src={`${BLOB}/about-woman-doorway`} alt="" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 8 }} />
        </div>

        {/* Divider */}
        <div className="flex justify-center my-10 md:my-12">
          <div style={{ width: 40, height: 1, backgroundColor: "#c9a84c" }} />
        </div>

        {/* WHAT'S AHEAD */}
        <p
          className="text-center mb-6"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#1a1a1a",
          }}
        >
          WHAT'S AHEAD
        </p>
        <div
          className="space-y-5 mb-10 md:mb-12"
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "16px",
            color: "#1a1a1a",
            lineHeight: 1.7,
          }}
        >
          <p>
            Right now, you're seeing the beginning. Here's where we're going.
          </p>
          <p>
            FIL DE VIE works in tiers — each one designed to meet you where you are.
          </p>
          <p>
            <em style={{ fontStyle: "italic", fontWeight: 600 }}>Browse freely.</em>{" "}
            Explore{" "}
            <Link href="/current"><span className="inline-link">The Current</span></Link>,
            {" "}save what resonates, and let your{" "}
            <Link href="/suitcase"><span className="inline-link">Suitcase</span></Link>
            {" "}grow.{" "}
            <Link href="/suitcase?curate=true"><span className="inline-link">Curate for Me</span></Link>
            {" "}creates personalized edits based on what you've saved. This is yours from the start.
          </p>
          <p>
            <em style={{ fontStyle: "italic", fontWeight: 600 }}>Go deeper with Gold.</em>{" "}
            Unlock full itineraries — day-by-day guides with outfits, restaurants, and experiences mapped to your trip. Access{" "}
            <Link href="/my-trips"><span className="inline-link">My Trips</span></Link>
            {" "}to organize everything around where you're going.
          </p>
          <p>
            <em style={{ fontStyle: "italic", fontWeight: 600 }}>The Concierge.</em>{" "}
            This is the full experience. Custom packing lists built for your trip. Itineraries tailored to your taste — not a template, yours. A personal concierge who can chat with you, suggest looks, handle bookings, and plan the details so you don't have to. Think of it less like a subscription and more like having someone who understands your taste on call.
          </p>
          <p style={{ marginTop: "2rem" }}>
            You get the things you love — the hotel, the dress, the dinner. The concierge is what finds them, curates them, and brings them to you.
          </p>
        </div>

        {/* Image 5 — pool swim */}
        <img src={`${BLOB}/about-pool-swim`} alt="" style={fullWidthImg} />

        {/* Divider */}
        <div className="flex justify-center my-10 md:my-12">
          <div style={{ width: 40, height: 1, backgroundColor: "#c9a84c" }} />
        </div>

        {/* HOW TO USE THE SITE */}
        <p
          className="text-center mb-6"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#1a1a1a",
          }}
        >
          HOW TO USE THE SITE
        </p>
        <div
          className="mb-10 md:mb-12"
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "16px",
            color: "#1a1a1a",
            lineHeight: 1.7,
          }}
        >
          <p>
            Start anywhere. Browse{" "}
            <Link href="/current"><span className="inline-link">The Current</span></Link>
            {" "}for stories. Explore{" "}
            <Link href="/guides"><span className="inline-link">destinations</span></Link>
            {" "}for{" "}
            <Link href="/guides"><span className="inline-link">travel guides</span></Link>
            {" "}and{" "}
            <Link href="/concierge"><span className="inline-link">itineraries</span></Link>.
            {" "}
            <Link href="/shop"><span className="inline-link">Shop</span></Link>
            {" "}for wardrobe and objects. When something catches you, save it. Your{" "}
            <Link href="/suitcase"><span className="inline-link">Suitcase</span></Link>
            {" "}does the rest.
          </p>
        </div>

        {/* Divider */}
        <div className="flex justify-center my-10 md:my-12">
          <div style={{ width: 40, height: 1, backgroundColor: "#c9a84c" }} />
        </div>

        {/* WHY FIL DE VIE */}
        <p
          className="text-center mb-6"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#1a1a1a",
          }}
        >
          WHY FIL DE VIE
        </p>
        <div
          className="mb-16 md:mb-20"
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "16px",
            color: "#1a1a1a",
            lineHeight: 1.7,
          }}
        >
          <p>
            Most platforms show you more. We show you less — but better. This isn't about endless options. It's about the right ones, remembered.
          </p>
        </div>

        {/* Image 6 — pool float (closing image) */}
        <img src={`${BLOB}/about-pool-float`} alt="" style={fullWidthImg} />

        {/* START BROWSING CTA */}
        <div className="text-center pb-16" style={{ marginTop: 32 }}>
          <Link href="/current">
            <span
              className="inline-block cursor-pointer transition-opacity hover:opacity-60"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#1a1a1a",
                borderBottom: "1px solid #1a1a1a",
                paddingBottom: "4px",
              }}
            >
              START BROWSING
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
}
