import { useState, useEffect, useRef, useCallback } from "react";

const BLOB_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2";
const GUIDE_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco";

// Deep image pool — 30 editorial photos across 5 destinations
const HERO_IMAGES = [
  `${BLOB_BASE}/morocco-hero`,
  `${BLOB_BASE}/morocco-motion-1`,
  `${BLOB_BASE}/morocco-experience-1`,
  `${BLOB_BASE}/morocco-ritual-1`,
  `${BLOB_BASE}/destination-morocco`,
  `${GUIDE_BASE}/hero.jpg`,
  `${GUIDE_BASE}/stay-1-large.jpg`,
  `${GUIDE_BASE}/eat-1-large.jpg`,
  `${GUIDE_BASE}/exp-1-large.jpg`,
  `${GUIDE_BASE}/shop-1-large.jpg`,
  `${BLOB_BASE}/hydra-hero`,
  `${BLOB_BASE}/hydra-light-1`,
  `${BLOB_BASE}/hydra-light-2`,
  `${BLOB_BASE}/hydra-ritual-1`,
  `${BLOB_BASE}/destination-hydra`,
  `${BLOB_BASE}/slow-travel-hero`,
  `${BLOB_BASE}/slow-culture-1`,
  `${BLOB_BASE}/slow-museum`,
  `${BLOB_BASE}/slow-lunch`,
  `${BLOB_BASE}/destination-slow-travel`,
  `${BLOB_BASE}/retreat-hero`,
  `${BLOB_BASE}/retreat-motion-1`,
  `${BLOB_BASE}/retreat-place-1`,
  `${BLOB_BASE}/retreat-ritual-1`,
  `${BLOB_BASE}/destination-retreat`,
  `${BLOB_BASE}/newyork-hero`,
  `${BLOB_BASE}/newyork-culture-1`,
  `${BLOB_BASE}/newyork-experience-1`,
  `${BLOB_BASE}/newyork-ritual-1`,
  `${BLOB_BASE}/destination-new-york`,
];

// Image cut timing — energetic but not frantic
const IMAGE_DURATIONS = [600, 450, 800, 400, 650, 500, 900, 450, 700, 500];

// --- TEXT MOMENTS ---
// Stripped down to essentials. Mostly images, text is rare and special.
// Typewriter effect on all text. White cards get a clean silent beat before them.

interface TextMoment {
  type: "text" | "silent" | "whitecard";
  word?: string;
  position?: React.CSSProperties;
  fontSize?: string;
}

const SIZE_DEFAULT = "clamp(42px, 8vw, 56px)";
const SIZE_LARGE = "clamp(63px, 12vw, 84px)";

