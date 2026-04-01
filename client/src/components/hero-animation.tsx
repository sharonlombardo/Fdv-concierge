import { useState, useEffect, useRef, useCallback } from "react";

const BLOB_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2";

// Destination images — atmospheric/editorial photography already in the codebase
const HERO_IMAGES = [
  // Morocco
  `${BLOB_BASE}/morocco-hero`,
  `${BLOB_BASE}/morocco-motion-1`,
  `${BLOB_BASE}/morocco-experience-1`,
  `${BLOB_BASE}/morocco-ritual-1`,
  // Hydra
  `${BLOB_BASE}/hydra-hero`,
  `${BLOB_BASE}/hydra-light-1`,
  `${BLOB_BASE}/hydra-light-2`,
  `${BLOB_BASE}/hydra-ritual-1`,
  // Mallorca
  `${BLOB_BASE}/slow-travel-hero`,
  `${BLOB_BASE}/slow-culture-1`,
  `${BLOB_BASE}/slow-museum`,
  `${BLOB_BASE}/slow-lunch`,
  // Amangiri
  `${BLOB_BASE}/retreat-hero`,
  `${BLOB_BASE}/retreat-motion-1`,
  `${BLOB_BASE}/retreat-place-1`,
  `${BLOB_BASE}/retreat-ritual-1`,
  // New York
  `${BLOB_BASE}/newyork-hero`,
  `${BLOB_BASE}/newyork-culture-1`,
  `${BLOB_BASE}/newyork-experience-1`,
  `${BLOB_BASE}/newyork-ritual-1`,
];

// Variable image durations — NOT uniform. Mix of medium cuts and longer holds.
const IMAGE_DURATIONS = [500, 400, 700, 350, 600, 450, 800, 400, 550, 350];

// --- TEXT SEQUENCE: 4 treatment types ---

type TextMoment =
  | { type: "greeting"; word: string; lang: string; scattered?: ScatteredPiece[] }
  | { type: "section"; word: string }
  | { type: "silent" }
  | { type: "whitecard"; word: string };

interface ScatteredPiece {
  text: string;
  style: React.CSSProperties;
}

const TEXT_SEQUENCE: TextMoment[] = [
  // 1. HOLA scattered
  {
    type: "greeting", word: "HOLA", lang: "es", scattered: [
      { text: "HO", style: { position: "absolute", top: "22%", left: "12%" } },
      { text: "LA", style: { position: "absolute", bottom: "25%", right: "10%" } },
    ],
  },
  // 2. Silent
  { type: "silent" },
  // 3. TRAVEL
  { type: "section", word: "TRAVEL" },
  // 4. White card: MOROCCO
  { type: "whitecard", word: "MOROCCO" },
  // 5. ΓΕΙΑ off-center left
  {
    type: "greeting", word: "ΓΕΙΑ", lang: "el", scattered: [
      { text: "ΓΕΙΑ", style: { position: "absolute", bottom: "30%", left: "10%" } },
    ],
  },
  // 6. MEMORIES
  { type: "section", word: "MEMORIES" },
  // 7. SALUTE scattered
  {
    type: "greeting", word: "SALUTE", lang: "it", scattered: [
      { text: "SA", style: { position: "absolute", top: "18%", left: "8%" } },
      { text: "LU", style: { position: "absolute", top: "48%", right: "12%" } },
      { text: "TE", style: { position: "absolute", bottom: "22%", left: "22%" } },
    ],
  },
  // 8. Silent
  { type: "silent" },
  // 9. THE NEW
  { type: "section", word: "THE NEW" },
  // 10. White card: HYDRA
  { type: "whitecard", word: "HYDRA" },
  // 11. ようこそ centered
  { type: "greeting", word: "ようこそ", lang: "ja" },
  // 12. TIPS
  { type: "section", word: "TIPS" },
  // 13. שָׁלוֹם off-center right
  {
    type: "greeting", word: "שָׁלוֹם", lang: "he", scattered: [
      { text: "שָׁלוֹם", style: { position: "absolute", top: "35%", right: "12%" } },
    ],
  },
  // 14. Silent
  { type: "silent" },
  // 15. SHOP
  { type: "section", word: "SHOP" },
  // 16. White card: MALLORCA
  { type: "whitecard", word: "MALLORCA" },
  // 17. HELLO lower-center
  {
    type: "greeting", word: "HELLO", lang: "en", scattered: [
      { text: "HELLO", style: { position: "absolute", bottom: "22%", left: "50%", transform: "translateX(-50%)" } },
    ],
  },
  // 18. TRAVEL
  { type: "section", word: "TRAVEL" },
  // 19. مرحبا centered
  { type: "greeting", word: "مرحبا", lang: "ar" },
  // 20. MEMORIES
  { type: "section", word: "MEMORIES" },
];

// Duration per treatment type (ms) — generous holds so each moment breathes
function getTextDuration(moment: TextMoment): number {
  switch (moment.type) {
    case "greeting": return [2200, 2000, 2400, 2100, 2300][Math.floor(Math.random() * 5)];
    case "section": return [1800, 1600, 2000, 1700, 1900][Math.floor(Math.random() * 5)];
    case "silent": return [800, 900, 1000, 850, 950][Math.floor(Math.random() * 5)];
    case "whitecard": return [650, 700, 750, 600][Math.floor(Math.random() * 4)];
  }
}

