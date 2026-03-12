import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafaf9" }}>
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
            Everything you save goes into your Suitcase.
          </p>
          <p>
            Your Suitcase is more than a place to keep things. It's a living portrait of what you're drawn to — and the more it holds, the better we can curate for you. Over time, we learn what resonates and surface new stories, places, and pieces that feel like yours.
          </p>
          <p>
            You can also use Curate for Me, which creates personalized edits drawn from what you've already saved — trips, looks, restaurants, objects, or combinations you wouldn't have thought to put together yourself.
          </p>
        </div>

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
            Start anywhere. Browse The Current for stories. Explore destinations for travel guides and itineraries. Shop for wardrobe and objects. When something catches you, save it. Your Suitcase does the rest.
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

        {/* START BROWSING CTA */}
        <div className="text-center pb-16">
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