const TEXT_SEQUENCE: TextMoment[] = [
  // -- open with just images
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },
  // -- first word types in over images
  { type: "text", word: "HOLA", fontSize: SIZE_LARGE, position: { top: "25%", left: "10%" } },
  { type: "silent" },
  { type: "silent" },
  // -- clean beat, then white card
  { type: "silent" },
  { type: "whitecard", word: "MOROCCO" },
  // -- images breathe
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },
  // -- word
  { type: "text", word: "TRAVEL", position: { bottom: "28%", right: "8%" } },
  { type: "silent" },
  { type: "silent" },
  // -- word
  { type: "text", word: "ΓΕΙΑ", fontSize: SIZE_LARGE, position: { bottom: "30%", left: "10%" } },
  { type: "silent" },
  { type: "silent" },
  // -- clean beat, then white card
  { type: "silent" },
  { type: "whitecard", word: "HYDRA" },
  // -- images breathe
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },
  // -- word
  { type: "text", word: "MEMORIES", fontSize: SIZE_LARGE, position: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" } },
  { type: "silent" },
  { type: "silent" },
  // -- word
  { type: "text", word: "SALUTE", position: { top: "22%", right: "10%" } },
  { type: "silent" },
  { type: "silent" },
  // -- clean beat, then white card
  { type: "silent" },
  { type: "whitecard", word: "MALLORCA" },
  // -- images breathe
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },
  // -- word
  { type: "text", word: "SHOP", fontSize: SIZE_LARGE, position: { top: "25%", left: "10%" } },
  { type: "silent" },
  { type: "silent" },
  // -- word
  { type: "text", word: "HELLO", position: { bottom: "25%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },
];

// Durations
function getTextDuration(moment: TextMoment): number {
  switch (moment.type) {
    // Text moments need to hold long enough for typewriter to finish + a beat
    case "text": return [2400, 2200, 2600, 2300, 2500][Math.floor(Math.random() * 5)];
    case "silent": return [1100, 1200, 1400, 1000, 1300][Math.floor(Math.random() * 5)];
    case "whitecard": return [650, 700, 750, 600][Math.floor(Math.random() * 4)];
  }
}

// --- TYPEWRITER HOOK ---
function useTypewriter(text: string, speed: number = 70) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    if (!text) return;

    const timer = setInterval(() => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayed;
}

const TEXT_STYLE: React.CSSProperties = {
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 700,
  letterSpacing: "0.18em",
  lineHeight: 1.1,
  margin: 0,
  textTransform: "uppercase",
};

const SUBTITLE_STYLE: React.CSSProperties = {
  fontFamily: "'Lora', 'Cormorant Garamond', Georgia, serif",
  fontSize: 14,
  fontStyle: "italic",
  color: "rgba(255, 255, 255, 0.85)",
  letterSpacing: "0.04em",
  position: "absolute",
  bottom: "8%",
  left: "50%",
  transform: "translateX(-50%)",
  textAlign: "center",
  whiteSpace: "nowrap",
};

// --- Typewriter text component ---
function TypewriterText({ word, style, color }: { word: string; style: React.CSSProperties; color: string }) {
  const displayed = useTypewriter(word, 80);
  return (
    <p style={{ ...TEXT_STYLE, fontSize: SIZE_DEFAULT, ...style, color }}>
      {displayed}
      <span style={{ opacity: displayed.length < word.length ? 0.6 : 0, transition: "opacity 0.1s" }}>|</span>
    </p>
  );
}

export function HeroAnimation() {
  const [imageIndex, setImageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageDurationIndex = useRef(0);
  const imageTimerPaused = useRef(false);

  const currentMoment = TEXT_SEQUENCE[textIndex];
  const isWhiteCard = currentMoment.type === "whitecard";

  // Preload first batch of images
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

  // Image cycling — pauses during white cards
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

  // Text sequence cycling
  const cycleText = useCallback(() => {
    setTextIndex((prev) => (prev + 1) % TEXT_SEQUENCE.length);
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    const duration = getTextDuration(TEXT_SEQUENCE[textIndex]);
    const timer = setTimeout(cycleText, duration);
    return () => clearTimeout(timer);
  }, [textIndex, imagesLoaded, cycleText]);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: isWhiteCard ? "#F7F5F1" : "#0a0a0a",
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

      {/* Overlay for text legibility — only when text is showing */}
      {currentMoment.type === "text" && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.25)" }} />
      )}

      {/* TEXT LAYER */}
      <div key={textIndex} style={{ position: "absolute", inset: 0, zIndex: 2 }}>

        {/* Typewriter text over images */}
        {currentMoment.type === "text" && currentMoment.word && (
          <>
            <TypewriterText
              word={currentMoment.word}
              style={currentMoment.position || {}}
              color="#ffffff"
            />
            <p style={SUBTITLE_STYLE as React.CSSProperties}>
              Discover the world of FIL DE VIE
            </p>
          </>
        )}

        {/* White card — typewriter in black on white */}
        {isWhiteCard && currentMoment.word && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TypewriterText
              word={currentMoment.word}
              style={{}}
              color="#1A1A18"
            />
          </div>
        )}
      </div>
    </section>
  );
}