const SHARED_TEXT_STYLE: React.CSSProperties = {
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  fontSize: "clamp(42px, 8vw, 56px)",
  fontWeight: 700,
  letterSpacing: "0.18em",
  lineHeight: 1.1,
  margin: 0,
};

const SUBTITLE_STYLE: React.CSSProperties = {
  fontFamily: "'Lora', 'Cormorant Garamond', Georgia, serif",
  fontSize: 14,
  fontStyle: "italic",
  color: "rgba(255, 255, 255, 0.85)",
  letterSpacing: "0.04em",
  marginTop: 16,
};

export function HeroAnimation() {
  const [imageIndex, setImageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageDurationIndex = useRef(0);
  const imageTimerPaused = useRef(false);

  const currentMoment = TEXT_SEQUENCE[textIndex];
  const isWhiteCard = currentMoment.type === "whitecard";

  // Preload images
  useEffect(() => {
    let loaded = 0;
    const total = Math.min(HERO_IMAGES.length, 8);
    HERO_IMAGES.slice(0, total).forEach((src) => {
      const img = new Image();
      img.onload = () => { loaded++; if (loaded >= total) setImagesLoaded(true); };
      img.onerror = () => { loaded++; if (loaded >= total) setImagesLoaded(true); };
      img.src = src;
    });
    const fallback = setTimeout(() => setImagesLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, []);

  // Image cycling — pauses during white card moments
  const cycleImage = useCallback(() => {
    setImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    imageDurationIndex.current = (imageDurationIndex.current + 1) % IMAGE_DURATIONS.length;
  }, []);

  useEffect(() => {
    imageTimerPaused.current = isWhiteCard;
  }, [isWhiteCard]);

  useEffect(() => {
    if (!imagesLoaded || imageTimerPaused.current) return;
    const duration = IMAGE_DURATIONS[imageDurationIndex.current];
    const timer = setTimeout(cycleImage, duration);
    return () => clearTimeout(timer);
  }, [imageIndex, imagesLoaded, cycleImage, isWhiteCard]);

  // Text cycling — independent timer with variable durations per treatment
  const cycleText = useCallback(() => {
    setTextIndex((prev) => (prev + 1) % TEXT_SEQUENCE.length);
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    const duration = getTextDuration(TEXT_SEQUENCE[textIndex]);
    const timer = setTimeout(cycleText, duration);
    return () => clearTimeout(timer);
  }, [textIndex, imagesLoaded, cycleText]);

  // Show subtitle for greetings and section words only
  const showSubtitle = currentMoment.type === "greeting" || currentMoment.type === "section";

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: isWhiteCard ? "#F7F5F1" : "#0a0a0a",
        transition: "background-color 0.1s ease",
      }}
    >
      {/* Image layer — hidden during white card */}
      {!isWhiteCard && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${HERO_IMAGES[imageIndex]}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Overlay for text legibility — hidden during white card and silent */}
      {!isWhiteCard && currentMoment.type !== "silent" && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.3)" }} />
      )}

      {/* TEXT LAYER */}
      <div
        key={textIndex}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          animation: "heroTextFadeIn 0.6s ease-in-out",
        }}
      >
        {/* Treatment 1: Scattered greeting */}
        {currentMoment.type === "greeting" && currentMoment.scattered && (
          <>
            {currentMoment.scattered.map((piece, i) => (
              <p
                key={i}
                lang={currentMoment.lang}
                style={{
                  ...SHARED_TEXT_STYLE,
                  ...piece.style,
                  color: "#ffffff",
                  textTransform: currentMoment.lang === "ar" || currentMoment.lang === "he" || currentMoment.lang === "ja" ? "none" : "uppercase",
                }}
              >
                {piece.text}
              </p>
            ))}
            <p style={{ ...SUBTITLE_STYLE, position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
              Discover the world of FIL DE VIE
            </p>
          </>
        )}

        {/* Treatment 1 alt: Centered greeting (no scattered config) */}
        {currentMoment.type === "greeting" && !currentMoment.scattered && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <p
              lang={currentMoment.lang}
              style={{
                ...SHARED_TEXT_STYLE,
                color: "#ffffff",
                textTransform: currentMoment.lang === "ar" || currentMoment.lang === "he" || currentMoment.lang === "ja" ? "none" : "uppercase",
              }}
            >
              {currentMoment.word}
            </p>
            <p style={SUBTITLE_STYLE}>Discover the world of FIL DE VIE</p>
          </div>
        )}

        {/* Treatment 2: Section flash word */}
        {currentMoment.type === "section" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <p style={{ ...SHARED_TEXT_STYLE, color: "#ffffff", textTransform: "uppercase" }}>
              {currentMoment.word}
            </p>
            <p style={SUBTITLE_STYLE}>Discover the world of FIL DE VIE</p>
          </div>
        )}

        {/* Treatment 3: Silent — nothing rendered */}

        {/* Treatment 4: White title card */}
        {currentMoment.type === "whitecard" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ ...SHARED_TEXT_STYLE, color: "#1A1A18", textTransform: "uppercase" }}>
              {currentMoment.word}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes heroTextFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
